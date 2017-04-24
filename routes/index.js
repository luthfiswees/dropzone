var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
router.get('/module/introduction-module', function(req, res, next) {
  res.render('module/introduction-module', { text: "" });
});

router.get('/module/proposition-module', function(req, res, next) {
  res.render('module/proposition-module', { text: "" });
});

router.get('/module/not-module', function(req, res, next) {
  res.render('module/not-module', { text: "" });
});

router.get('/module/and-module', function(req, res, next) {
  res.render('module/and-module', { text: "" });
});

router.get('/module/or-module', function(req, res, next) {
  res.render('module/or-module', { text: "" });
});

/* GET stage page. */
router.get('/stage-1', function(req, res, next) {
  res.render('stage/stage-1', { text: "" });
});

router.get('/stage-2', function(req, res, next) {
  res.render('stage/stage-2', { text: "" });
});

router.get('/stage-3', function(req, res, next) {
  res.render('stage/stage-3', { text: "" });
});


module.exports = router;
