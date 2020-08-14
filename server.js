'use strict';

// -------------------------------- DECLARE VARIABLES --------------------------------
const express = require('express');
const cors = require('cors');
require('dotenv').config('.env');
// const pg = require('pg');
// var methodOverride = require('method-override');

// initialize the server
const app = express();

// Declare a port
const PORT = process.env.PORT || 3000;

// view engine setup
app.set('view engine', 'ejs');

//setup public folder
app.use(express.static('./public'));

//set the encode for post body request
app.use(express.urlencoded({ extended: true }));

// connect to the server
app.listen(PORT, () => {
  console.log('I am listening to port: ', PORT);
});
