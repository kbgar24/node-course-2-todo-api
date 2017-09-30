require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');


var app = express();

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({todos});
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user)
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// POST /users/login (email, password)
// check db for user
app.post('/users/login', (req, res) => {
  var password = req.body.password;
  var email = req.body.email

  User.findByCredentials(email, password)
  .then((user) => {
    return user.generateAuthToken()
    .then((token) => {
      res.header('x-auth', token).send(user);
    });
  })
  .catch((e) => {
    res.status(400).send();
  });
});




app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.send({users})
    })
    .catch((err) => res.status(400).send(err));
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  //Validate ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        res.status(404).send();
      } else {
        res.send({todo});
      }
    }).catch((e) => res.status(400).send());
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        res.status(404).send()
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
  .then(() => {
    res.status(200).send()
  })
  .catch((e) => {
    res.status(400).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});

module.exports = {app}
