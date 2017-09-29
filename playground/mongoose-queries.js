
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59cdf44b9806cf3f360ef553';
// var id = '69cde643401eff3e6aac221711';
//
// if (!ObjectID.isValid(id)) {
//     return console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// if (!todo) {
//   return console.log('Id not found');
// }
//   console.log('Todo', todo);
// }).catch((e) => console.log(e))

//query users collection
//user.findByID
//query works, no user
//query found
//handle error

User.findById(id)
  .then((user) => {
    if (!user) {
      return console.log('User not found');
    }
    console.log('user: ', user);
  }).catch((e) => console.log(e));
