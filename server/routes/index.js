const express = require("express");
const { checkAuthentication } = require("../middleware/routes.middleware");
const router = express.Router();

// router.all("*", (req, res, next) => {
//   console.log("incomming request");
//   console.log(req.user);
//   // res.render("login");
//   next();
// });
router.get("/register", (req, res) => res.render("register"));
router.get("/login", (req, res) => res.render("login"));
router.get("/dashboard", checkAuthentication, (req, res) =>
  res.render("dashboard")
);
router.get("/protected", checkAuthentication, (req, res) =>
  res.send("PROTECTED ROUTE")
);

module.exports = router;
