var express    = require('express');
var router     = express.Router();
var models     = require('../models');
var async      = require('async');
var request    = require('request');
var basicAuth  = require('basic-auth');
var jwt        = require('jsonwebtoken');
var auth       = require('./auth');

Object.defineProperties(Array.prototype, {
  count: {
    value: function(value) {
      return this.reduce(function(total,x){return x==value ? total+1 : total}, 0);
    }
  }
});

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
          req.session.game["latest_game_id"] = req.session.game["game_id"];
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

// Access data page
router.get('/data_page', auth, function(req, res, next) {
  if (req.session.user['latest_game_id'] === undefined){
    console.log("Latest Game ID not found");
    models.Game.findAndCountAll({
      where: {user_id: req.session.user['user_id']}
    }).then(function(game_data){
      req.session.user['latest_game_id'] = parseInt(game_data.count);
      res.render('record');
    }).catch(function(err){
      console.log(err);
      res.redirect('/');
    });
  } else {
    console.log("Latest Game ID found");
    res.render('record');
  }
});

// Get list of data to be presented in line chart
router.post('/behaviour_chart_data', auth, function(req, res, next) {
  models.Game.findAll({
    where: {user_id: req.session.user['user_id']}
  }).then(function(game_data){
    var parsed_game_data = game_data;
    Object.keys(parsed_game_data).map(function(key, index) {
      parsed_game_data[key] = parsed_game_data[key]['dataValues']['game_id'];
    });
    models.Action.findAll({
      where: {game_id: parsed_game_data}
    }).then(function(action_data){
      var parsed_action_data = action_data;
      Object.keys(parsed_action_data).map(function(key, index) {
        // Map to SRL Actions
        try {
          var current_action = parsed_action_data[index]['dataValues']['action_name'];
          var next_action    = parsed_action_data[index+1]['dataValues']['action_name'];
          var click_regex    = new RegExp("click (.* )? box");
          if (click_regex.test(current_action)){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "open instruction" && next_action === "close instruction"){
            // Define as Planning
            parsed_action_data[key] = 4;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box in dropzone"){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box away from dropzone") {
            // Define as Regulating
            parsed_action_data[key] = 1;
          } else if (current_action === "drop box in dropzone" && click_regex.test(next_action)) {
            // Define as Monitoring
            parsed_action_data[key] = 2;
          } else {
            parsed_action_data[key] = 0;
          }
        } catch(err) {
          parsed_action_data[key] = 0;
        }
      });
      res.send(parsed_action_data);
    });
  });
});

router.post('/dominant_behaviour_chart_data', auth, function(req, res, next) {
  models.Game.findAll({
    where: {user_id: req.session.user['user_id']}
  }).then(function(game_data){
    var parsed_game_data = game_data;
    Object.keys(parsed_game_data).map(function(key, index) {
      parsed_game_data[key] = parsed_game_data[key]['dataValues']['game_id'];
    });
    models.Action.findAndCountAll({
      where: {game_id: parsed_game_data}
    }).then(function(action_data){
      var parsed_action_data = action_data.rows;
      var number_of_all_action = parseFloat(action_data.count);

      Object.keys(parsed_action_data).map(function(key, index) {
        // Map to SRL Actions
        try {
          var current_action = parsed_action_data[index]['dataValues']['action_name'];
          var next_action    = parsed_action_data[index+1]['dataValues']['action_name'];
          var click_regex    = new RegExp("click (.* )? box");
          if (click_regex.test(current_action)){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "open instruction" && next_action === "close instruction"){
            // Define as Planning
            parsed_action_data[key] = 4;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box in dropzone"){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box away from dropzone") {
            // Define as Regulating
            parsed_action_data[key] = 1;
          } else if (current_action === "drop box in dropzone" && click_regex.test(next_action)) {
            // Define as Monitoring
            parsed_action_data[key] = 2;
          } else {
            parsed_action_data[key] = 0;
          }
        } catch(err) {
          parsed_action_data[key] = 0;
        }
      });
      //console.log("Number of Zero : " + parsed_action_data.count(0));
      res.json({"0": parsed_action_data.count(0)/number_of_all_action ,
                "1": parsed_action_data.count(1)/number_of_all_action,
                "2": parsed_action_data.count(2)/number_of_all_action,
                "3": parsed_action_data.count(3)/number_of_all_action,
                "4": parsed_action_data.count(4)/number_of_all_action
              });
    });
  });
});

// Get list of data to be presented in line chart
router.post('/latest_game_behaviour_chart_data', auth, function(req, res, next) {
    models.Action.findAll({
      where: {game_id: req.session.user['latest_game_id']}
    }).then(function(action_data){
      var parsed_action_data = action_data;
      Object.keys(parsed_action_data).map(function(key, index) {
        // Map to SRL Actions
        try {
          var current_action = parsed_action_data[index]['dataValues']['action_name'];
          var next_action    = parsed_action_data[index+1]['dataValues']['action_name'];
          var click_regex    = new RegExp("click (.* )? box");
          if (click_regex.test(current_action)){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "open instruction" && next_action === "close instruction"){
            // Define as Planning
            parsed_action_data[key] = 4;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box in dropzone"){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box away from dropzone") {
            // Define as Regulating
            parsed_action_data[key] = 1;
          } else if (current_action === "drop box in dropzone" && click_regex.test(next_action)) {
            // Define as Monitoring
            parsed_action_data[key] = 2;
          } else {
            parsed_action_data[key] = 0;
          }
        } catch(err) {
          parsed_action_data[key] = 0;
        }
      });
      res.send(parsed_action_data);
    });
});

router.post('/latest_game_dominant_behaviour_chart_data', auth, function(req, res, next) {
    models.Action.findAndCountAll({
      where: {game_id: req.session.user['latest_game_id']}
    }).then(function(action_data){
      var parsed_action_data = action_data.rows;
      var number_of_all_action = parseFloat(action_data.count);

      Object.keys(parsed_action_data).map(function(key, index) {
        // Map to SRL Actions
        try {
          var current_action = parsed_action_data[index]['dataValues']['action_name'];
          var next_action    = parsed_action_data[index+1]['dataValues']['action_name'];
          var click_regex    = new RegExp("click (.* )? box");
          if (click_regex.test(current_action)){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "open instruction" && next_action === "close instruction"){
            // Define as Planning
            parsed_action_data[key] = 4;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box in dropzone"){
            // Define as Cognitive Actions
            parsed_action_data[key] = 3;
          } else if (current_action === "drag box into dropzone" && next_action === "drop box away from dropzone") {
            // Define as Regulating
            parsed_action_data[key] = 1;
          } else if (current_action === "drop box in dropzone" && click_regex.test(next_action)) {
            // Define as Monitoring
            parsed_action_data[key] = 2;
          } else {
            parsed_action_data[key] = 0;
          }
        } catch(err) {
          parsed_action_data[key] = 0;
        }
      });
      //console.log("Number of Zero : " + parsed_action_data.count(0));
      res.json({"0": parsed_action_data.count(0)/number_of_all_action ,
                "1": parsed_action_data.count(1)/number_of_all_action,
                "2": parsed_action_data.count(2)/number_of_all_action,
                "3": parsed_action_data.count(3)/number_of_all_action,
                "4": parsed_action_data.count(4)/number_of_all_action
              });
    });
});

// Get list of data to be presented in pie chart

module.exports = router;
