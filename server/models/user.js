const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save()
    .then((user) => {
      var token = _.find(user.tokens, (token) => token.access === 'auth').token;
      return token;
    })
    .catch((e) => {
      return e;
    });
};

// UserSchema.methods.findByToken = function(desiredToken) => {
//   User.find()
//     .then((users) => {
//       users.filter((user) => {
//         return user.tokens.filter((token) => {
//           return token === desiredToken;
//         });
//       });
//     })
// }

var User = mongoose.model('User', UserSchema);

module.exports = {User};
