const nodemailer = require('nodemailer');



let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
	service: 'gmail',
	auth: {
	  user: 'abanchaudry@gmail.com',
	  pass: ''
	}
   
}); 

class EmailManager {    
    
    async sendEmail(values) {

		console.log("value" + JSON.stringify(values))
		return;
       let mailOptions = {
            from: '"Service m8  👻" <development@sm8.com>', // sender address
            to: 'abanchaudry@gmail.com', // list of receivers
            subject: 'Hello ✔ ', // Subject line
            text: ' Thank you', // plain text body
            html: `<!DOCTYPE html>
			<html>
			<head>
				<style type="text/css">
				*{
					margin: 0px;
					padding: 0px;
				}
				body{
					background-color:#3659B5;
				}
				.main-row{
					margin: 2%;
					background-color: #fff;
					padding: 30px 20px;
					min-height: 90%;
				}
				h1{
					text-align: center;
				}
				h3{
					text-align: center;
				}
				.content{
					text-align: center;
					padding: 5%
				}
				.verify-button{
					text-align: center;
				}
				.verify-button a{
					background-color: #3659B5;
					color: #ffffff;
					 padding: 10px 40px;
					  margin: auto;
					  font-size: 20px;
					text-decoration: none;
					transition: all .3s ease-in; 
				}
				.verify-button a:hover{
					background-color: #C33E43;
				}		
				</style>
			</head>
			<body>
			<div class="row main-row">
				<section class="content-main">
					<h1>Matter</h1>

				</section>
				<div class="heading-div">
					<h1>Thank you for your order  </h1>
					
					
					<h3><br/>   ${values.user}<br/>${values.userEmail}<br/></h3>
					
				</div>
				<div class="content">
					<p>
					your order has been received. After your payment confirmation your order being processed.<br/>
					For further details please login to your account by following the link below . your contact number is your password which is ${values.contact}. and if you want to change your password please follow  change password link.
					</p>
			
					<a href="http://64.227.25.36/user/login">
					<h4>
					Login Link
					</h4>
					</a><br/>
					<a href="${values.url}">
					<h2>
					Change Password
					</h2>
					</a>
					<!-- <p>${values.text}</p> -->
				</div>
			</div>
			</body>
			</html>`
            
        };  
        return new Promise((resolve, reject) => {
            // send mail with defined transport object        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error)
                    reject(error);
                resolve(info);
            });
        });
    }
}

module.exports = new EmailManager();