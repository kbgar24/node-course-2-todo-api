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

  //findOneAndUpdate

  // db.collection('Todos').findOneAndUpdate({
  //     _id: new ObjectID('59cd7b5d0a9bc7d0b922495b')
  //   }, {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   }).then((res) => {
  //     console.log(res);
  //   })
//incr age
  db.collection('Users').findOneAndUpdate({
    name: 'Jen'
  }, {
        $set: {
          name: 'Kendrick\'s Mom'
        },
        $inc: {
          age: 1
        }
    },{
      returnOriginal: false
  }).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err);
  });


//change name

  db.close();
});
