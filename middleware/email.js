const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "mail.arpinax.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'admin@arpinax.com',
        pass: ''
    },
});

module.exports = {


    sendEmail: obj => {
        return new Promise((resolve, reject) => {
            const options = {
                from: obj.from,
                to: obj.to,
                subject: obj.subject,
                html: obj.html
            };
            transporter.sendMail(options, function (error, info) {
                if (error) {
                    console.log('err' + error)
                    reject(error);
                } else {
                    console.log('send')
                    resolve(info.response);
                }
            });
        });
    }
}