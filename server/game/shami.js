const socketio = require("socket.io");
const { findOne } = require("../models/game");
const ObjectId = require("mongodb").ObjectId;

const Game = require("../models/game");
const { updateStatus } = require("./gameFunctions");

//TODO: Clean up the game logic. Abstract away the game logic and all communication with the DB.

module.exports = (server) => {
  //we're passing in the server from the server.js file
  const io = new socketio.Server(server);
  //each gameMode is a separate namespace
  const shami = io.of("/shami");
  //io represents the server side and socket represents the client side
  shami.on("connection", async (socket) => {
    //!--------------CONNECTION PHASE-------------
    const { gameId, displayName, uuid } = socket.handshake.query;

    //join room, identified by the gameId
    socket.join(gameId);

    //*the updateStatus function (+error handling) is abstracted to gameFunctions.js! It takes in the list to update (joinedPlayers, readyPlayers, answeredPlayerse, votedPlayers, etc.), an operator ($addToSEt, $push or $pull), and the socket query parameters. It returns the gameStatus from the game document.

    //host is always ready
    try {
      const game = await Game.findOne({
        gameId: gameId,
        active: true,
      });
      if (!game) {
        // handle the case where the document was not found
        console.error("Game not found");
        socket.emit("error", { msg: "Game not found" });
        return;
      }
      if (game.hostUUID == uuid) {
        await updateStatus("readyPlayers", "$addToSet", socket.handshake.query);
      }
    } catch (err) {
      console.error(err);
      socket.emit("error", { msg: err });
    }

    //controller is not added to gamestatus arrays
    if (uuid != "controller") {
      const gameStatus = await updateStatus(
        "joinedPlayers",
        "$addToSet",
        socket.handshake.query
      );
      //emit to everyone in (room) the status of every player
      shami.to(gameId).emit("connected", {
        gameStatus: gameStatus.gameStatus,
      });
    } else {
      socket.emit("connected", {
        msg: "controller connected",
      });
    }

    //!---------------PREP PHASE------------------ READY?
    socket.on("readyCheck", async (arg) => {
      const { readyStatus } = arg;
      let gameStatus;
      if (readyStatus == true) {
        gameStatus = await updateStatus(
          "readyPlayers",
          "$addToSet",
          socket.handshake.query
        );
      }
      if (readyStatus == false) {
        gameStatus = await updateStatus(
          "readyPlayers",
          "$pull",
          socket.handshake.query
        );
      }
      shami.to(gameId).emit("readyPlayers", {
        gameStatus: gameStatus.gameStatus,
      });
    });

    //*Only the host can emit this event.
    socket.on("startGame", async (arg) => {
      //check if players are ready
      let gameStatus;
      try {
        const game = await Game.findOne(
          {
            active: true,
            gameId: gameId,
          },
          { _id: 0, gameStatus: 1 }
        ).lean();
        if (!game) {
          // handle the case where the document was not found
          console.error("Game not found");
          socket.emit("error", { msg: "Game not found" });
          return;
        }
        gameStatus = game.gameStatus;
      } catch (err) {
        console.error(err);
        socket.emit("error", { msg: err });
      }

      const allPlayersReady =
        gameStatus.joinedPlayers.length == gameStatus.readyPlayers.length;

      if (!allPlayersReady) {
        socket.emit("error", { msg: "players not ready" });
        return;
      }

      const timeZero = Date.now() + 5500;
      shami.to(gameId).emit("gameStarted", { timeZero: timeZero });

      //Reset list of ready players
      try {
        await Game.updateOne(
          { active: true, gameId: gameId },
          {
            $set: { "gameStatus.readyPlayers": [] },
          },
          { new: true }
        );
      } catch (err) {
        console.error(err);
        socket.emit("error", { msg: err });
      }
    });

    //!-----------GENERAL ROUND PHASE------------- SET...
    socket.on("set", async (arg) => {
      let gameStatus = await updateStatus(
        "readyPlayers",
        "$addToSet",
        socket.handshake.query
      );
      gameStatus = gameStatus.gameStatus;
      if (gameStatus.joinedPlayers.length == gameStatus.readyPlayers.length) {
        shami.to(gameId).emit("go", {});
      } else {
        //todo: remove this after testing phase
        shami.to(gameId).emit("error", {
          gameStatus: gameStatus,
          msg: "waiting for players",
        });
        console.log("waiting for players");
      }
    });

    socket.on("submitAnswer", async (arg) => {
      const { questionId, displayName, uuid, answer, round } = arg;
      let game;
      try {
        game = await Game.findOneAndUpdate(
          { active: true, gameId: gameId },
          {
            $addToSet: {
              answers: {
                playerUUID: uuid,
                displayName: displayName,
                questionId: questionId,
                answer: answer,
                round: round,
                votes: [],
              },
              "gameStatus.answeredPlayers": {
                displayName: displayName,
                uuid: uuid,
              },
            },
          },
          { new: 1 }
        );
        if (!game) {
          // handle the case where the document was not found
          console.error("Game not found");
          socket.emit("error", { msg: "Game not found" });
          return;
        }
      } catch (err) {
        console.error(err);
        socket.emit("error", { msg: err });
      }

      shami.to(gameId).emit("answerSubmitted", { gameStatus: game.gameStatus });
      //if all players have answered, skip the timer
      if (
        game.gameStatus.joinedPlayers.length ==
        game.gameStatus.answeredPlayers.length
      ) {
        shami.to(gameId).emit("skippingTimer", {});
      }
    });

    socket.on("submitVote", async (arg) => {
      const { displayName, uuid, answerId } = arg;
      let game;
      try {
        game = await Game.findOneAndUpdate(
          { "answers._id": new ObjectId(answerId) },
          {
            $addToSet: {
              "answers.$.votes": {
                displayName: displayName,
                uuid: uuid,
              },
              "gameStatus.votedPlayers": {
                displayName: displayName,
                uuid: uuid,
              },
            },
          },
          { new: 1 }
        );
        if (!game) {
          // handle the case where the document was not found
          console.error("Game not found");
          socket.emit("error", { msg: "Game not found" });
          return;
        }
      } catch (err) {
        console.error(err);
        socket.emit("error", { msg: err });
      }

      shami.to(gameId).emit("voteSubmitted", { gameStatus: game.gameStatus });
      //if all players have voted, skip the timer
      if (
        game.gameStatus.joinedPlayers.length ==
        game.gameStatus.votedPlayers.length
      ) {
        shami.to(gameId).emit("skippingTimer", {});
      }
    });

    socket.on("pauseGame", async (arg) => {
      shami.to(gameId).emit("pausingGame", {});
    });

    socket.on("resumeGame", async (arg) => {
      shami.to(gameId).emit("resumingGame", {});
    });

    socket.on("skipTimer", async (arg) => {
      socket.to(gameId).emit("skippingTimer", {});
    });

    socket.on("endGame", async (arg) => {
      let gameStatus = await updateStatus(
        "readyPlayers",
        "$addToSet",
        socket.handshake.query
      );
      gameStatus = gameStatus.gameStatus;
      if (gameStatus.joinedPlayers.length == gameStatus.readyPlayers.length) {
        console.log("sending gameEnding...");
        shami.to(gameId).emit("gameEnding", {});
      } else {
        console.log("waiting for players");
      }
    });

    socket.on("serveBestPlay", async (arg) => {
      const game = await Game.findOne({ active: true, gameId: gameId });
      console.log(game.answers);
      const bestPlay = game?.answers
        .filter((answer) => answer.playerUUID === "client 3's uuid")
        .sort((a, b) => b.votes.length - a.votes.length)
        .shift();

      socket.emit("bestPlayServed", { msg: bestPlay });
    });

    //!---------CONTROLLER SPECIFIC LOGIC--------- GO!!!
    if (uuid == "controller") {
      socket.on("go", async (arg) => {
        console.log("let's go!");
        //!-- Fetch Round Questions --
        let game;
        try {
          game = await Game.findOne({
            gameId: gameId,
            active: true,
          }).populate("questions");
          if (!game) {
            // handle the case where the document was not found
            console.error("Game not found");
            socket.emit("error", { msg: "Game not found" });
            return;
          }
        } catch (err) {
          console.error(err);
          socket.emit("error", { msg: err });
        }

        //*questions for round 1 = indices 0,1,2, round 2 = indices 3,4,5, etc.
        const questionIndex = (game.gameStatus.currentRound - 1) * 3;
        const questions = game.questions.slice(
          questionIndex,
          questionIndex + 3 //slice excludes the upper limit
        );

        //Guard Max Rounds
        if (game.gameStatus.currentRound > game.rounds) {
          socket.emit("error", { msg: "max rounds exceeded" });
          return;
        }

        //!-- FUNCTIONS --
        let startTime;
        let elapsedTimeQP = 0;
        let elapsedTimeVP = 0;
        let timeLimit = 60000;
        let phase = "notStarted";
        let subround = 1;
        let currentQuestion;

        const gameTimer = async (animationTime) => {
          if (phase == "question") {
            startTime = Date.now();
            //console.log(`waiting ${timeLimit - elapsedTimeQP}`);
            await new Promise(
              (resolve) =>
                (questionTimer = setTimeout(resolve, timeLimit - elapsedTimeQP))
            );
          }
          if (phase == "voting") {
            startTime = Date.now();
            //console.log(`waiting ${timeLimit - elapsedTimeVP}`);
            await new Promise(
              (resolve) =>
                (votingTimer = setTimeout(resolve, timeLimit - elapsedTimeVP))
            );
          }
          if (phase == "subroundResults") {
            startTime = Date.now();
            //console.log(`waiting ${animationTime}`);
            await new Promise(
              (resolve) =>
                (subRoundResultsTimer = setTimeout(resolve, animationTime))
            );
          }
        };

        const pause = async () => {
          //console.log(`pausing at Phase: ${phase} ${subround}`);
          if (phase == "question") {
            elapsedTimeQP = Date.now() - startTime;
            clearTimeout(questionTimer);
          } else if (phase == "voting") {
            elapsedTimeVP = Date.now() - startTime;
            clearTimeout(votingTimer);
          } else {
            //*guard aginst illegal pause
            console.log("cannot pause here");
          }
        };

        const resume = async () => {
          if (elapsedTimeQP > 0 || elapsedTimeVP > 0) {
            // console.log(
            //   `resuming at Phase: ${phase} ${subround}. Elapsed time: QP: ${elapsedTimeQP}, VP: ${elapsedTimeVP}`
            // );
            serveRound();
            elapsedTimeQP = 0;
            elapsedTimeVP = 0;
          } else {
            console.log("Cannot resume without pausing.");
          }
        };

        const skip = async () => {
          //console.log(`skipping timer at Phase: ${phase} ${subround}`);
          if (phase == "question") {
            clearTimeout(questionTimer);
            elapsedTimeQP = timeLimit;
            serveRound();
            elapsedTimeQP = 0;
          } else if (phase == "voting") {
            clearTimeout(votingTimer);
            elapsedTimeVP = timeLimit;
            serveRound();
            elapsedTimeVP = 0;
          } else {
            console.log("cannot skip here");
          }
        };

        const serveQuestion = async () => {
          let question = questions.shift(); //*questions array is mutated
          shami.to(gameId).emit("questionServed", { question: question });
          return question;
        };

        const serveVotes = async (currentQuestion) => {
          let game;
          try {
            game = await Game.findOne(
              { active: true, gameId: gameId },
              { new: true, answers: 1, _id: 0 }
            );
            if (!game) {
              // handle the case where the document was not found
              console.error("Game not found");
              socket.emit("error", { msg: "Game not found" });
              return;
            }
          } catch (err) {
            console.error(err);
            socket.emit("error", { msg: err });
          }

          const candidates = game.answers.filter(
            (candidate) => candidate?.questionId == currentQuestion?._id
          );
          shami.to(gameId).emit("votesServed", { candidates: candidates });
        };

        const resetPlayerArrays = async () => {
          const freshPlayerArrays = await Game.updateOne(
            { active: true, gameId: gameId },
            {
              $set: {
                "gameStatus.votedPlayers": [],
                "gameStatus.answeredPlayers": [],
                "gameStatus.readyPlayers": [],
              },
            },
            { new: true }
          );
          return freshPlayerArrays;
        };

        const serveSubroundResults = async (currentQuestion) => {
          let game;
          try {
            game = await Game.findOne({
              gameId: gameId,
              active: true,
            }).populate("answers");
            if (!game) {
              // handle the case where the document was not found
              console.error("Game not found");
              socket.emit("error", { msg: "Game not found" });
              return;
            }
          } catch (err) {
            console.error(err);
            socket.emit("error", { msg: err });
          }

          let questionId = currentQuestion?._id;
          questionId = questionId?.toString();

          let results = game.answers
            .filter((answer) => answer.questionId == questionId)
            .sort((a, b) => b.votes.length - a.votes.length);
          //*BULKWRITE LETS YOU UPDATE MULTIPLE VALUES IN ONE GO. MAP EVERYTHING YOU WANT TO WRITE, ASSIGN TO A VARIALE AND PASS IT INTO BULKWRITE.
          let bulkData = results.map((result) => {
            const uuid = result.playerUUID;
            const score = result.votes.length;
            return {
              updateOne: {
                filter: {
                  active: true,
                  gameId: gameId,
                  players: {
                    $elemMatch: {
                      uuid: uuid,
                    },
                  },
                },
                update: {
                  $inc: {
                    "players.$.score": score,
                  },
                },
              },
            };
          });

          try {
            const writtenBulk = await Game.bulkWrite(bulkData);
            ////console.log(writtenBulk);
          } catch (err) {
            console.error(err);
            socket.emit("error", { msg: err });
          }
          shami.to(gameId).emit("subroundResultsServed", { results: results });

          const resultsWithVotes = results.filter(
            (result) => result.votes.length > 0
          );
          const animationTime = resultsWithVotes.length * 3000;
          return animationTime;
        };

        const serveRoundResults = async () => {
          //*current round is incremented by 1 here
          let game;
          try {
            game = await Game.findOneAndUpdate(
              {
                gameId: gameId,
                active: true,
              },
              {
                $inc: { "gameStatus.currentRound": 1 },
              },
              { new: true }
            ).lean();
            if (!game) {
              // handle the case where the document was not found
              console.error("Game not found");
              socket.emit("error", { msg: "Game not found" });
              return;
            }
          } catch (err) {
            console.error(err);
            socket.emit("error", { msg: err });
          }

          //results are attached to players
          let results = game.players;
          results = results.sort((a, b) => b.score - a.score);

          shami.to(gameId).emit("roundResultsServed", { results: results });
          shami.to(gameId).emit("roundEnded", {});
        };

        const serveRound = async () => {
          while (true) {
            //!-- Question --
            if (phase == "notStarted") {
              //*FIRST QUESTION
              phase = "question";
              currentQuestion = await serveQuestion();
              ////console.log(`${phase} ${subround}, served immediately.`);
            } else if (phase == "subroundResults") {
              //*SUBSEQUENT QUESTIONS
              phase = "question";
              currentQuestion = await serveQuestion();
              ////console.log(`${phase} ${subround}, served after animation.`);
            }
            if (phase == "question") await gameTimer();

            //!-- Voting --
            if (phase == "question") {
              phase = "voting";
              serveVotes(currentQuestion);
              ////console.log(`Phase: ${phase} ${subround}`);
            }
            if (phase == "voting") await gameTimer();

            //!-- Results --
            if (phase == "voting") {
              phase = "subroundResults";
              ////console.log(`Phase: ${phase} ${subround}`);
              const animationTime = await serveSubroundResults(currentQuestion);
              ////console.log("this is the animation time: ", animationTime);
              //reset gameStatus arrays
              resetPlayerArrays();
              await gameTimer(animationTime);
              subround++;
            }

            //!-- End of Round --
            if (subround == 4 && phase == "subroundResults") {
              phase = "roundResults";
              ////console.log(`Phase: ${phase}. End of round.`);
              serveRoundResults();
              resetPlayerArrays();
              break;
            }
          }
        };

        //!-- CONTROLLER "GO" EVENTS --
        socket.on("pausingGame", async (arg) => {
          pause();
          socket.to(gameId).emit("gamePaused", {});
        });
        socket.on("resumingGame", async (arg) => {
          resume();
          socket.to(gameId).emit("gameResumed", {});
        });
        socket.on("skippingTimer", async (arg) => {
          skip();
          socket.to(gameId).emit("timerSkipped", {});
        });
        serveRound();
      });
      socket.on("gameEnding", async (arg) => {
        //todo: Guard current round == max rounds?
        socket.to(gameId).emit("gameEnded", {});
        //set game to inactive, remove gameStatus
        try {
          const game = await Game.findOneAndUpdate(
            {
              gameId: gameId,
              active: true,
            },
            {
              $set: { gameStatus: {}, active: false },
            }
          );
          if (!game) {
            // handle the case where the document was not found
            console.error("Game not found");
            socket.emit("error", { msg: "Game not found" });
            return;
          }
          shami.in(gameId).disconnectSockets();
        } catch (err) {
          console.error(err);
          socket.emit("error", { msg: err });
        }
      });
    }

    //!---------------DISCCONECT------------------
    socket.on("disconnect", async (arg) => {
      if (uuid != "controller") {
        const playerStatus = await Game.findOneAndUpdate(
          { active: true, gameId: gameId },
          {
            $pull: {
              "gameStatus.joinedPlayers": {
                uuid: uuid,
                displayName: displayName,
              },
              "gameStatus.readyPlayers": {
                uuid: uuid,
                displayName: displayName,
              },
            },
          },
          { new: true }
        ).lean();
        //*GUARD AGAINST EMPTY GAME
        if (playerStatus != null) {
          if (playerStatus.gameStatus.joinedPlayers.length === 0) {
            console.log("everyone has disconnected!");
            shami
              .to(gameId)
              .emit("gameEnding", { msg: "all players have left the game" });
          }
        } else {
          console.log("Game has already ended!");
        }

        shami.to(gameId).emit("disconnected", {
          playerStatus: playerStatus,
        });
      }
    });
  });

  return io;
};
