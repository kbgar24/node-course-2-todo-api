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

  // db.collection('Todos').find({
  //   _id: new ObjectID('59cd6ca214e89a3bb41ae144')
  // }).toArray()
  //   .then((docs)=>{
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }).catch((err) => {
  //     console.log('Unable to fetch todos', err);
  //   })

    // db.collection('Todos').find({
    //   _id: new ObjectID('59cd6ca214e89a3bb41ae144')
    // }).count()
    //   .then((count)=>{
    //     console.log(`Todos count: ${count}`);
    //   }).catch((err) => {
    //     console.log('Unable to count todos', err);
    //   })

    db.collection('Users').find({
      name: 'Kendrick'
    }).count()
      .then((count) => {
        console.log(`User count: ${count}`);
      }).catch((err) => {
        console.log('Unable to count users', err);
      })

  db.close();
});
