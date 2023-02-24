const User = require("../models/user.js");

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send({ err: true, msg: "You need to log in to access this page." });
  }
};

module.exports = { checkAuthentication };
