# Software Requirements
The project encompasses what we have learned during the 301 course, it demonstrates the ability to comfortably work on express.js standard node server along with its many increasing functionalities (routes, databases, method overrides, API's data handling, templating engines) as the course went on.

this.md is an attempt at producing software as a service (SAAS) type of product, with an aim towards people interested in food intake awareness. Collaboration in this project would indicate flexibility in task assignment and the ability to deliver such tasks.

# In of scope
The app would allow users to enter their credentials for the purpose of of calory monitoring. Once they enter, they would be greeted by an input screen to add available ingredients, search for popular food by app users, and a daily suggestions on what they could eat, calories intake history/api from fitbit and news/tips api plugin to learn more on certain topics.

# Out of scope
The app demonstrates what is possible with food api and some calculations, due to time and experience restrictions it wont be: 

* A reliable way to loose weight.
* The fool proof reference on what is healthy. 
* The perfect food recipe collection where you would be able to find anything and everything you might and would want. 
* A mean to communicate and review dishes in favorites with other local and international users.

# Functional Requirements
Includes all requirements to make the app up and running as intended. such:

- Landing page with all features in display.
- Separate pages for each feature details, input and results showing data in a professional manner.
- Daily suggestions on what to eat today based on past food intake up to one month of data
- One or two API for food recipe/calorie sources and another for news related to latest food trends, and finally an optional fitbit data to measure activity.
- Storage in DB would involve user information, past choices and favorites. 
- Error handling to prevent unintended behaviors.
## The basic dataflow
It starts with landing >>> input of ingredients >>> optional login >>> get results >>> store store favorites >>> display them.

In addition to a separate calories calendar, involving user data if login was made, and show suggestions based on activity level from fitbit api.

# Non-Functional Requirements
Data needs to be cross platform and is easy to access, so DB with online deployment is a must using Heroku.

Display needs to be mobile first so all requests and rendering would be rendered as mobile display, then use @media screen and (min-width:960px)

Readability of code is considered and all routes will have callbacks and functions to be as pure as possible with current experience.

Useability in terms of making sure friendly UI/UX practices are made.

Software deployment is done through a managed git process and a testing branch, along with heroku app deployment to the web and a tracking version update for minor and major changes.

Open source, complements from the team on github.