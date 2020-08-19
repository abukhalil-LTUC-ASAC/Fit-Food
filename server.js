"use strict";

// -------------------------------- DECLARE VARIABLES --------------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config(".env");
const expressLayouts = require("express-ejs-layouts");
const pg = require("pg");

const methodOverride = require("method-override");
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

// get ingredients
app.get("/ingredientDetails", renderIngredients);

// post ingredients
app.post("/ingredientDetails", renderIngredients);

// get recipe by uri
app.get("/recipeDetails/", recipeDetailsHandler);

// aboutus route
app.get("/newAboutus", aboutusHandler);

// nutrition Wizard page
app.get("/nutritionWizard", nutritionWizardHandler);

// get fav recipe by id
app.get("/favDetails/", favDetailsHandler);

// all other routes
app.all("*", errorHandler);

// -------------------------------- CALLBACK FUNCTIONS --------------------------------

//home
function homeHandler(req, res) {
  res.render("index");
}

//aboutus
function aboutusHandler(req, res) {
  res.render("pages/newAboutus");
}

//search
async function searchHandler(req, res) {
  queryParams.q = req.query.searchFood || queryParams.q;
  queryParams.from = req.query.from || queryParams.from;
  queryParams.to = req.query.to || queryParams.to;
  let fromC = req.query.fromC;
  let toC = req.query.toC;
  if (fromC || toC) {
    queryParams.calories = fromC && toC ? `${fromC}-${toC}` : fromC ? `${fromC}+` : toC ? `${toC}` : "0+" || queryParams.calories;
  }
  queryParams.diet = req.query.diet || queryParams.diet;
  queryParams.health = req.query.health || queryParams.health;
  queryParams.excluded = req.query.excluded || queryParams.excluded || '';
  queryParams.ingr = req.query.ingr || queryParams.ingr || '';

  if (queryParams.excluded.length === 0) {
    delete queryParams.excluded;
  }

  if (queryParams.ingr.length === 0) {
    delete queryParams.ingr;
  }

  let recipes = await getRecipes(queryParams);
  console.log('this is recipe array', recipes);
  if (recipes) {
    res.render("pages/recipeResult", {
      recipes: recipes
    });
  }
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
  res.redirect('/fav')
}

async function deleteFav(req, res) {
  const recipeId = req.params.id;
  let result = await deleteRecipeDB(recipeId);
  res.redirect("/fav");
}

//calculate
async function calculateCalories(req, res) {
  let result = await getRecipeDB();
  console.log(result.meals)
  res.render("pages/calorieCalculator", { meals: result.meals });
}
// render result 
async function renderIngredients(req, res) {
  let length = Math.floor(Object.keys(req.body).length/3) - 1;
  let nutritionArray = [];
  let maxCalories = req.body.maxCalories;

  for (var key in TotalIngredients) {
    TotalIngredients[key][0] = 0;
    TotalIngredients[key][1] = 0;
  };

  for (var i = 0; i <= length; i++) {
//     let stringName = "searchIngredient" + i;
//     let stringAmount = "ingredientAmount" + i;
//     let stringMeasure = "ingredientMeasure" + i;
//     let allString =
//       req.body[stringName] +
//       " " +
//       req.body[stringAmount] +
//       " " +
//       req.body[stringMeasure];
//     let nutrition = await getNutrition(allString);
    // console.log(nutrition);
    let stringName = 'searchIngredient' + i;
    let stringAmount = 'ingredientAmount' + i;
    let stringMeasure = 'ingredientMeasure' + i;
    let allString = req.body[stringName] + ' ' + req.body[stringAmount] + ' ' + req.body[stringMeasure];
    let ingredient = await getNutrition(allString);


    // addNutrition = ();
    nutritionArray.push(ingredient);
 
  }
  console.log(nutritionArray);
  nutritionArray.forEach(ingredient => {                    // sums all nutrients
    for (var key in ingredient.nutrients) {
      TotalIngredients[key][0] += parseInt(ingredient.nutrients[key][0]);
      TotalIngredients[key][1] += parseInt(ingredient.nutrients[key][1]);
    };
  });
  res.render('pages/nutritionDetail', {
    maxCalories: maxCalories,
    nutritionArray: nutritionArray,
    TotalIngredients: TotalIngredients
  });

}

//recipe details
async function recipeDetailsHandler(req, res) {
  let uri = req.query.uri;
  let recipe = await getRecipeByURI(uri);
  res.render("pages/recipeDetail", { recipe: recipe });
}

// Nutrition Wizard
function nutritionWizardHandler(req, res) {
  res.render("pages/nutritionWizard");
}

// get favorite recipe by id 
async function favDetailsHandler(req, res){
  let id = req.query.id;
  let favorite = await getFavByIdDB(id);
  // console.log(favorite);
  res.render("pages/favDetails", { recipe: favorite });
}
//error
function errorHandler(req, res) {
  res.status(404).render("pages/error", {
    message: "Page not found !",
  });
}

// -------------------------------- API FUNCTIONS --------------------------------

//search recipe API
function getRecipes(queryParams) {
  let url = "https://api.edamam.com/search";
 
  console.log('queryParams', queryParams);

  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {
      console.log(`response`, res);
      return res.body.hits.map((e) => {
        return new Recipe(e);
      });
    })
    .catch((error) => {
      console.log('error this', error);
    });
  return result;
}

//search nutrition API
function getNutrition(string) {
  let url = "https://api.edamam.com/api/nutrition-data";
  let queryParams = {
    app_id: APP_ID_NUT,
    app_key: APP_KEY_NUT,
    ingr: string,
  };
  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {

//       // console.log(res.body);
//       return new Nutrients(res.body);
//     })
//     .catch((error) => {});
//   // console.log(result);

      console.log(res.body);
      return new Ingredient(res.body);
    });
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
  // console.log(queryParams);
  let result = superagent
    .get(url)
    .query(queryParams)
    .then((res) => {
      return new Recipe({ recipe: res.body[0] });
    })
    .catch((error) => {});
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
  return client
    .query(SQL, recipeArray)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {});
}

// Get recipe from database
function getRecipeDB() {
  let SQL = "SELECT * FROM recipes ORDER BY id DESC";
  return client
    .query(SQL)
    .then((result) => {
      // console.log("result", result);
      return { meals: result.rows };
    })
    .catch((error) => {});
}

// get favorite recipe by id from database
function getFavByIdDB(id) {
  console.log(id);
  let SQL = "SELECT * FROM recipes WHERE id=$1";
  let values =[id]
  return client
    .query(SQL, values)
    .then((result) => {
      return result.rows[0] ;
    })
    .catch((error) => {});
}

// delete recipe from database
function deleteRecipeDB(recipeId) {
  let SQL = `DELETE FROM recipes WHERE id=${recipeId}`;
  return client
    .query(SQL)
    .then((result) => {
      return { meals: result.rows };
    })
    .catch((error) => {});
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

function Ingredient(data) {
  this.uri = encodeURIComponent(data.uri);
  this.title = data.ingredients[0].parsed[0].food;
  this.quantity = data.ingredients[0].parsed[0].quantity;
  this.measure = data.ingredients[0].parsed[0].measure;
  this.totalCalories = Math.round(data.calories);
  this.weight = data.ingredients[0].parsed[0].weight;
  this.id = data.ingredients[0].parsed[0].foodId;
  this.nutrients = {
    'Total Fat': [data.totalNutrients.FAT.quantity.toFixed(1) || 0, data.totalDaily.FAT.quantity.toFixed(1) || 0, data.totalNutrients.FAT.unit],
    'Saturated Fat': [data.totalNutrients.FASAT.quantity.toFixed(1) || 0, data.totalDaily.FASAT.quantity.toFixed(1) || 0, data.totalNutrients.FASAT.unit],
    'Trans Fat': [(data.totalNutrients.FAMS.quantity + data.totalNutrients.FAPU.quantity).toFixed(1) || 0, 0, data.totalNutrients.FAPU.unit],
    Cholesterol: [data.totalNutrients.CHOLE.quantity.toFixed(1) || 0, data.totalDaily.CHOLE.quantity.toFixed(1) || 0, data.totalNutrients.CHOLE.unit],
    Sodium: [data.totalNutrients.NA.quantity.toFixed(1) || 0, data.totalDaily.NA.quantity.toFixed(1) || 0, data.totalNutrients.NA.unit],
    Carbohydrate: [data.totalNutrients.CHOCDF.quantity.toFixed(1) || 0, data.totalDaily.CHOCDF.quantity.toFixed(1) || 0, data.totalNutrients.CHOCDF.unit],
    'Dietary Fiber': [data.totalNutrients.FIBTG.quantity.toFixed(1) || 0, data.totalDaily.FIBTG.quantity.toFixed(1) || 0, data.totalNutrients.FIBTG.unit],
    'Total Sugars': [data.totalNutrients.SUGAR.quantity.toFixed(1) || 0, 0, data.totalNutrients.SUGAR.unit],
    Protein: [data.totalNutrients.PROCNT.quantity.toFixed(1) || 0, data.totalDaily.PROCNT.quantity.toFixed(1) || 0, data.totalNutrients.PROCNT.unit],
    'Vitamin A': [data.totalNutrients.VITA_RAE.quantity.toFixed(1) || 0, data.totalDaily.VITA_RAE.quantity.toFixed(1) || 0, data.totalNutrients.VITA_RAE.unit],
    'Vitamin C': [data.totalNutrients.VITC.quantity.toFixed(1) || 0, data.totalDaily.VITC.quantity.toFixed(1) || 0, data.totalNutrients.VITC.unit],
    'Vitamin D': [data.totalNutrients.VITD.quantity.toFixed(1) || 0, data.totalDaily.VITD.quantity.toFixed(1) || 0, data.totalNutrients.VITD.unit],
    Calcium: [data.totalNutrients.CA.quantity.toFixed(1) || 0, data.totalDaily.CA.quantity.toFixed(1) || 0, data.totalNutrients.CA.unit],
    Iron: [data.totalNutrients.FE.quantity.toFixed(1) || 0, data.totalDaily.FE.quantity.toFixed(1) || 0, data.totalNutrients.FE.unit],
    Potassium: [data.totalNutrients.K.quantity.toFixed(1) || 0, data.totalDaily.K.quantity.toFixed(1) || 0, data.totalNutrients.K.unit],
  }
}

let TotalIngredients = {
  'Total Fat' : [0,0],
  'Saturated Fat' : [0,0],
  'Trans Fat' : [0,0],
  Cholesterol : [0,0],
  Sodium : [0,0],
  Carbohydrate : [0,0],
  'Dietary Fiber' : [0,0],
  'Total Sugars' : [0,0],
  Protein : [0,0],
  'Vitamin A' : [0,0],
  'Vitamin C' : [0,0],
  'Vitamin D' : [0,0],
  Calcium : [0,0],
  Iron : [0,0],
  Potassium : [0,0],
}

let queryParams = {
  q: '',
  app_id: APP_ID,
  app_key: APP_KEY,
  from: 0,
  to: 9,
  calories: "0+",
  diet: undefined,
  health: undefined,
  excluded: '',
  ingr: '',
};