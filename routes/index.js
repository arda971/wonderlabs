var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);  

  res.render('index', { title: 'Express',user:req.user });
//  console.log('usr',req.user)
});

module.exports = router;
