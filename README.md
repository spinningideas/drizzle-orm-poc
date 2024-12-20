# Sequelize Typescript ORM POC

The code in this repo demonstrates use of [sequelize](https://sequelize.org/v6/) as an ORM using two tables with geography data sets (continents and countries).

This code uses the following libaries:

- [sequelize](https://sequelize.org/v6/)
- [typescript](https://www.typescriptlang.org/)
- [sequelize-typescript](https://github.com/sequelize/sequelize-typescript)
- [express](https://expressjs.com/)
- [postgresql](https://www.postgresql.org/)
- [umzug](https://github.com/sequelize/umzug) - database migrations
- [cypress](https://www.cypress.io/) - testing

This code assumes usage of sequelize@6 and sequelize-typescript requires sequelize and typescript.

This proof of concept uses a repository to get data from database and uses [express](https://expressjs.com/).

## Get Started

To get started perform the following steps:

### 1) Install PostGreSQL for your Operating System (OS)

https://www.postgresql.org/download/

### 2) Create PostGreSQL database to use in this POC

After installing locally you should have a database server - you will need to do these steps:

#### 2.1 Copy ".env.template" file into standard ".env" file so that you have valid file present and update the values in it to have correct set with valid database name and credentials (DB_USER, DB_PASSWORD)

```
DB_USER=postgres
DB_PASSWORD=CHANGE_ME_TO_VALID_ENTRY
DB_NAME=sequelize_ts_orm_poc
DB_DIALECT=postgres
DB_SERVER=localhost

```

#### 2.2 Create a database named "sequelize_ts_orm_poc" or named the same value you used in the .env var DB_NAME

DB_NAME=sequelize_ts_orm_poc OR name of your choice

#### 2.3 enable access to the credentials from Database.ts (username from .env: DB_USER)

### 3) Install npm packages

Install the required packages via standard command:

`npm install`

### 4) Create database schema using sequelize migrations

See `runMigrations.ts`

This will happen when you run `npm run start`

### 5) Populate database with data using sequelize data seeding

See `runSeeders.ts`

This will happen when you run `npm run start`

### 6) run the application

The application is configured to use nodemon to monitor for file changes and you can run command to start the application using it. You will see console information with url and port.

`npm run start`

NOTE: You can also run and debug the application if using vscode via the launch.json profile and debugging capabilities: https://code.visualstudio.com/docs/editor/debugging

### 7) exercise the application via postman OR thunder client

#### 7.1 - Get a client

1. https://www.thunderclient.com/

2. https://www.getpostman.com - Download and install https://www.getpostman.com

#### 7.2 - Import "postman" collection and run requests

Use the client of your choice to run the requests to see api data and responses after importing the collection in the "postman" folder

#### 7.3 - Run the cypress tests AFTER first starting the app via "npm start"

Open a new termincal and use the cypress test runner to run the tests.

When cypress launches chose end2end test and Electron then run the tests as you wish to see the API that is produced by express and sequelize.

```
npm run cypress:open
```

And then run

```
npm run cypress:run
```

### 8 Inspiration and Read More

https://gist.github.com/cayter/49d5c256a885d90c399ca6c1eca19f51

https://www.answeroverflow.com/m/1147439990683488268

https://github.com/RobinBuschmann/sequelize-typescript-example

https://orm.drizzle.team/docs/dynamic-query-building

- https://github.com/RobinBuschmann/sequelize-typescript-example
- https://blog.logrocket.com/using-sequelize-with-typescript/
- https://github.com/spinningideas/resources/wiki/Repositories
- https://github.com/fabianfrangella/sequelize-repository
- https://github.com/fabianfrangella/sequelize-repository/blob/main/src/repository/SQRepository.js
- https://github.com/blugavere/node-repositories/blob/master/packages/postgres-repository/index.js
- https://stackoverflow.com/questions/69051499/typescript-repository-pattern-with-sequelize
- https://khalilstemmler.com/articles/typescript-domain-driven-design/repository-dto-mapper/
- https://stackoverflow.com/questions/69051499/typescript-repository-pattern-with-sequelize
