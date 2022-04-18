const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// console.log('authoriz first')
router.use(function (req, res, next) {
    //   const token = req.header('Authorization');
    const key = req.header('key');
    // console.log('key is' + key)

    if (!key) return res.status(200).send('InValid key');

    try {
        if (key === 'data123') {
            next();
        }else {
            res.status(400).send('Invalid key.');
        }

    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
});

module.exports = router;
