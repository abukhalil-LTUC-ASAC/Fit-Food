DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  uri VARCHAR (255),
  title VARCHAR(255),
  image VARCHAR(255),
  ingredients TEXT[],
  totalCalories VARCHAR(255),
  servings VARCHAR(255),
  instructions_url VARCHAR(255),
  calPerServ VARCHAR(255)
);

-- INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES (
--   'The Great Gatsby',
--   'Francis Scott Fitzgerald',
--   'ISBN_13 9786050418156',
--   'http://books.google.com/books/content?id=meVxCwAAQBAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
--   'The main events of the novel take place in the summer of 1922. Nick Carraway, a Yale graduate and World War I veteran from the Midwest – who serves as the novel''s narrator – takes a job in New York as a bond salesman. He rents a small house on Long Island, in the (fictional) village of West Egg, next door to the lavish mansion of Jay Gatsby, a mysterious millionaire who holds extravagant parties but does not participate in them. Nick drives around the bay to East Egg for dinner at the home of his cousin, Daisy Fay Buchanan, and her husband, Tom, a college acquaintance of Nick''s. They introduce Nick to Jordan Baker, an attractive, cynical young golfer with whom Nick begins a romantic relationship. She reveals to Nick that Tom has a mistress, Myrtle Wilson, who lives in the "valley of ashes": an industrial dumping ground between West Egg and New York City. Not long after this revelation, Nick travels to New York City with Tom and Myrtle to an apartment they keep for their affair. At the apartment, a vulgar and bizarre party takes place. It ends with Tom breaking Myrtle''s nose after she annoys him by saying Daisy''s name several times.',
--   'Classics'
-- );
