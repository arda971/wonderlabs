var express = require('express');
var router = express.Router();
//const passportFacebook = require('../controller/facebookAuth');
//const passportGoogle = require('../controller/googleAuth');
const User = require('../models/User');

var config = require('./config');




var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


// Set up passport strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_TEST_APP_CLIENT_SECRET,
    callbackURL: 'https://wonder971.herokuapp.com/auth/google/callback',
    scope: ['email'],
  },
  // This is a "verify" function required by all Passport strategies
  (accessToken, refreshToken, profile, cb) => {
    //console.log('Our user authenticated with Google, and Google sent us back this profile info identifying the authenticated user:', profile);
    return cb(null, profile);
  },
));





passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_OAUTH_TEST_APP_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_OAUTH_TEST_APP_CLIENT_SECRET,
  callbackURL: "https://wonder971.herokuapp.com/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log('Our user authenticated with Facebook, and Facebook sent us back this profile info identifying the authenticated user:', profile);
  return done(null, profile);
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

router.post('/signin', passport.authenticate('local', { failureRedirect: '/auth/login' }), (req, res, next) => {
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

        User.findOrCreate({name: req.body.name}, {name: req.body.name,userid: req.body.userid,email: req.body.email}, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
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
  res.redirect('/');
});

/* FACEBOOK ROUTER */
router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
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
