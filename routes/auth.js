var express = require('express');
var router = express.Router();
const passportFacebook = require('../controller/facebookAuth');
const passportGoogle = require('../controller/googleAuth');
const User = require('../models/User');

/* LOGIN ROUTER */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Please Sign In with:' });
});

/* LOGIN USR ROUTER */
router.get('/loginusr', function(req, res, next) {
      res.render('loginusr', { title: 'Please Sign ',user : req.user, error : req.flash('error')});
});

/* REGISTER  ROUTER */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'New User' });
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


router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    User.register(new User({ name : req.body.username }), req.body.password, (err, user) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});




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
