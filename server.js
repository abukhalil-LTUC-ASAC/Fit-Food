"use strict";

// -------------------------------- DECLARE VARIABLES --------------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config(".env");
const expressLayouts = require("express-ejs-layouts");
// const pg = require('pg');
// var methodOverride = require('method-override');

// initialize the server
const app = express();

// Declare a port
const PORT = process.env.PORT || 3000;

// Declare a app id for edmam
const APP_ID = process.env.APP_ID;

// Declare a app id for edmam
const APP_KEY = process.env.APP_KEY;

// using layouts
app.use(expressLayouts);

// Use cros
app.use(cors());

// Use super agent
const superagent = require("superagent");

// view engine setup
app.set("view engine", "ejs");

//setup public folder
app.use(express.static("public"));

//set the encode for post body request
app.use(express.urlencoded({ extended: true }));

// connect to the server
app.listen(PORT, () => {
  console.log("I am listening to port: ", PORT);
});

// -------------------------------- ROUTES --------------------------------

// Home route
app.get("/", homeHandler);

// get search
app.get("/search", searchHandler);

//search result
// app.get("/recipeResult", recipeResultHandler);

// -------------------------------- CALLBACK FUNCTIONS --------------------------------

//home
function homeHandler(req, res) {
  res.render("index");
}

//search
async function searchHandler(req, res) {
  let ingredients = req.query.searchFood;
  let from = req.query.from;
  let to = req.query.to;
  let diet = req.query.diet;
  let health = req.query.health;
  let recipes = await getRecipes(ingredients, from, to, diet, health);
  res.render("pages/recipeResult", {
    recipes: recipes
  });
}

//Recipe result
// function recipeResultHandler(req, res) {
  // res.render("pages/recipeResult");
// }

// -------------------------------- API FUNCTIONS --------------------------------

function getRecipes(ingredients, from, to, diet, health) {
  let url = "https://api.edamam.com/search";
  let queryParams = {
    q: ingredients,
    app_id: APP_ID,
    app_key: APP_KEY,
    calories:
      from && to ? `${from}-${to}` : from ? `${from}+` : to ? `${to}` : "0+",
    diet: diet,
    health: health,
  };
  console.log(queryParams);
  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {
      return res.body.hits.map((e) => {
        return new Recipe(e);
      });
    })
    .catch((error) => {
      return {
        status: error.status,
        message: error.response.text,
      };
    });
  return result;
}

// -------------------------------- CONSTRUCTORS --------------------------------

function Recipe(data) {
  this.title = data.recipe.label;
  this.image = data.recipe.image;
  this.ingredients = data.recipe.ingredientLines;
  this.totalCalories = Math.round(data.recipe.calories);
  this.servings = data.recipe.yield;
  this.instructions_url = data.recipe.url;
  this.calPerServ = Math.round(this.totalCalories / this.servings);
}
