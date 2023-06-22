## Getting started

run the following command to install all the dependencies

```bash
$ npm install
```

create a `.env` file and update the `DB_URL` variable with the postgres connection URL
sample provided in `.env.example`

## Database

run the following commands (in order) to setup your database

```bash
$ npx sequelize db:create
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```

## Running the project

run the following command start the project

```bash
$ npm start
```
