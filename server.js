'use strict';

// -------------------------------- DECLARE VARIABLES --------------------------------
const express = require('express');
const cors = require('cors');
require('dotenv').config('.env');
const expressLayouts = require('express-ejs-layouts');
// const pg = require('pg');
// var methodOverride = require('method-override');

// initialize the server
const app = express();

// Declare a port
const PORT = process.env.PORT || 3000;

// using layouts
app.use(expressLayouts);

// Use cros
app.use(cors());

// Use super agent
const superagent = require('superagent');
// view engine setup
app.set('view engine', 'ejs');

//setup public folder
app.use(express.static('public'));

//set the encode for post body request
app.use(express.urlencoded({ extended: true }));

// connect to the server
app.listen(PORT, () => {
  console.log('I am listening to port: ', PORT);
});


// -------------------------------- Routes --------------------------------

// Home route
app.get('/', (req, res)=>{
  res.render('index')
});
