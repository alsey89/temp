const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;

const GameSchema = new mongoose.Schema({
  gameId: String,
  hostMongoId: { type: Schema.Types.ObjectId, ref: "User" },
  hostUUID: String,
  gameMode: String,
  gameCode: String,
  rounds: Number,
  numberOfPlayers: Number,
  isPrivate: Boolean,
  streamer: Boolean,
  players: Array,
  questions: [{ type: Schema.Types.ObjectId, ref: "Questions" }],
  answers: [
    {
      playerUUID: String,
      displayName: String,
      questionId: String,
      round: Number,
      answer: String,
      votes: Array,
    },
  ],
  winnerDisplayName: String, //if winner is not registered, we won't have an id to populate
  winnerUUID: String,
  active: Boolean,
  gameStatus: {
    joinedPlayers: [],
    readyPlayers: [],
    answeredPlayers: [],
    votedPlayers: [],
    currentRound: { type: Number, default: 1 },
  },
});

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;
