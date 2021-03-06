const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { vehicles, validate } = require('../models/vehicles');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const https = require("https");


//get vehicle detail by vehicle id
router.get('/sendOtp/:contact/:email', async (req, res) => {
    let contact = req.params.contact;
    let email = req.params.email;
    const options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": `/api/v5/otp?template_id=61f7a0653d495a109d32ce9e&mobile=${contact}&email=${email}&authkey=365564AjuJyj9gE861120e12P1`,
        "headers": {
            "Content-Type": "application/json"
        }
    };
    const request = https.request(options, function (response) {
        const chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            // console.log(body.toString());
            res.status(200).json({ success: true, data: body.toString() });
            // res.json({ player });
        });
    });

    request.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
    request.end();
});


//verify oth
router.get('/verifyOtp/:contact/:otp', async (req, res) => {
    let contact = req.params.contact;
    let otp = req.params.otp
    const options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": `/api/v5/otp/verify?otp=${otp}&mobile=${contact}&authkey=365564AjuJyj9gE861120e12P1`,
        "headers": {
            "Content-Type": "application/json"
        }
    };
    const request = https.request(options, function (response) {
        const chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            // console.log(body.toString());
            res.status(200).json({ success: true, data: body.toString() });
            // res.json({ player });
        });
    });

    request.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
    request.end();
});


//send 
router.get('/inquiry/new/:contact', async (req, res) => {
    let contact = req.params.contact;
    console.log('contact' + contact)
    return;
    const options = {
        "method": "POST",
        "hostname": "api.msg91.com",
        "port": null,
        "path": `/api/v5/flow/`,
        "headers": {
            "Content-Type": "application/json",
            "authkey": "365564AjuJyj9gE861120e12P1",
        }
    };

    const request = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    request.write("{\n  \"flow_id\": \"6295e536c4ceb66bf96c7937\",\n  \"sender\": \"battmobile\",\n  \"mobiles\": \"923039726885\",\n  \"VAR1\": \"testing\",\n}");
    request.end();
    // const request = https.request(options, function (response) {
    //     const chunks = [];

    //     response.on("data", function (chunk) {
    //         chunks.push(chunk);
    //     });

    //     response.on("end", function () {
    //         const body = Buffer.concat(chunks);
    //         // console.log(body.toString());
    //         res.status(200).json({ success: true, data: body.toString() });
    //         // res.json({ player });
    //     });
    // });

    // request.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
    // request.end();
});

module.exports = router;








