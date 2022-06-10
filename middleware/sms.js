const _ = require('lodash');
const express = require('express');
require('dotenv').config();
const axios = require('axios');


var request = require('superagent');

class SmsManager {

    async newInquirySms(contact) {
        try {
            const https = require('https');

            const data = JSON.stringify({
                flow_id: "6295e536c4ceb66bf96c7937",
                sender: "battmobile",
                mobiles: contact,
                VAR1: "https://battmobile.ae",
                VAR2: "https://battmobile.ae",
            });

            const options = {
                hostname: 'api.msg91.com',
                port: 443,
                path: '/api/v5/flow/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authkey': '365564AjuJyj9gE861120e12P1'
                },
            };

            const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', d => {
                    process.stdout.write(d);
                });
            });

            req.on('error', error => {
                console.error(error);
            });

            req.write(data);
            req.end();
        }
        catch (error) {
            console.log('error in catch' + error)
        }
    }


    //job assigned
    async newJobAssign(contact) {
        try {
            const https = require('https');

            const data = JSON.stringify({
                flow_id: "6295e57242c8653b1d560853",
                sender: "battmobile",
                mobiles: contact,
                VAR1: "",
            });

            const options = {
                hostname: 'api.msg91.com',
                port: 443,
                path: '/api/v5/flow/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authkey': '365564AjuJyj9gE861120e12P1'
                },
            };

            const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', d => {
                    process.stdout.write(d);
                });
            });

            req.on('error', error => {
                console.error(error);
            });

            req.write(data);
            req.end();
        }
        catch (error) {
            console.log('error in catch' + error)
        }
    }


    //job assigned
    async jobConfirmation(contact) {
        try {
            const https = require('https');

            const data = JSON.stringify({
                flow_id: "6295e536c4ceb66bf96c7937",
                sender: "battmobile",
                mobiles: contact,
                VAR1: "",
            });

            const options = {
                hostname: 'api.msg91.com',
                port: 443,
                path: '/api/v5/flow/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authkey': '365564AjuJyj9gE861120e12P1'
                },
            };

            const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', d => {
                    process.stdout.write(d);
                });
            });

            req.on('error', error => {
                console.error(error);
            });

            req.write(data);
            req.end();
        }
        catch (error) {
            console.log('error in catch' + error)
        }
    }

}

module.exports = new SmsManager();