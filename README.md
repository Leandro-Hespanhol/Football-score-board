<h1 align="center">⚽ Welcome to the Football Score Board Project ⚽</h1>

## Requirements
```
Docker version 20.10.14
Docker-compose version 1.29.2
NodeJS version 16.13.2
Npm version 8.1.2
```

## Install and Usage 
- This project is configured to use ports 3000 (front-end), 3001(back-end) and 3002 (database), so they need to be available on your computer or changed on the project.

## .env File
# My backend .env file looks like this:
```
PORT=3004
DB_USER=root
DB_PASS=******
DB_NAME=TRYBE_FUTEBOL_CLUBE
DB_HOST=localhost
DB_PORT=3306
```
# My frontend .env file looks like this
```
SKIP_PREFLIGHT_CHECK=true
```

# Run on root directory:
```sh
npm run compose:down
npm run compose:up
```

# Run without docker:
- Start mySql server and create a database using db.example.sql file;
```sh
npm install
```

```sh
/app/backend
npm run nodemon
```

```sh
/app/frontend
npm start
```

Your database, backend and frontend should be mounted and connected through docker.

# Once mounted, you should see the application at:
localhost:3000

## Core abilities: NodeJS, Sequelize, OOP, API-Rest, Mocha-chai

## Description: 

This is a fullStack project which I have worked only at the backend to create a leaderboard for a football competition.

Anyone can see the leaderboards but to start or finish a match you need to be logged in.

Login uses Jwt validation token and bcrypt.

At the frontend there are 3 score tables: First one builds a leaderboard considering all matches. Second one considers matches where the teams are playing at home and third one considers matches where the teams are not playing at home.

## About me

👤 **Leandro Hespanhol**

* Portfolio-Website: https://leandro-hespanhol.github.io/
* GitHub: [@Leandro-Hespanhol](https://github.com/Leandro-Hespanhol)
* LinkedIn: [@Leandro Hespanhol](https://www.linkedin.com/in/leandro-hespanhol/)

***