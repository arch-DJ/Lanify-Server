// imports
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config/database');
const cors = require('cors');

// Import Routes
const register = require('./routes/register');
const login = require('./routes/login');

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri(), (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
});

// Cross origin resource sharing for development purpose
app.use(cors({ origin: 'http://localhost:4200' }));

// Using body parser for some routes
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use('/register', register);
app.use('/login', login);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid endpoint. You are not supposed to view this page directly!');
});


// Starting server
app.listen(3000, () => console.log('Lanify server started on port 3000!'));
