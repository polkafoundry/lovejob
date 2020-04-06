# lovejob

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/lovejob
    npm install
    ```
3. Config your database url in `config/default.json`

4. Run migration to create table `notification`
   ```
   npm run dev
   ```   

5. Start your app

    ```
    npm start
    ```
   
## Debugging
Change `logging` to true in `src/sequelize.js` to see SQL command output

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
