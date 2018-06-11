const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const verifyToken = require('../config/verifytoken');

// Handle login
router.post('/', (req, res) => {
  const userid = req.body.userid;
  const password = req.body.password;

  // Search for userid in User Collection
  User.findOne({userid: userid})
  .then(user => {
    if (user != null) {
      const hashedPassword = user.password;

      // password validation
      bcrypt.compare(password, hashedPassword, function(err, match) {
        if (!err) {
          if (match) {

            // Generate and send token to client in response
            jwt.sign({user}, 'secretkey', (err, token) => {
                res.json({
                  'success': true,
                  token
                });
              });
          }

          // Invalid password
          else {
            res.status(404);
            res.json({'success': false, 'msg': 'Invalid userID or password'});
          }
        }

      });
    }


    // Invalid userid
    else {
      res.status(404);
      res.json({'success': false, 'msg': 'Invalid userID or password'});
    }

  })
  .catch(err => {
      res.status(500);
      res.json({'success': false, 'msg': 'Internal server error'});
  });
});




// Temporary
router.post('/check', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    console.log(authData);
    console.log('error', err);
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Received token'
      });
    }
  });
});


module.exports = router;
