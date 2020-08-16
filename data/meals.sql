DROP TABLE IF EXISTS meals ;
DROP TABLE IF EXISTS recipes;
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  uri VARCHAR ( 255 ),
  title VARCHAR(255),
  image VARCHAR(255),
  ingredients text[],
  totalCalories VARCHAR(255),
  servings VARCHAR(255),
  instructions_url VARCHAR(255),
  calPerServ VARCHAR(255),
  date VARCHAR(255)
);