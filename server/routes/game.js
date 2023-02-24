const express = require("express");
const router = express.Router();

const { joinGame, createGame } = require("../game/gameFunctions");
const { shami } = require("../game/shami");

//create game
router.post("/game/create", async (req, res) => {
  // req.body contains { gameMode, numberOfPlayers, numberOfRounds, privateGame, streamer }
  try {
    const createdGame = await createGame(req);
    res.status(200).json(createdGame);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "there was an error" });
  }
});

//join game
router.post("/game/join", async (req, res) => {
  // req.body includes { displayName, gameCode, uuid }
  try {
    const joinedGame = await joinGame(req);
    if (joinedGame.game) res.status(200).json(joinedGame);
    if (!joinedGame.game) res.status(400).json(joinedGame.msg);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "there was an error" });
  }
});

module.exports = router;
