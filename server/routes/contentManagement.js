const express = require("express");
const { saveQuestions } = require("../game/gameFunctions");
const router = express.Router();

//create Questions
router.post("/questions/add", async (req, res) => {
  try {
    const savedQuestions = await saveQuestions(req);
    console.log(savedQuestions);
    res.status(200).json({
      numberOfQuestions: savedQuestions.length,
      msg: "questions saved to database",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "there was an error" });
  }
});

// TO DO: clean duplicates
// router.post("/questions/clean", async (req, res) => {
//     try {
//       FUNCTION TO CLEAN-UP DUPLICATE QUESTIONS
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({ msg: "there was an error" });
//     }
//   });

module.exports = router;
