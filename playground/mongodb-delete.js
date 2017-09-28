// const MongoClient = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  } else {
    console.log('Connected to MongoDB server')
  }

  //deleteMany

  // db.collection('Todos').deleteMany({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result);
  //   }).catch((err) => {
  //     console.log('Unable to delete many', err)
  //   })

  //deleteOne

  // db.collection('Todos').deleteOne({text: 'Eat lunch'})
  //   .then((result) => {
  //     console.log(result)
  //   }).catch((err) => {
  //     console.log('Unable to delete one', err);
  //   })

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false})
  //   .then((res) => {
  //     console.log(res)
  //   }).catch((err) => {
  //     console.log('Unable to find and delete', err);
  //   })

db.collection('Users').deleteMany({name: 'Kendrick'})
  .then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err);
  })

db.collection('Users').findOneAndDelete({_id: new ObjectID('59cd6de68ddf053bbd916e9f')})
  .then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log('unable to delete', err);
  })

  db.close();
});
