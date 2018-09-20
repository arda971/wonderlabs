var express = require('express');
const moment = require('moment');
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

      let usr = Object.assign({},req.user,{name:req.body.name,userid:req.body.userid,email:req.body.email});

      console.log('usr before update',usr);

  Users.findByIdAndUpdate({_id:usr._id}, usr, function (err, response) {


    req.logout();
    req.session.save();
    res.redirect('/auth/login');


});






});


/* Manage Projects */

router.get('/projects', accessProtectionMiddleware,function(req, res, next) {

     /* Projects.find({ userid:req.user._id },(err,projects)=>{

        console.log('projects',projects);
        res.render('listProjects', { title: 'List Projects', projects:projects, errors: req.session.messages || []});
        req.session.messages = [];

      });*/

    res.render('listProjects', { title: 'List Projects', projects:req.user.stats.projects});      

});


router.get('/createdProjects', accessProtectionMiddleware,function(req, res, next) {

    let projects=[];

    req.user.stats.projects.forEach((item)=>{

        if(item.status==="created") projects.push(item);
    });

    res.render('listProjects', { title: 'List Created Projects', projects:projects});      

});


router.get('/assignedProjects', accessProtectionMiddleware,function(req, res, next) {

    let projects=[];

    req.user.stats.projects.forEach((item)=>{

        if(item.status==="assigned") projects.push(item);
    });

    res.render('listProjects', { title: 'List  Assigned Projects', projects:projects});      

});


router.get('/completedProjects', accessProtectionMiddleware,function(req, res, next) {

    let projects=[];

    req.user.stats.projects.forEach((item)=>{

        if(item.status==="completed") projects.push(item);
    });

    res.render('listProjects', { title: 'List Completed Projects', projects:projects});      

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



      res.redirect('/users/projects');
  });


  });
		}


	});


});


router.get('/project/:id', accessProtectionMiddleware,function(req, res, next) {

      console.log('edit project id',req.params.id);


      Projects.findById({_id:req.params.id})
    .populate({ path: 'costs.product', model: 'Product' }).exec((err, project) => {
             
             
             console.log('edit project populate',project.costs[0].product);
        res.render('editProject', { title: 'Update  Project Info', project:project, moment:moment, errors: req.session.messages || []});
        req.session.messages = [];
    })

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
        
              res.render('addCosts', { title: 'Add Costs  Project ', project:req.params.id, products:products, errors: req.session.messages || []});

    });
});


router.post('/addcostproject/:id', accessProtectionMiddleware,function(req, res, next) {

      

   
       let cart=req.body.cart.split(';');
       console.log('add cost ', req.body.cart,'cart array',cart);

          cart.forEach((ite)=>{

              let item = JSON.parse(ite);
               console.log('ite',ite,'item',item);

                  Products.findOrCreate({ name: item.name }, item, (err,cost,created)=>{

                           console.log('cost',cost);
                              

                                   
                             Projects.findById({_id:req.params.id}, function (err, project) {
                              console.log('edit project',project);

                                    project.costs.push({product:cost._id,quantity:item.quantity});

                                    console.log('project add cost',project);

                                      Projects.findByIdAndUpdate({_id:req.params.id}, project, function (err, project) {

                                                          console.log('project update',project);
                                                          res.redirect('/users/projects');


                                            });

                                });



                                 


                              });

          });  


});


module.exports = router;
