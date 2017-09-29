const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


var app = express();

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

// app.get(`/todos/${id}`, (req, res) => {
//   Todo.find()
//     .then((todos) => {
//       var todo = todos.filter((todo) => {
//         return todo._id === id
//       });
//       if (todo.length) {
//         res.send({todo})
//       } else {
//         res.send(`There is no todo with id '${id}'`);
//       }
//     })
// })

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});

module.exports = {app}
