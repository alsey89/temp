const mongoose = require("mongoose");

const QuestionsSchema = new mongoose.Schema({
  keywords: [String],
  gameMode: String,
  question: String,
  questionEN:String,
  correctAnswer: String,
});

const Questions = mongoose.model("Questions", QuestionsSchema);
module.exports = Questions;
