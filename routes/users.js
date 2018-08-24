var express = require('express');
var router = express.Router();
const Projects = require('../models/Projects');
const Users = require('../models/Users');
const Products = require('../models/Products');


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

res.render('dashboard', { title: 'dashboard', user:req.user});
});


/* Edit User */

router.get('/edit', accessProtectionMiddleware,function(req, res, next) {

      console.log('rsr',req.user);
      res.render('usrEdit', { title: 'Update  User Info', user: req.user, errors: req.session.messages || []});
      req.session.messages = [];
});


router.post('/edit', accessProtectionMiddleware,function(req, res, next) {

      var usr = Object.assign({},req.user,{name:req.body.name,userid:req.body.userid,email:req.body.email});

      console.log('usr before update',usr);

  Users.findByIdAndUpdate({_id:usr._id}, usr, function (err, response) {


    req.logout();
    req.session.save();
    res.redirect('/auth/login');


});






});


/* Manage Projects */

router.get('/projects', accessProtectionMiddleware,function(req, res, next) {

      Projects.find({ userid:req.user._id },(err,projects)=>{

        console.log('projects',projects);
        res.render('listProjects', { title: 'List Projects', projects:projects, errors: req.session.messages || []});
        req.session.messages = [];

      });

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

		res.redirect('/users/projects');
		}


	});


});


router.get('/project/:id', accessProtectionMiddleware,function(req, res, next) {

      console.log('edit project id',req.params.id);


      Projects.findById({_id:req.params.id}, function (err, project) {
       console.log('edit project',project);
        res.render('editProject', { title: 'Update  Project Info', project:project, errors: req.session.messages || []});
        req.session.messages = [];

});

});

router.post('/project/:id', accessProtectionMiddleware,function(req, res, next) {

  Projects.findByIdAndUpdate({_id:req.params.id}, req.body, function (err, project) {

    console.log('project update',project);
    res.redirect('/users/projects');


});




});


router.get('/deleteproject/:id', accessProtectionMiddleware,function(req, res, next) {
           Projects.findByIdAndRemove(req.params.id, function (err, resp) {
             if (err) next(err) ;
        res.redirect('/users/projects');
    });
});


router.get('/addcostproject/:id', accessProtectionMiddleware,function(req, res, next) {
           Products.find(function (err, products) {
             if (err) next(err) ;
             console.log('products list',products);
             var product={
               name:'test',
               description:'test',
               price:10
             }
              res.render('addCosts', { title: 'Add Costs  Project ', project:req.params.id, product:product, errors: req.session.messages || []});

    });
});


module.exports = router;
