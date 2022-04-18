const _ = require('lodash');

const express = require('express');
const router = express.Router();
var mailer = require('../../helper/mailer');
const utils = require('../../middleware/util');
const ut = require('../../middleware/util');
const emailManager = require('../../middleware/email');

var replaceall = require("replaceall");


//contact request
router.post('/sendEmail', async (req, res) => {
    try {
        let html = await ut.readTemplate(`contact`);
        html = replaceall(`{{name}}`, req.body.name, html);
        // html = replaceall(`{{contact}}`, req.body.phone, html);
        html = replaceall(`{{message}}`, req.body.message, html);
        // html = replaceall(`{{link}}`, link, html);
        emailManager.sendEmail({
            to: 'help@battmobile.ae',
            subject: req.body.subject,
            html: html
        });

        return res.status(200).send({ success: true, message: 'Email sent' });
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});
module.exports = router;
