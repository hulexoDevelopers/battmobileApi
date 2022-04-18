const winston = require('winston');
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const Pusher = require('pusher');
// const options = {
//     key: fs.readFileSync('./app/cert/key.pem'),
//     cert: fs.readFileSync('./app/cert/cert.pem')
// };

require('./startup/swaggerDoc')(app);
require('./startup/logging')();
db = require('./startup/db');
require('./startup/config');
require('./startup/validation')();

require('./routes/routes')(app);

db.open();

const port = process.env.PORT || 3000
app.listen(port, () => winston.info(`Listening on port ${port}...`));


const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.CLUSTER,
  encrypted: true,
});





app.get('/vote', (request, res) => {
  const http = require("https");

  const options = {
    "method": "GET",
    "hostname": "api.msg91.com",
    "port": null,
    "path": "/api/v5/otp?template_id=6204f396fe0e4a372d7e72e4&mobile=923039726885&authkey=365564AjuJyj9gE861120e12P1&email=abanchaudry%40gmail.com",
    "headers": {
      "Content-Type": "application/json"
    }
  };

  const req = http.request(options, function (res) {
    console.log('res' + res)
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
  req.end();
});

app.get('/testing', (request, res) => {
  console.log('resting')
});

app.get('/sendOtp/:contact/:email', (request, res) => {
  console.log('call hit' + req.params.contact)


  let contact = request.params.contact;
  let email = request.params.email;
  // console.log('call hit' + request.params.contact)
  // console.log(' emai' + request.params.email);

  const http = require("https");

  const options = {
    "method": "GET",
    "hostname": "api.msg91.com",
    "port": null,
    "path": `/api/v5/otp?template_id=6204f396fe0e4a372d7e72e4&mobile=${contact}&authkey=365564AjuJyj9gE861120e12P1&email=${email}`,
    "headers": {
      "Content-Type": "application/json"
    }
  };

  const req = http.request(options, function (res) {
    console.log('res' + res)

    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
  req.end();
});


app.get('verifyOtp', (request, res) => {
  const http = require("https");

  const options = {
    "method": "GET",
    "hostname": "api.msg91.com",
    "port": null,
    // "path": `/api/v5/otp?template_id=6204f396fe0e4a372d7e72e4&mobile=${contact}&authkey=365564AjuJyj9gE861120e12P1&email=${email}`,
    "path": `/api/v5/otp/verify?otp=1593&authkey=365564AjuJyj9gE861120e12P1&mobile=971558412742`,
    "headers": {}
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.end();
})

// https.createServer(options, app).listen(8000, function () {
//     console.log("server running at https://IP_ADDRESS:8000/")
// });

