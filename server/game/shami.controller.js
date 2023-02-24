const io = require("socket.io-client");

//*This "controller" serves to control the flow of the game and emit questions and voting candidates to all othe clients.
//TODO: replace the entire "controller logic with a state machine".
const controller = (gameId) => {
  const socket = io.connect("ws://localhost:3000/shami", {
    query: { displayName: "controller", uuid: "controller", gameId: gameId },
  });

  // //server listening "connection" ->
  // socket.on("connected", (arg) => {
  //   console.log(arg);
  // });
  // //server listening "disconnect" ->
  // socket.on("disconnected", (arg) => {
  //   console.log(arg);
  // });
  // //server listening "readyCheck" ->
  // socket.on("readyPlayers", (arg) => {
  //   console.log(arg);
  // });
  // //server listening "startGame" ->
  // socket.on("gameStarted", (arg) => {
  //   console.log(arg);
  // });
  // //controller function "serveQuestion" ->
  // socket.on("questionServed", (arg) => {
  //   console.log(arg);
  // });
  // //server listening "submitAnswer" ->
  // socket.on("answerSubmitted", (arg) => {
  //   console.log(arg);
  // });
  // //controller function "serveVotes" ->
  // socket.on("votesServed", (arg) => {
  //   console.log(arg);
  // });
  // //server listening "submitVote" ->
  // socket.on("voteSubmitted", (arg) => {
  //   console.log(arg);
  // });
  // //controller function "serveSubroundResults" ->
  // socket.on("subroundResultsServed", (arg) => {
  //   console.log(arg);
  // });
  // //controller function "serveRoundResults" ->
  // socket.on("roundResultsServed", (arg) => {
  //   console.log(arg);
  // });
  // //host throws error ->
  // socket.on("error", (arg) => {
  //   console.log(arg);
  // });

  // socket.on("gamePaused", (arg) => {
  //   console.log(arg);
  // });
  // socket.on("gameResumed", (arg) => {
  //   console.log(arg);
  // });
  // socket.on("timerSkipped", (arg) => {
  //   console.log(arg);
  // });

  // socket.on("gameEnded", (arg) => {
  //   console.log(arg);
  // });

  socket.on("disconnect", () => {
    console.log("Controller disconnected from server");
  });

  //!events that ping-pong to the server

  //*controller listening "set",
  //*fires "go" from the last player to fill the list ->
  socket.on("go", (arg) => {
    socket.emit("go", {});
  });

  //*controller listening "endGame",
  //*fires "gameEnding" from the last player to fill the list ->
  socket.on("gameEnding", (arg) => {
    console.log("received gameEnding...");
    socket.emit("gameEnding", {});
  });

  //server listening "pauseGame" ->
  socket.on("pausingGame", (arg) => {
    socket.emit("pausingGame", {});
  });

  //server listening "resumeGame" ->
  socket.on("resumingGame", (arg) => {
    socket.emit("resumingGame", {});
  });
  //server listening "skipTimer" ->
  socket.on("skippingTimer", (arg) => {
    socket.emit("skippingTimer", {});
  });
};

module.exports = { controller };
