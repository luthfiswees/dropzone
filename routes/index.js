var express = require('express');
var router = express.Router();
var models     = require('../models');
var auth   = require('./auth');

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.render('index', { title: 'Boolean Logic ILM' });
});

/* GET authentication */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'ILM Login' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'ILM Account Registration' });
});

/* GET module page */
router.get('/module/introduction-module', auth, function(req, res, next) {
  res.render('module/introduction-module', { text: "" });
});

router.get('/module/proposition-module', auth, function(req, res, next) {
  res.render('module/proposition-module', { text: "" });
});

router.get('/module/not-module', auth, function(req, res, next) {
  res.render('module/not-module', { text: "" });
});

router.get('/module/and-module', auth, function(req, res, next) {
  res.render('module/and-module', { text: "" });
});

router.get('/module/or-module', auth, function(req, res, next) {
  res.render('module/or-module', { text: "" });
});

/* Tutorial module */
router.get('/tutorial-module/introduction-module', auth, function(req, res, next) {
  res.render('tutorial-module/introduction-module', { text: "" });
});

/* Create new game stage  */
router.get('/generate_new_game', auth, function(req, res, next) {
  // rewrite old game id with new id
  // Check if is_first boolean is true, if true trigger tutorial
  if (req.session.user['is_first']){
    models.User.findOne({
      where: {user_id: req.session.user['user_id']}
    }).then(function(user) {
      if(user){
        user.updateAttributes({
          is_first: false
        });
        req.session.user['is_first'] = false;
        req.session.user['tutorial_commencing'] = true;
        console.log("Commencing tutorial");
        res.redirect('/tutorial-module/introduction-module');
      } else {
        res.redirect('/');
      }
    });
  // Create new game object
  } else {
    if (req.session.user['tutorial_commencing']){
      models.Game.create({
        timestamp_start: Date.now(),
        user_id: req.session.user['user_id']
      }).then(function(game) {
        req.session.game = {"game_id": game['dataValues']['game_id'],
        // Initialize game data array
        "game_data": []};
        res.redirect('/stage-1-tutorial');
      });
    } else {
      models.Game.create({
        timestamp_start: Date.now(),
        user_id: req.session.user['user_id']
      }).then(function(game) {
        req.session.game = {"game_id": game['dataValues']['game_id'],
        // Initialize game data array
        "game_data": []};
        res.redirect('/stage-1');
      });
    }
  }
})

/* GET stage page. */
router.get('/stage-1', auth, function(req, res, next) {
  res.render('stage/stage-1', { text: "" });
});

router.get('/stage-2', auth, function(req, res, next) {
  if (req.session.user['tutorial_commencing']){
    res.render('tutorial-stage/stage-2', { text: "" });
  } else {
    res.render('stage/stage-2', { text: "" });
  }
});

router.get('/stage-3', auth, function(req, res, next) {
  if (req.session.user['tutorial_commencing']){
    res.render('tutorial-stage/stage-3', { text: "" });
  } else {
    res.render('stage/stage-3', { text: "" });
  }
});

router.get('/stage-4', auth, function(req, res, next) {
  if (req.session.user['tutorial_commencing']){
    res.render('tutorial-stage/stage-4', { text: "" });
  } else {
    res.render('stage/stage-4', { text: "" });
  }
});

router.get('/stage-5', auth, function(req, res, next) {
  if (req.session.user['tutorial_commencing']){
    res.render('tutorial-stage/stage-5', { text: "" });
  } else {
    res.render('stage/stage-5', { text: "" });
  }
});

/* Tutorial Stage */
router.get('/stage-1-tutorial', auth, function(req, res, next) {
  res.render('tutorial-stage/stage-1', { text: "" });
});


module.exports = router;
