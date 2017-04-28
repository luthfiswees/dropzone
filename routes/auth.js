// Authentication function
var auth = function (req, res, next) {
  if(req.session.user === undefined)
    return res.render('login', { title: 'ILM Login' });
  next();
};

module.exports = auth;
