const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('Should create a new todo', (done) => {
    var token = users[0].tokens[0].token;
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', token)
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
    var token = users[0].tokens[0].token;

    request(app)
      .post('/todos')
      .set('x-auth', token)
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
  var token = users[0].tokens[0].token;

  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  var token = users[0].tokens[0].token;

  it('Should retrieve todos from database', (done) => {
    var id = todos[0]._id.toHexString()
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should only retrieve todos from logged in user', (done) => {
    var id = todos[1]._id.toHexString()
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', token)
      .expect(404)
      .end(done);
  })

});

describe('DELETE /todos/:id', () => {
  var token = users[1].tokens[0].token;

  it('Should delete a todo', (done) => {
    var id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', token)
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
      .set('x-auth', token)
      .expect(404)
      .end(done)

  });

  it('Should return 404 if object is is invalid', (done) => {
    var id = '123'

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', token)
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

  it('Should clear completedAt when todo is not completed', (done) => {
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
            expect(todo.completed).toBe(false);
            done();
          }).catch((e) => done(e));
      });
  });
})

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done)
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    var newUser = {
      email: 'newUser@email.com',
      password: 'newUserPWD'
    };

    request(app)
    .post('/users')
    .send(newUser)
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body.email).toBe(newUser.email)
      expect(res.body._id).toBeTruthy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findOne({email: newUser.email})
      .then((user)=> {
        expect(user.email).toBe(newUser.email);
        expect(user.password).not.toBe(newUser.password);
        done()
      }).catch((e) => done(e))
    });

  });

  it('Should return validation error if password is invalid', (done) => {
    var user = {
      email: 'newUser@email.com',
      password: '1'
    };
    request(app)
    .post('/users')
    .send(user)
    .expect(400)
    .expect((res) => {
      expect(res.clientError).toBe(true);
    })
    .end(done);
  });

  it('Should return validation error if email is invalid', (done) => {
    var user = {
      email: '1',
      password: 'abc123'
    }
    request(app)
    .post('/users')
    .send(user)
    .expect(400)
    .expect((res) => {
      expect(res.clientError).toBe(true);
    })
    .end(done);

  });
  //
  it('Should not create user if email is in use', (done) => {
    var user = users[0];
    request(app)
    .post('/users')
    .send(user)
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe(11000);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.find({email: user.email})
      .then((users) => {
        expect(users.length).toBe(1);
        done()
      })
      .catch((err) => done(err));
    })
  });

});

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    var {email, password} = _.pick(users[1], ['email', 'password']);
    var token;

    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      token = res.header['x-auth'];
      expect(token).toBeTruthy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[1]._id)
      .then((user) => {
        expect(user.tokens[0].access).toBe('auth');
        expect(user.tokens[1].token).toBe(token);
        done();
      })
      .catch((e) => done(e));
    });
  });


  it('Should reject invalid login', (done) => {
    var email = users[1].email;
    var password ='wrongPassword1';

    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err, res) => {
      User.findById(users[1]._id)
      .then((user) => {
        expect(user.tokens.length).toBe(1);
        done()
      }).catch((e) => done(e));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', (done) => {
    var id = users[0]._id;
    var token = users[0].tokens[0].token;

    request(app)
    .delete('/users/me/token')
    .set('x-auth', token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      User.findById(id)
      .then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      })
      .catch((e) => done(e));
    });
  });
});
