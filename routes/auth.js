var express = require('express');
var router = express.Router();
var passportFacebook = require('../controller/facebookAuth');
var passportGoogle = require('../controller/googleAuth');


/* LOGIN ROUTER */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Please Sign In with:' });
});


/* LOGOUT ROUTER */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/* FACEBOOK ROUTER */
router.get('/facebook',
  passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



/* GOOGLE ROUTER*/

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










module.exports = router;
