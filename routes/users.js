var express = require('express');
var router = express.Router();


// Checks if a user is logged in
const accessProtectionMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'must be logged in to continue',
    });
  }
};

// A secret endpoint accessible only to logged-in users
router.get('/protected', accessProtectionMiddleware, (req, res) => {
  res.json({
    message: 'You have accessed the protected endpoint!',
    yourUserInfo: req.user,
  });
});



module.exports = router;
