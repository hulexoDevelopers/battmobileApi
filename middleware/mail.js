const nodemailer = require("nodemailer");
const config = require("config");

const sendEmail = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    name: "",
    host: "",
    port: 465,
    secure: true,
    auth: {
        user: '',
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
    }
  });

  // send mail with defined transport object
  await transporter.sendMail(
    {
      from: '"Name You Want" <email@address.com>', // sender address
      to: "abanchaudry@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<h1>Hello! There?</h1>", // html body
    },
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        console.log("Email sent successfully: ", response);
      }
      transporter.close();
    }
  );
};

module.exports = sendEmail;