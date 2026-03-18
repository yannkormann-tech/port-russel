function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  const isApiRequest = req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/catway") || req.originalUrl.startsWith("/catways") || req.originalUrl.startsWith("/users") || req.originalUrl === "/logout";

  if (isApiRequest) {
    return res.status(401).json({ message: "Authentication required" });
  }

  return res.redirect("/");
}

module.exports = { ensureAuthenticated };
