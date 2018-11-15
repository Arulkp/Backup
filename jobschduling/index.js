var express=require('express');
var cron=require('node-cron');
var nodemailer=require('nodemailer');
varfs=require('fs');
var app=express();
function otp(){
  var digits = '0123456789'; 
	let OTP = ''; 
	for (let i = 0; i < 5; i++ ) { 
    
    OTP += digits[Math.floor(Math.random() * 10)]; 
    console.log(OTP)
	} 
	return OTP; 
}
otp()
cron.schedule(' * * * * *',function(){
    console.log("file is running every miniutes");
    
    let mailOptions = {
        from: "aionblockchain123@gmail.com",
        to: "desingraja.r@mnw.co.in",
        subject: `Not a GDPR update ;)`,
        text: `Hi there, this email was automatically sent by us`
      };
      let transporter = nodemailer.createTransport({
        // service: "mnw.co.in",
        host:'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: "aionblockchain123@gmail.com",
          pass: "Aion123$"
        }
      });
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          throw error;
        } else {
            console.log(info);
          console.log("Email successfully sent!");
        }
      });
    })

// app.listen(4000);
