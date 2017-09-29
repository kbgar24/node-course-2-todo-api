const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const users = [{
  name: 'Kendrick',
  email: 'kbgar24@gmail.com',
  age: 28
},{
  name: 'Kamille',
  email: 'gardnerkamille@gmail.com',
  age: 26
}];



beforeEach((done)=> {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  });

  User.remove({}).then(() => {
    return User.insertMany(users);
  }).then(() => done());

});

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e))
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });


});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

// describe('POST /users', () => {
//   it('Should add users to the database', (done) => {
//     var user = {
//       name: 'Aura',
//       email: 'aura.gardner@davenport.edu',
//       age: 52
//     };
//
//     request(app)
//       .post('/users')
//       .send(user)
//       .expect(200)
//       // .expect((res) => {
//       //   // expect(res.body).toEqual(user);
//       // })
//       .end((e, res) => {
//         if (e) {
//           return done(e);
//         }
//         User.find(user)
//           .then((users) => {
//               expect(users.length).toBe(1);
//               expect(users[0]).toBe(user);
//               done();
//           }).catch((e) => done(e));
//       });
//   });
// });

describe('GET /todos/:id', () => {
  it('Should retrieve users from database', (done) => {
    var id = todos[0]._id.toHexString()
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  })

});

describe('DELETE /todos/:id', () => {
  it('Should delete a todo', (done) => {
    var id = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id)
          .then((todo) => {
            expect(todo).toBeFalsy();
            done();
          }).catch((e) => done(e))
      })
  });

  it('Should return a 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done)

  });

  it('Should return 404 if object is is invalid', (done) => {
    var id = '123'

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done)

  });
})

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
    var body = {
      text: 'This is the new text',
      completed: true,
    }
    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');

      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id)
          .then((todo) => {
            expect(todo.completed).toBe(true);
            expect(typeof todo.completedAt).toBe('number');
            expect(todo.text).toBe(body.text);
            done();
          }).catch((e) => done(e));
      });
  });

  it('Should clear completedAt when todo is not completed', () => {
    var id = todos[1]._id.toHexString();
    var body = {
      completed: false,
    };

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBeFalsy();
      }).end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(id)
          .then((todo) => {
            expect(todo.completedAt).toBeFalsy();
            expect(todo.completed).toBe(true);
            done();
          })
      })
  });
})
