const uuid = require("uuid");
const { controller } = require("./shami.controller");

//Load Questions model
const Questions = require("../models/questions");
const Game = require("../models/game");

//!--FUNCTIONS FOR CREATING AND JOINING GAMES

//CREATE GAME
const createGame = async (req) => {
  try {
    const { gameMode, numberOfPlayers, numberOfRounds, privateGame, streamer } =
      req.body;
    const gameCode = await generateGameCode(4);
    const questions = await fetchQuestions({ numberOfRounds: numberOfRounds });
    const newGame = {
      gameId: uuid.v4(),
      hostMongoId: req.user._id, //REMEMBER!!! WE'RE USING MONGDO'S OJECTID FOR THIS
      hostUUID: req.user.uuid,
      gameMode: gameMode,
      gameCode: gameCode,
      rounds: numberOfRounds,
      numberOfPlayers: numberOfPlayers,
      isPrivate: privateGame,
      streamer: streamer,
      players: [{ displayName: req.user.displayName, uuid: req.user.uuid }],
      questions: questions,
      answers: [],
      active: true,
      gameStatus: {
        joinedPlayers: [],
        readyPlayers: [],
        answeredPlayers: [],
        votedPlayers: [],
      },
    };
    console.log(newGame);
    controller(newGame.gameId);
    return await Game.create(newGame);
  } catch (err) {
    console.log("err", err);
    return err;
  }
};

//JOIN GAME
const joinGame = async (req) => {
  try {
    const { gameCode, uuid, displayName } = req.body;
    console.log("we're in the joingame place", gameCode, uuid, displayName);
    // find active game that matches code
    const game = await Game.findOne({ active: true, gameCode: gameCode });
    if (!game) {
      //console.log("no game found");
      return { msg: "no active games that match the code" };
    }

    const alreadyJoined = game.players.filter((player) => player.uuid == uuid);
    if (alreadyJoined.length > 0) {
      console.log("already joined");
      return { game: game, msg: "game rejoined successfully." };
    }

    // check if there are any spots available
    const spotsAvailable = game.players.length < game.numberOfPlayers;
    if (!spotsAvailable) {
      //console.log("game is full");
      return { msg: "game is full" };
    }

    // update the game document
    const updatedGame = await Game.findOneAndUpdate(
      { active: true, gameCode: gameCode },
      {
        $addToSet: {
          players: { displayName: displayName, uuid: uuid, score: 0 },
        },
      },
      { new: true }
    );

    return { game: updatedGame, msg: "game joined successfully" };
  } catch (err) {
    throw new Error(err);
  }
};

//!--FUNCTIONS USED IN GAME LOGIC--
const generateGameCode = (length) => {
  const alphabetSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let gameCode = "";

  for (let i = 0; i < length; i++) {
    gameCode += alphabetSet.charAt(
      Math.floor(Math.random() * alphabetSet.length)
    );

    //todo: make sure game code doesn't coincide with any active games
  }

  return gameCode;
};

const updateStatus = async (field, operator, parameters) => {
  const { gameId, displayName, uuid } = parameters;
  try {
    const game = Game.findOneAndUpdate(
      { active: true, gameId: gameId },
      {
        [operator]: {
          [`gameStatus.${field}`]: {
            displayName: displayName,
            uuid: uuid,
          },
        },
      },
      {
        new: true,
        projection: {
          _id: 0,
          gameStatus: 1,
        },
      }
    );
    if (!game) {
      // handle the case where the document was not found
      console.error("Game not found");
      socket.emit("error", { msg: "Game not found" });
      return;
    } else {
      return game;
    }
  } catch (err) {
    console.error(err);
    socket.emit("error", { msg: err });
  }
};

//--CONTENT MANAGEMENT--
const fetchQuestions = async (arg) => {
  let { keywords, numberOfRounds } = arg;
  try {
    if (!keywords) {
      //console.log("no keywords passed");
      keywords = "random";
    }
    const questions = await Questions.aggregate([
      {
        $match: { $expr: { $in: [keywords, "$keywords"] } },
        //this is the syntax to use when yhou want to match something inside of an array.
      },
      {
        $group: {
          _id: "$_id",
          question: { $first: "$question" },
          correctAnswer: { $first: "$correctAnswer" },
          //// keywords: { $first: "$keywords" },
          //// gameType: { $first: "$gameType" },
          //*$group stage groups documents in a collection by a specific key and apply operations to them. In this case, we're using the "_id" field as a key, which is unique for each document, so we'll only get one unique document from the collection.
          //*The $first operator is then used to select the first document in each group and include its fields in the output documents. This ensures that only one document per group is included in the final output.
        },
      },
      {
        $sample: { size: numberOfRounds * 3 },
        //the problem with using sample alone is that it will return non-unique documents
      },
    ]);
    return questions;
  } catch (err) {
    return err;
  }
};

const saveQuestions = async (req) => {
  try {
    const { gameMode, keywords, questions } = req.body;
    let savedQuestions = [];
    for (var i = 0; i < questions.length; i++) {
      const newQuestion = {
        keywords: keywords,
        gameMode: gameMode,
        question: questions[i].question,
        correctAnswer: questions[i].answer,
      };
      savedQuestions.push(await Questions.create(newQuestion));
    }
    return savedQuestions;
  } catch (err) {
    return err;
  }
};

//--MISC--
const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

module.exports = {
  generateGameCode,
  fetchQuestions,
  saveQuestions,
  joinGame,
  createGame,
  delay,
  updateStatus,
};
