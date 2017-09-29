
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//   console.log(res);
// }).catch((e) => console.log(e));
//
// Todo.findOneAndRemove()

Todo.findByIdAndRemove('59ce03250a9bc7d0b9229e00')
  .then((todo) => {
    console.log(todo);
  }).catch((e) => console.log(e));
