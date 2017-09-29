const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
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

describe('POST /users', () => {
  it('Should add users to the database', (done) => {
    var user = {
      name: 'Aura',
      email: 'aura.gardner@davenport.edu',
      age: 52
    };

    request(app)
      .post('/users')
      .send(user)
      .expect(200)
      // .expect((res) => {
      //   // expect(res.body).toEqual(user);
      // })
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        User.find(user)
          .then((users) => {
              expect(users.length).toBe(1);
              expect(users[0]).toBe(user);
              done();
          }).catch((e) => done(e));
      });
  });
});