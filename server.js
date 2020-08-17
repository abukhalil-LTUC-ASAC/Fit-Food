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
// Declare a app id for edmam
const APP_ID_NUT = process.env.APP_ID_NUT;
// Declare a app id for edmam
const APP_KEY_NUT = process.env.APP_KEY_NUT;

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
app.delete("/recipe/:id", deleteFav);

// get calculator
app.get("/calculate", calculateCalories);

// post ingredients
app.post("/dataIng", renderIngredients);

// get recipe by uri
app.get("/recipeDetails/", recipeDetailsHandler);


// aboutus route
app.get("/aboutus",aboutusHandler);

//Error route 
app.all('*' , errorHandler);


// all other routes
// app.get("*", errorHandler);

// -------------------------------- CALLBACK FUNCTIONS --------------------------------

//home
function homeHandler(req, res) {
  res.render("index");
}


//aboutus
function aboutusHandler(req, res){
  res.render("pages/aboutus");

//error
function errorHandler(req,res) {
  res.status(404).render('pages/error');

}

//search
async function searchHandler(req, res) {
  let ingredients = req.query.searchFood;
  let from = req.query.from;
  let to = req.query.to;
  let diet = req.query.diet;
  let health = req.query.health;
  let excluded = req.query.excluded;
  let ingr = req.query.ingr;

  let recipes = await getRecipes(
    ingredients,
    from,
    to,
    diet,
    health,
    excluded,
    ingr
  );

  res.render("pages/recipeResult", {
    recipes: recipes
  });
  // if (recipes.status === 200) {
  //   res.render("pages/recipeResult", {
  //     recipes: recipes,
  //   });
  // } else {
  //   res.render('pages/error' , {
  //     error : recipes,
  //   })
  //   console.log(recipes);
  // }
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
  res.redirect('/fav');

}

//calculate
function calculateCalories(req, res) {
  res.render("pages/calorieCalculator");
}

// render result 
async function renderIngredients(req, res) {
  let length = Math.floor(Object.keys(req.body).length / 3) - 1;
  // let stringArray = [];

  for (var i = 0; i <= length; i++) {
    let stringName = 'searchIngredient' + i;
    let stringAmount = 'ingredientAmount' + i;
    let stringMeasure = 'ingredientMeasure' + i;
    let allString = req.body[stringName] + ' ' + req.body[stringAmount] + ' ' + req.body[stringMeasure];
    // stringArray.push(allString);
    // console.log(stringArray);

    let nutrition = await getNutrition(allString);
    console.log(nutrition);

  }
}

//recipe details
async function recipeDetailsHandler(req, res) {
  let uri = req.query.uri;
  let recipe = await getRecipeByURI(uri);
  res.render('pages/recipeDetail', { recipe: recipe });
}


// -------------------------------- API FUNCTIONS --------------------------------

//search recipe API
function getRecipes(ingredients, from, to, diet, health, excluded, ingr) {
  console.log('ingr: ',ingr);
  let url = "https://api.edamam.com/search";
  let queryParams = {
    q: ingredients,
    app_id: APP_ID,
    app_key: APP_KEY,
    calories:
      from && to ? `${from}-${to}` : from ? `${from}+` : to ? `${to}` : "0+",
    diet: diet,
    health: health,
    excluded: excluded,
    ingr: ingr
  };

  if (excluded.length === 0) {
    delete queryParams.excluded;
  };

  if (ingr.length === 0) {
    delete queryParams.ingr;
  };
  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {
      console.log(res.body);
      return res.body.hits.map((e) => {
        return new Recipe(e);
      });
    })
    .catch((error) => {
      return handleError(error, res);
//       console.log(error);

//       return {
//         status: error.status,
//         message: error.response.text,
//       };
    });
  return result;
}

//search nutrition API
function getNutrition(string) {
  let url = "https://api.edamam.com/api/nutrition-data";
  let queryParams = {
    app_id: APP_ID_NUT,
    app_key: APP_KEY_NUT,
    ingr: string
  };
  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {
      console.log(res.body);
      return new Nutrients(res.body);
    })
    .catch((error) => {
      return handleError(error, res);
    })
  console.log(result);
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
      return handleError(error, res);
    })
  return result;
}

//error function 
function handleError(error, res) {
  console.error(error);
  res.render('pages/error', {error: error});
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
  return client.query(SQL, recipeArray)
    .then((result) => {
      console.log(result);
      // return result.rows;
    })
    .catch((error) => {
      return handleError(error, res);
    })
}

// Get recipe from database
function getRecipeDB() {
  let SQL = "SELECT * FROM recipes";
  return client.query(SQL)
    .then((result) => {
      console.log('result', result)
      return { meals: result.rows };
    })
    .catch((error) => {
      console.log('error', error)
      return handleError(error, res);
    })
}

getRecipeDB();
// https://api.edamam.com/api/nutrition-data?app_id=14955312&
// app_key=b051ae90212f813de4b95da243ad9e8a&ingr=10%20apple 
///----- 1 ingredient at a time with measuring 1cups%20apple

// https://api.edamam.com/search?q=chicken&excluded=citrus&excluded=salt
// &excluded=kosher%20salt&app_id=a49852e9&app_key=1d096000e385b476818f554e3b06870d&
// from=0&to=3&calories=591-722&health=alcohol-free 
///----- Excluded concatenated multiple times

// delete recipe from database
function deleteRecipeDB(recipeId) {
  let SQL = `DELETE FROM recipes WHERE id=${recipeId}`;
  return client.query(SQL)
    .then(result => {
      return { meals: result.rows };
    })
    .catch((error) => {
      return handleError(error, res);
    })
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

  function Nutrients(data) {
    this.uri = encodeURIComponent(data.uri);
    this.title = data.ingredients[0].parsed[0].food;
    this.totalCalories = Math.round(data.calories);
    this.weight = data.ingredients[0].parsed[0].weight;
    this.id = data.ingredients[0].parsed[0].foodId;
    // this.calPercentage = Math.round(totalCalories / maxCalories);
  }
