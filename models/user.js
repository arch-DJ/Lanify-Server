const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

// User Schema
const userSchema = mongoose.Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userid: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  admin: {
    type: Boolean
  },

  moderator: {
    type: Boolean
  }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback) {
  let plaintextPassword = newUser.password;
  let userid = newUser.userid;
  let email = newUser.email;
  const saltRounds = 10;


  bcrypt.hash(plaintextPassword, saltRounds, function(err, hash) {
    if (err) {
      throw err;
    }

    newUser.password = hash;
    newUser.save(callback);
  });
}
