function sessionUser(req, res, next) {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
}

module.exports = { sessionUser };
