const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require('axios');


var request = require('superagent');



// send inquiry sms
router.get("/inquiry/send/:id", auth, async (req, res, next) => {
    try {
        let contact = req.params.id;
        const https = require('https');

        const data = JSON.stringify({
            flow_id: "6295e536c4ceb66bf96c7937",
            sender: "battmobile",
            mobiles: contact,
            VAR1: "https://testing.com",
            VAR2: "https://testing.com",
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
    // try {
    //     let data = {
    //         flow_id: "6295e536c4ceb66bf96c7937",
    //         sender: "battmobile",
    //         mobiles: "923039726885",
    //         VAR1: "https://testing.com",
    //     }


    //     axios.post('https://api.msg91.com/api/v5/flow/', data)
    //         .then((result) => {
    //             res.send(result.data)
    //             return;
    //         }).catch((err) => {
    //             console.error(err);
    //             // res.status(200).json({ success: false, data: err });
    //             return;
    //         });

    // } catch (error) {
    //     console.log('error in catch' + error)
    // }
});


// route to add new flavour
router.get("/verifyPayment/:id", auth, async (req, res, next) => {
    try {
        let signature = ''
        let data = {
            request_mid: process.env.mid,
            transaction_id: req.params.id,
            signature: signature
        }
        var pre_signature = process.env.mid +
            data.transaction_id +
            process.env.secret_key

        let sign = crypt.SHA512(pre_signature).toString(crypt.enc.Hex)
        data.signature = sign;

        axios.post('https://secure-dev.reddotpayment.com/service/Merchant_processor/query_redirection', data)
            .then((result) => {
                OrderManager.approveOrder(result.data) //update order status
                res.send(result.data)
                return;
            }).catch((err) => {
                console.error(err);
                // res.status(200).json({ success: false, data: err });
                return;
            });

    } catch (error) {
        console.log('error in catch' + error)
    }

});



module.exports = router;
