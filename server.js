"use strict";

// -------------------------------- DECLARE VARIABLES --------------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config(".env");
const expressLayouts = require("express-ejs-layouts");
const pg = require("pg");

const methodOverride = require('method-override');


const client = new pg.Client(process.env.DATABASE_URL);

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

// override http methods
app.use(methodOverride("_method"));

//set database and connect to the server
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log("I am listening to port: ", PORT);
  });
});

// -------------------------------- ROUTES --------------------------------

// Home route
app.get("/", homeHandler);

// get search
app.get("/search", searchHandler);

// add meal to fav
app.post("/addFav", addFav);

// Fav route
app.get("/fav", favHandler);

// delete recipe from fav
app.delete("/recipe/:id" , deleteFav);

// get calculator
app.get("/calculate", calculateCalories);

// post calories
// app.get("/", homeHandler);

// get recipe by uri
app.get("/recipeDetails/", recipeDetailsHnadler);

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
    recipes: recipes,
  });
}

//fav
async function favHandler(req, res) {
  let result = await getRecipeDB();
  res.render("pages/fav", { meals: result.meals });
}

async function addFav(req, res) {
  let recipeInfo = req.body;
  recipeInfo.ingredients = recipeInfo.ingredients.split(",");
  let dateNow = new Date();
  let localDate = dateNow.toLocaleDateString();
  recipeInfo.data = localDate;
  let result = await saveRecipeDB(recipeInfo);
}

async function deleteFav(req, res) {
  const recipeId = req.params.id;
  let result = await deleteRecipeDB(recipeId);
}



//calculate
function calculateCalories(req, res) {
  res.render("pages/calorieCalculator");
}
//recipe details
async function recipeDetailsHnadler(req, res) {
  let uri = req.query.uri;
  let recipe = await getRecipeByURI(uri);
  res.send(recipe);
}

// -------------------------------- API FUNCTIONS --------------------------------

//search recipe API
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

// get recipe by it's uri
function getRecipeByURI(uri) {
  let url = "https://api.edamam.com/search";
  let queryParams = {
    r: uri,
    app_id: APP_ID,
    app_key: APP_KEY,
  };
  console.log(queryParams);
  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {
      return new Recipe({ recipe: res.body[0] });
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

// -------------------------------- DATA FUNCTIONS --------------------------------

// save recipe into database
function saveRecipeDB(recipeInfo) {
  let SQL =
    "INSERT INTO recipes (title,totalCalories,ingredients,uri,servings,instructions_url,calPerServ,image,date ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id";
  let recipeArray = [
    recipeInfo.title,
    recipeInfo.totalCalories,
    recipeInfo.ingredients,
    recipeInfo.uri,
    recipeInfo.servings,
    recipeInfo.instructions_url,
    recipeInfo.calPerServ,
    recipeInfo.image,
    recipeInfo.data,
  ];
  return client.query(SQL, recipeArray).then((result) => {
    console.log(result);
    // return result.rows;
  });
}

// Get recipe from database
function getRecipeDB() {
  let SQL = "SELECT * FROM recipes";
  return client.query(SQL).then((result) => {
    return { meals: result.rows };
  });
}

 // delete recipe from database
function deleteRecipeDB(recipeId){
  let SQL = `DELETE FROM recipes WHERE id=${recipeId}`;
  return client.query(SQL).then(result => {
    return result.rows;
});
}


// -------------------------------- CONSTRUCTORS --------------------------------
function Recipe(data) {
  this.uri = encodeURIComponent(data.recipe.uri);
  this.title = data.recipe.label;
  this.image = data.recipe.image;
  this.ingredients = data.recipe.ingredientLines;
  this.totalCalories = Math.round(data.recipe.calories);
  this.servings = data.recipe.yield;
  this.instructions_url = data.recipe.url;
  this.calPerServ = Math.round(this.totalCalories / this.servings);
}
