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

  // db.collection('Todos').insertOne({
  //   text: "something to do",
  //   completed: false
  // }, (err, res) => {
  //   if (err) {
  //     console.log('unable to insert todo', err);
  //   } else {
  //     console.log(JSON.stringify(res.ops, undefined, 2));
  //   }
  // })

  //insert new doc into suers coll,
  //name, age, loc string)
  // db.collection('Users').insertOne({
  //   name: 'Kendrick',
  //   age: 28,
  //   location: 'Austin, TX'
  // }, (err, res) => {
  //   if (err) {
  //     console.log('Unable to inset user', err);
  //   } else {
  //     console.log(res.ops[0]._id.getTimeStamp());
  //   }
  // })
  db.close();
});
