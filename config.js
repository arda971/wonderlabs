module.exports = {
  'secretKey': '123AB-6YU90-0lk76-54ab1',
  'mongoUrl' : process.env.MongoURI,
  'mailer': {
     auth: {
       user: process.env.MailUSR,
       pass: process.env.MailPWD,
     },
  'defaultFromAddress': process.env.MailDFT
   }


}
