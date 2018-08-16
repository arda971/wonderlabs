var express = require('express');
var router = express.Router();
const Projects = require('../models/Projects');
const Users = require('../models/Users');


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
/*  res.json({
    message: 'You have accessed the protected endpoint!',
    yourUserInfo: req.user,
  });*/

res.render('dashboard', { title: 'dashboard'});
});


/* Edit User */

router.get('/edit', accessProtectionMiddleware,function(req, res, next) {

      console.log('rsr',req.user);
      res.render('usrEdit', { title: 'Update  User Info', user: req.user, errors: req.session.messages || []});
      req.session.messages = [];
});


router.post('/edit', accessProtectionMiddleware,function(req, res, next) {

      var usr = Object.assign({},req.user,{name:req.body.name,userid:req.body.userid,email:req.body.email});


      User.findByIdAndUpdate({_id:usr._id}, usr, function (err, user) {

        console.log('usr update',user);
        res.render('usrEdit', { title: 'Update  User Info', user: user, errors: req.session.messages || []});
        req.session.messages = [];

});




});


/* Manage Projects */

router.get('/projects', accessProtectionMiddleware,function(req, res, next) {

      var projects= Projects.find({ userid:req.user._id });
      console.log('projects',projects);
      res.render('listProjects', { title: 'List Projects', projects:projects, errors: req.session.messages || []});
      req.session.messages = [];
});

router.get('/newproject', accessProtectionMiddleware,function(req, res, next) {



      res.render('newProject', { title: 'Add New Project', errors: req.session.messages || []});
      req.session.messages = [];
});

router.post('/newProject', accessProtectionMiddleware,function(req, res, next) {

       var project = {tittle:req.body.tittle,
                      userid:req.user._id,
                      description:req.body.description,
                      deadline:req.body.deadline,
                      type:req.body.type};

      Projects.findOrCreate({ tittle: req.body.tittle }, project, (err,project,created)=>{

	   console.log('project created',created,'project',project);
           if(created){

		res.redirect('/users/project');
		}


	});


});


module.exports = router;
