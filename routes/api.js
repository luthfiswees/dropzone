var express    = require('express');
var router     = express.Router();
var models     = require('../models');
var async      = require('async');
var request    = require('request');
var basicAuth  = require('basic-auth');
var jwt        = require('jsonwebtoken');
var secret_key = "secret";
var auth       = require('./auth');

// Authenticate password
router.post('/validate', function(req, res, next){
  console.log(req.body);

  if(!req.body.email || !req.body.password){
    console.log("No email or password provided");
    res.send("Unauthorized");
  } else {
    models.User.findOne({
      where: {email: req.body.email}
    }).then(function(fetched_user){
      if (req.body.email === fetched_user['dataValues']['email'] && req.body.password === fetched_user['dataValues']['password']){
        console.log("Signed");
        req.session.user = {"email": req.body.email};
        res.redirect('/');
        //req.session.jwt = jwt.sign({email: fetched_user['dataValues']['email'], password: fetched_user['dataValues']['password']}, secret_key);
        //res.cookie('jwtToken', jwt.sign({email: fetched_user['dataValues']['email'], password: fetched_user['dataValues']['password']}, secret_key), { signed: true });
      } else {
        console.log("Fetched user not match");
        res.send("Unauthorized");
      }
    }).catch(function(err){
      console.log(err);
      res.redirect('/');
    });
  }
});

// Register
router.post('/register', function(req, res, next) {
  var username         = req.body.email;
  var password         = req.body.password;
  var confirm_password = req.body.confirmPassword;
  if (!username || !password || !confirm_password){
    console.log("Credentials not complete");
    res.json({
      "error": false,
      "message": "Credentials not complete"
    });
  }else{
    console.log("Credentials successfully provided");
    if (password === confirm_password){
      console.log("Password confirmed");
      models.User.create({
        email: username,
        password: password
      }).then(function(user){
        console.log("Account registered in database");
        res.json({
          "error": false,
          "message": "Successfully create an account with " + username
        });
      });
    } else {
      console.log("Password confirmation failed");
      res.json({
        "error": false,
        "message": "Password confirmation failed"
      });
    }
  }
  console.log("Register process start");
});

// Logout
router.get('/logout', function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

// Record action
router.post('/record_action', auth, function(req, res, next){
  console.log("Actions : " + req.body.action);
  res.send("Actions : " + req.body.action);
});

// Test data page
router.get('/test_data_page', function(req, res, next) {
  res.render('record');
});

module.exports = router;
