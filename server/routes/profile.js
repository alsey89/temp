const express = require("express");
const router = express.Router();

const User = require("../models/user");

//request player profile
router.get("/user/:uuid", async (req, res) => {
  console.log(req.query);
  try {
    const uuid = req.params.uuid;
    const userData = await User.findOne(
      { uuid: uuid },
      { email: false, password: false }
    );
    if (userData) {
      console.log(userData);
      res.status(200).json({ userData: userData });
    } else {
      res.status(400).json({ msg: "user not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "there was an error" });
  }
});

//! THIS ONE USES REQ.BODY TO PASS THE UUID
// router.get("/user", async (req, res) => {
//   try {
//     const uuid = req.body.uuid;
//     const userData = await User.findOne(
//       { uuid: uuid },
//       { email: false, password: false }
//     );
//     if (userData) {
//       console.log(userData);
//       res.status(200).json({ userData: userData });
//     } else {
//       res.status(400).json({ msg: "user not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ msg: "there was an error" });
//   }
// });

module.exports = router;
