var express = require('express');
var router = express.Router();
const User = require('../models/User');


// Checks if a user is logged in
const accessProtectionMiddleware = (req, res, next)=> {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'must be logged in to continue',
    });
  }
};

// A secret endpoint accessible only to logged-in users
router.get('/', accessProtectionMiddleware, (req, res)=> {
  res.json({
    message: 'You have accessed the protected endpoint!',
    yourUserInfo: req.user,
  });
});


/* Edit User */

router.get('/edit', accessProtectionMiddleware,function(req, res, next) {

      console.log('rsr',req.user);
      res.render('usrEdit', { title: 'Update  User Info', user: req.user, errors: req.session.messages || []});
      req.session.messages = [];
});


router.post('/edit', accessProtectionMiddleware,function(req, res, next) {

      var usr = Object.assign({},req.user,{name:req.body.name,userid:req.body.userid,email:req.body.email});


      User.findByIdAndUpdate(usr._id, usr, function (err, user) {

        console.log('usr update',user);
        res.render('usrEdit', { title: 'Update  User Info', user: user, errors: req.session.messages || []});
        req.session.messages = [];

});




});





module.exports = router;
