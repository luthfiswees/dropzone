var express = require('express');
var router  = express.Router();
var models  = require('../models');
var async   = require('async');
var request = require('request');
var basicAuth = require('basic-auth');

// Authentication function
var auth = function (req, res, next) {
  // Responding for unauthorized authentication
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.render('login', { title: 'ILM Login' });
  };

  // Wrap request with basicAuth
  var user = basicAuth(req);

  // Check credentials
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }else{
    models.User.findOne({
      where: {email: user.name}
    }).then(function(fetched_user){
      if (user.name === fetched_user['dataValues']['email'] && user.pass === fetched_user['dataValues']['password']){
        console.log("Authentication match");
        return next();
      } else {
        console.log("Authentication failed");
        return unauthorized(res);
      }
    });
  };
};

// Authenticate password
router.post('/validate', function(req, res, next){
  // Extract email and password from request
  var email    = req.body.email;
  var password = req.body.password;

  // For redirecting to previous page
  var redirect_url = "/api/test_auth";

  // Wrap request with basic auth
  console.log(req);

  // Redirect
  res.set('WWW-Authenticate', 'Basic: ' + new Buffer(email + ":" + password).toString('base64'));
  res.redirect(redirect_url);
});

// Test authentication
router.get('/test_auth', auth, function(req, res, next) {
  res.json({"message": "Authentication success"});
});

// Test post data
router.post('/test', function(req, res, next) {
  console.log("Test successfull");
  res.json({"message": "No Error"});
});

// Test sequelize ORM
router.post('/test_orm', function(req, res, next) {
  models.User.sync({force: true}).then(function () {
    // Table created
    models.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function(user){
      res.json({
        "error": "Nope",
        "message": "Successfully create an account with " + req.body.email
      });
    });
  });
});

// Show tracking data
router.get('/show_data', function(req, res, next) {
  console.log("Data: " + req.param.array);
  res.send(" " + req.param.array.length);
});

module.exports = router;
