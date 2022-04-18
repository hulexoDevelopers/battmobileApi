require('dotenv').config();
var request = require('request');
// Module dependencies
const winston = require('winston'),
    mongoose = require('mongoose');
const pf = require('../middleware/clientApp');

pf.getUserIp()
pf.verifyClient();
// const connectionString = 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME;
const connectionString = "mongodb://AdminArpinax:AdminArpinaxBattMobile@157.245.216.126/arpinaxbatt?authSource=admin&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=false";
// const connectionString = "mongodb://AdminFoodi:AdminDeenWajSec4756@128.199.150.182/deenWajabat?authSource=admin&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=false";

const transport = new winston.transports.File({ filename: 'logfile.log' });
const logger = winston.createLogger({
    transports: [transport]
});

let connection = null;

class Database {
    open() {
        const options = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        mongoose.connect(connectionString, options, (err) => {
            if (err) logger.info('mongoose.connect() failed: ' + err);
        });
        connection = mongoose.connection;
        mongoose.Promise = global.Promise;

        mongoose.connection.on('error', (err) => {
            logger.info('Error connecting to MongoDB: ' + err);
 
            //callback(err, false);
        });

        mongoose.connection.once('open', () => {
            logger.info('We have connected to mongodb');
            console.log("connected"  )
            //callback(null, true);
        });
    }

    // disconnect from database
    close() {
        connection.close(() => {
            logger.info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    }

}

module.exports = new Database();
