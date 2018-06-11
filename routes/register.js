const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');


router.post('/',[
  // Validate password
  check('password', 'Password must be at least 4 chars long')
   .isLength({ min: 4 }),

   // Validate name
   check('name', 'Invalid name')
    .matches('^[a-zA-Z ]+$'),

    // validate email
    check('email')
      .isEmail().withMessage('Invalid email')
      .trim()
      .normalizeEmail()
      .custom(value => {
      return User.findOne({email: value}).then(email => {
        if (email != null)
          throw new Error('This email is already in use');
      })
    }),

  // Validate userid
  check('userid')
    .isLength(3).withMessage('UserID must be at least 3 chars long')
    .matches('^[A-Za-z0-9_]+$').withMessage('UserID can only contain alphanumeric characters and underscore')
    .custom(value => {
    return User.findOne({userid: value}).then(user => {
      if (user != null)
        throw new Error('This UserID is already in use');
    })
    })

], (req, res, next) => {
  const errors = validationResult(req);

  // send errors in response if present
  if (!errors.isEmpty()) {
    let err = []
    for (let key in errors.mapped()) {
      err.push(errors.mapped()[key].msg);
    }
    return res.status(422).json({success: false, errors: err});
  }

  const user = matchedData(req);

  let newUser = new User ({
    _id: mongoose.Types.ObjectId(),
    name: user.name,
    email: user.email,
    userid: user.userid,
    password: user.password
  });

  // Add new user to Database
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, errors: ['Failed to register user']});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

// check for unique email
router.get('/uniqueemail/:email', (req, res) => {
  const email = req.params.email;

  User.findOne({email: email})
  .then(email => {
    if (email != null)
      res.json({'available': false});
    else
      res.json({'available': true});
  })
  .catch(err => {
      res.status(500);
      res.json({'msg': 'Internal server error'});
  });

});

// check for unique userid
router.get('/uniqueuserid/:userid', (req, res) => {
  const userid = req.params.userid;

  User.findOne({userid: userid})
  .then(user => {
    if (user != null)
      res.json({'available': false});
    else
      res.json({'available': true});
  })
  .catch(err => {
      res.status(500);
      res.json({'msg': 'Internal server error'});
  });

});


module.exports = router;
