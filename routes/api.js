var express    = require('express');
var router     = express.Router();
var models     = require('../models');
var async      = require('async');
var request    = require('request');
var basicAuth  = require('basic-auth');
var jwt        = require('jsonwebtoken');
var auth       = require('./auth');

// Authenticate password
router.post('/validate', function(req, res, next){
  if(!req.body.email || !req.body.password){
    console.log("No email or password provided");
    res.send("Unauthorized");
  } else {
    models.User.findOne({
      where: {email: req.body.email}
    }).then(function(fetched_user){
      if (req.body.email === fetched_user['dataValues']['email'] && req.body.password === fetched_user['dataValues']['password']){
        console.log("Signed");
        req.session.user = {
          "email": req.body.email,
          "user_id": fetched_user['dataValues']['user_id'],
          "name": fetched_user['dataValues']['first_name'],
          "is_first": fetched_user['dataValues']['is_first']
        };
        res.redirect('/');
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
  var first_name       = req.body.first_name;
  var last_name        = req.body.last_name;
  if (!username || !password || !confirm_password || !first_name){
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
        password: password,
        first_name: first_name,
        last_name: last_name
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

  // Record every action and store into session
  req.session.game["game_data"].push({
    game_id: req.session.game['game_id'], stage: req.body.stage, action_name: req.body.action, action_timestamp: Date.now()});

  res.send("Actions recorded : " + req.body.action)
});

// Create object from recent game sessions
router.get('/record_game', auth, function(req, res, next){
  console.log(req.session.game);
  if (req.session.user['tutorial_commencing']){
    req.session.user['tutorial_commencing'] = false;
  } 
  models.Action.bulkCreate(req.session.game["game_data"]).then(
    function(){
      // Update timestamp_end attribute to end game
      models.Game.findOne({
        where: {game_id: req.session.game["game_id"]}
      }).then(function(game){
        if (game){
          game.updateAttributes({
            timestamp_end: Date.now()
          });
          console.log("Game successfully ended");
          console.log("Your game data will be shown");
          res.redirect("/api/data_page");
        }
      }).catch(function(err){
        console.log(err);
        res.send("Game not found");
      });
    }
  ).catch(function(err){
    console.log(err);
    res.send("Game data not recorded");
  });
});

// Test data page
router.get('/data_page', function(req, res, next) {
  res.render('record');
});

module.exports = router;
