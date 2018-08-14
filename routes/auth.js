var express = require('express');
var router = express.Router();
//const passportFacebook = require('../controller/facebookAuth');
//const passportGoogle = require('../controller/googleAuth');
const User = require('../models/User');
var nodemailer = require('nodemailer');








var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

var LocalStrategy = require('passport-local').Strategy; /* this should be after passport*/






passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
 function(username, password, done) {


   User.findOne({ email: username }, function(err, user) {
     if (err) { return done(err); }
     if (!user) {
       console.log('Incorrect username.');
       return done(null, false, { message: 'Incorrect username.' });
     }
     if (!user.validPassword(password)) {
       console.log('Incorrect passwo.');
       return done(null, false, { message: 'Incorrect password.' });
     }
     console.log('done local')
     return done(null, user);
   });
 }
));


// Set up passport strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
    callbackURL: 'https://wonder971.herokuapp.com/auth/google/callback',
    scope: ['email'],
  },
  // This is a "verify" function required by all Passport strategies
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id,email: profile.emails[0].value }, function (err, user) {
        // if(err) console.log('err',err,'pro',profile);
           return done(err, user);


       });
  }
));





passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_OAUTH_TEST_APP_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_OAUTH_TEST_APP_CLIENT_SECRET,
  callbackURL: "https://wonder971.herokuapp.com/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {

  User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
    //if (err) { return done(err); }
    return done(err, user);
  });




},

));

/* LOGIN ROUTER */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Please Sign In with:' });
});

/* LOGIN USR ROUTER */
router.get('/signin', function(req, res, next) {

      res.render('signin', { title: 'Please Sign In ',errors: req.session.messages || []});
      req.session.messages = [];
});

router.post('/signin', passport.authenticate('local', { failureRedirect: '/auth/signin',failureMessage: "Invalid username or password"}),(req, res, next) => {


  req.session.save((err) => {
      if (err) {
          return next(err);
      }
      res.redirect('/');
  });




});

/* REGISTER  ROUTER */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register  New User' });
});


router.post('/register', (req, res, next) => {

 //console.log('req',req);

        User.findOrCreate({ userid: req.body.userid }, { name: req.body.name,userid: req.body.userid,email: req.body.email,password: req.body.password }, (err, user, created)=> {
         // if(err) console.log('err',err,'pro',profile);

           console.log('created',created,'usr',user);
           if(created){
           passport.authenticate('local')(req, res, () => {
               req.session.save((err) => {
                   if (err) {
                       return next(err);
                   }
                   res.redirect('/');
               });
           });
         }

        });







    });


/* LOGOUT ROUTER */
router.get('/logout', function(req, res){
  req.logout();
  req.session.save();
  res.redirect('/');
});

/* FACEBOOK ROUTER */
router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.save();
    res.redirect('/');
  });


/* Forgot Password */

router.get('/forgot', function(req, res, next) {

      res.render('forgot', { title: 'Recover Password ',errors: req.session.messages || []});
      req.session.messages = [];
});





router.post('/forgot', (req, res, next) => {

  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      console.log('Incorrect username.');
      return done(null, false, { message: 'Incorrect username.' });
    }

    var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
            user: process.env.MailUSR,
            pass: process.env.MailPWD,
        }

    });



 // console.log('mail t',transporter);

    const mailOptions = {
      from: process.env.MailDFT, // sender address
      to: req.body.email, // list of receivers
      subject: 'Subject of your email', // Subject line
      text: '<p>Your html here`${user.password}`</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log('Unable to send the mail :'+err.message)
  else
    console.log('Message response : '+info.response);
});


  console.log('done local',user.password);

  res.redirect('/');
  });

    });
/* GOOGLE ROUTER

router.get('/google', passportGoogle.authenticate('google'));

// This is where Google sends users once they authenticate with Google
// Make sure this endpoint matches the "callbackURL" from step 4.2 and the "authorized redirect URI" from Step 3
router.get('/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/auth/login', session: true }),
  (req, res) => {
    console.log('wooo we authenticated, here is our user object:', req.user);
    //res.json(req.user);
    res.redirect('/');
  }
);

*/








router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


/* Edit User */

router.get('/edit', function(req, res, next) {

      console.log(req.user);
      res.render('usrEdit', { title: 'Update  User Info', user: req.user, errors: req.session.messages || []});
      req.session.messages = [];
});






module.exports = router;
