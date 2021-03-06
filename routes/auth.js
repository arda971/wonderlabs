const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Projects = require('../models/Projects');
const nodemailer = require('nodemailer');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const LocalStrategy = require('passport-local').Strategy; /* this should be after passport*/


// This will tell passport what to put into client-side cookies
// We are just saving the entire user object for this tutorial
// Normally, we'd usually want to save just a user_id
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((userDataFromCookie, done) => {
  done(null, userDataFromCookie);
});



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
       User.findOrCreate({ userid: profile.id }, { name: profile.displayName,userid: profile.id,email: profile.emails[0].value,picture: 'https://www.google.com/s2/photos/profile/'+profile.id }, function (err, user) {
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

  console.log('fb profile',profile);
  User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id,picture: 'http://graph.facebook.com/' + profile.id.toString() + '/picture?type=large'}, function(err, user) {
    //if (err) { return done(err); }
    return done(err, user);
  });




},

));

/* LOGIN ROUTER */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Please Sign In with:' });
});


/*Google*/
router.get('/google', passport.authenticate('google'));

// This is where Google sends users once they authenticate with Google
// Make sure this endpoint matches the "callbackURL" from step 4.2 and the "authorized redirect URI" from Step 3
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login'}),
  (req, res) => {
  //  console.log('wooo we authenticated, here is our user object:', req.user);

    //res.json(req.user);
    req.session.save();
    res.redirect('/');
  }
);


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


/* LOGIN USR ROUTER */
router.get('/signin', function(req, res, next) {

      res.render('signin', { title: 'Please Sign In ',errors: req.session.messages || []});
      req.session.messages = [];
});

router.post('/signin', passport.authenticate('local', { failureRedirect: '/auth/signin',failureMessage: "Invalid username or password"}),(req, res, next) => {




  Projects.find({ userid: req.user._id }, (err, projects)=> {

        let created=0;
        let assigned=0;
        let completed=0;
        let tmpProjects=[];



        

        projects.forEach((item)=>{

              if(item.status==="created") created++;
             if(item.status==="assigned") assigned++;
             if(item.status==="completed") completed++;

             let tmp={};
             tmp._id=item._id;
             tmp.tittle=item.tittle;
             tmp.status=item.status;
             tmpProjects.push(tmp);


          });

        req.user.stats.projects=tmpProjects;
        req.user.stats.created=created;
        req.user.stats.assigned=assigned;
        req.user.stats.completed=completed;

        console.log('user lgin',req.user);

            req.session.save((err) => {
      if (err) {
          return next(err);
      }



      res.redirect('/');
  });


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













module.exports = router;
