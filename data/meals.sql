DROP TABLE IF EXISTS meals ;
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    totalCalories VARCHAR(255),
    date VARCHAR(255),
    ingredients text[]

);