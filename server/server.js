const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


var app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({todos});
    }).catch((err) => {
      res.status(400).send(err);
    });
});

app.post('/users', (req, res) => {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
  });

  user.save()
    .then((doc) => {
      res.send(doc);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.send({users})
    }).catch((err) => res.status(400).send(err));
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
  //get the id
  var id = req.params.id;

  //validate the id -> return 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        res.status(404).send('not found');
      }
      res.send({todo});
    }).catch((e) => res.status(400).send());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});

module.exports = {app}
