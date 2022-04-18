
const express = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();
class email {
    // function to get customer compnay orders
    async sendEmail(data) {
        try {
            let transporter = nodemailer.createTransport({
                name: "mail.arpinax.com",
                host: "mail.arpinax.com",
                port: 465,
                secure: true,
                auth: {
                    user: 'admin@arpinax.com',
                    pass: ''
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            transporter.verify((err, success) => {
                if (err) {
                    console.log(err);
                   
                } else {
                        console.log("Server is ready to take our message");
                    return true
                
                }
            });

            // send mail with defined transport object
            await transporter.sendMail(
                {
                    from: data.from, // sender address
                    to: data.to, // list of receivers
                    subject: data.subject, // Subject line
                    text: data.title, // plain text body
                    html: data.html, // html body
                },
                (err, response) => {
                    if (err) {
                        return false;
                        // console.log("Error: ", err);
                    } else {
                        return true;
                        // console.log("Email sent successfully: ", response);
                    }
                    transporter.close();
                }
            );



        } catch (error) {
            console.log(error)
            return error
        }
    }




}

module.exports = new email();