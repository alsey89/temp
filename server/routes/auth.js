const { json } = require("express");
const express = require("express");
const passport = require("passport");

const router = express.Router();

require("../config/passport.js");

var jsonPayload = { msg: null }; //defining the keys, so that they show up in order before the others
//register
router.post("/register", (req, res, next) => {
  passport.authenticate("local-signup", (err, user, info) => {
    //error
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    //load messages from passport
    if (info) {
      jsonPayload.msg = info.message;
    }
    //authentication failed
    if (!user) {
      res.status(400).json(jsonPayload);
    }
    //authentication successful
    if (user) {
      jsonPayload.displayName = user.displayName;
      jsonPayload.email = user.email;
      jsonPayload.uuid = user.uuid;
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        return res.status(200).json(jsonPayload);
      });
    }
  })(req, res, next);
});

//login
router.post("/login", (req, res, next) => {
  passport.authenticate("local-signin", (err, user, info) => {
    //error
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    //load messages from passport
    if (info) {
      jsonPayload.msg = info.message;
    }
    //authentication failed
    if (!user) {
      res.status(400).json(jsonPayload);
    }
    //authentication successful
    if (user) {
      jsonPayload.displayName = user.displayName;
      jsonPayload.email = user.email;
      jsonPayload.uuid = user.uuid;
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        return res.status(200).json(jsonPayload);
      });
    }
  })(req, res, next);
});

//oauth Google
router.get(
  "/oauth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/oauth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    //error
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    //load messages from passport
    if (info) {
      jsonPayload.msg = info.message;
    }
    //authentication successful
    if (user) {
      jsonPayload.displayName = user.displayName;
      jsonPayload.email = user.email;
      jsonPayload.uuid = user.uuid;
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        return res.status(200).json(jsonPayload);
      });
    }
  })(req, res, next);
});

//oauth Facebook
router.get(
  "/oauth/facebook",
  passport.authenticate("facebook", { scope: ["email", "profile"] })
);

router.get("/oauth/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", (err, user, info) => {
    //error
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    //load messages from passport
    if (info) {
      jsonPayload.msg = info.message;
    }
    //authentication successful
    if (user) {
      jsonPayload.displayName = user.displayName;
      jsonPayload.email = user.email;
      jsonPayload.uuid = user.uuid;
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        return res.status(200).json(jsonPayload);
      });
    }
  })(req, res, next);
});

//oauth LINE
router.get(
  "/oauth/line",
  passport.authenticate("line", { scope: ["profile", "openid"] })
);

router.get("/oauth/line/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    //error
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    //load messages from passport
    if (info) {
      jsonPayload.msg = info.message;
    }
    //authentication successful
    if (user) {
      jsonPayload.displayName = user.displayName;
      jsonPayload.email = user.email;
      jsonPayload.uuid = user.uuid;
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        return res.status(200).json(jsonPayload);
      });
    }
  })(req, res, next);
});

//logout
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.cookie.maxAge = 0;
    req.session.destroy();
  }
  jsonPayload.msg = "user logged out";
  res.status(200).json(jsonPayload);
});

module.exports = router;
