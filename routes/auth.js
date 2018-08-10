var express = require('express');
var router = express.Router();
//const passportFacebook = require('../controller/facebookAuth');
//const passportGoogle = require('../controller/googleAuth');
const User = require('../models/User');








var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

var LocalStrategy = require('passport-local').Strategy; /* this should be after passport*/


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
 function(username, password, done) {

    console.log('email local',username);
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
      res.render('signin', { title: 'Please Sign In '});
});

router.post('/signin', passport.authenticate('local', { failureRedirect: '/atuh/login', failureFlash: true }),(req, res, next) => {

  // find each person with a last name matching 'Ghost'
/*  var query = User.findOne({ 'email': req.body.email });



  // execute the query at a later time
  query.exec(function (err, user) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host."
    console.log('usr',user);
    if(user){


    }
  });*/

/*

  req.session.save((err) => {
      if (err) {
          return next(err);
      }
      res.redirect('/');
  });*/

  console.log('email',req.body.email);
  /*
 User.findOne({ email:req.body.email }, function(err, user) {
   if (err) { return done(err); }
   if (!user) {
     console.log('Incorrect username.');

   }
   if (!user.validPassword(password)) {
     console.log('Incorrect passwo.');

   }
   return next(null, user);
 });*/

});

/* REGISTER  ROUTER */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register  New User' });
});


router.post('/register', (req, res, next) => {

 //console.log('req',req);

        User.findOrCreate({ userid: req.body.userid }, { name: req.body.name,userid: req.body.userid,email: req.body.email }, function (err, user, created) {
         // if(err) console.log('err',err,'pro',profile);

           console.log('created',created);
                       return  created;


        });


        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
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

/*
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
*/




module.exports = router;
