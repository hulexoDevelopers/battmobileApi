require('express-async-errors');
require('winston-mongodb');
require('dotenv').config();
const winston = require('winston');

module.exports = function () {
  const connectionString = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;

  //dbUri = 'mongodb://localhost/bingoTel', { useNewUrlParser: true }
  // winston.add(new winston.transports.File({
  //   filename: 'uncaughtExceptions.log',
  // }));

  //winston.add(new winston.transports.Console());

  winston.add(new winston.transports.MongoDB({
    db: connectionString,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }));

}