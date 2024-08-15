const jwt = require('jsonwebtoken');

function isLoggedin(req,res,next){
    if (!req.cookies.token) {
      return res.redirect("/login");
  }
  try {
      let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      req.user = data;
      next();
  } catch (error) {
      console.error("JWT verification failed:", error);
      return res.redirect("/login");
  }
  }

  module.exports = isLoggedin