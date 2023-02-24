import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { api } from "src/boot/axios";
import { io } from "socket.io-client";
import { CountdownTimer } from "src/utilities/helpers";
import { useUserStore } from "./user";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
const INITIAL_STATE = {
  gameSettings: null,
  currentPlayer: null,
  socket: null,
  playerList: [],
  readyPlayerList: [],
  timeLeft: null,
};
export const useGameStore = defineStore("game", () => {
  const router = useRouter();
  // STATE
  const state = reactive({
    ...INITIAL_STATE,
    countdown: new CountdownTimer(
      () => {
        state.timeLeft--;
      },
      () => {
        router.push(`/${state.gameSettings.gameMode}`);
      },
      1000
    ),
  });
  // const state = reactive({
  //   gameSettings: null,
  //   currentPlayer: null,
  //   socket: null,
  //   playerList: [],
  //   readyPlayerList: [],
  //   countdown: new CountdownTimer(
  //     () => {
  //       state.timeLeft--;
  //     },
  //     () => {
  //       router.push(`/${state.gameSettings.gameMode}`);
  //     },
  //     1000
  //   ),
  //   timeLeft: null,
  // });
  // GETTER
  const isCurrentPlayerReady = computed(() =>
    state.readyPlayerList.includes(state.currentPlayer?.uuid)
  );
  // PROTECTED METHODS
  const _serializeGamePlayer = (uuid) => {
    window.localStorage.setItem("uuid", uuid);
  };
  const _deserializeGamePlayer = () => {
    return window.localStorage.getItem("uuid");
  };
  const _loginGamePlayer = (displayName) => {
    const uuid = _deserializeGamePlayer();
    state.currentPlayer = { uuid, displayName };
  };
  const _logoutGamePlayer = () => {
    window.localStorage.removeItem("uuid");
  };
  // METHODS
  const createGame = async (form) => {
    // gameMode(String), numberOfPlayers(Number), numberOfRounds(Number), privateGame(Boolean), streamer(Boolean)

    // (1.) post request to server
    const response = await api.game.create(form);
    // (2.) extract the data out from response
    const {
      gameId,
      gameCode,
      gameMode,
      isPrivate,
      streamer,
      numberOfPlayers,
      rounds,
      hostUUID,
    } = response.data;
    // (3.) update the state
    state.gameSettings = {
      gameId,
      gameCode,
      gameMode,
      isPrivate,
      streamer,
      numberOfPlayers,
      rounds,
      hostUUID,
    };
    const userStore = useUserStore();
    _loginGamePlayer(userStore.state.user.displayName);
  };
  const joinGame = async (form) => {
    // { displayName, gameCode }
    // UUID from the equivalent of session on client side
    const uuidFromLocal = _deserializeGamePlayer();
    let uuid;
    if (uuidFromLocal) {
      uuid = uuidFromLocal;
    } else {
      uuid = uuidv4();
      // uuid = crypto.randomUUID();
      _serializeGamePlayer(uuid);
    }
    const response = await api.game.join({ ...form, uuid });
    console.log("join the game via post", response);
    const {
      gameId,
      gameCode,
      gameMode,
      isPrivate,
      streamer,
      numberOfPlayers,
      rounds,
      hostUUID,
    } = response.data.game;
    state.gameSettings = {
      gameId,
      gameCode,
      gameMode,
      isPrivate,
      streamer,
      numberOfPlayers,
      rounds,
      hostUUID,
    };
    _loginGamePlayer(form.displayName);
  };
  const endGame = () => {
    Object.assign(state, {
      ...INITIAL_STATE,
      countdown: new CountdownTimer(
        () => {
          state.timeLeft--;
        },
        () => {
          router.push(`/${state.gameSettings.gameMode}`);
        },
        1000
      ),
    });
  };
  const enterLobby = () => {
    state.socket = io("/shami", {
      // path: "/ws-game/socket.io",
      transports: ["websocket"],
      query: {
        uuid: state.currentPlayer.uuid,
        displayName: state.currentPlayer.displayName,
        gameId: state.gameSettings.gameId,
      },
    });
    state.socket.on("connected", ({ gameStatus }) => {
      const { joinedPlayers, readyPlayers } = gameStatus;
      state.playerList = joinedPlayers;
      state.readyPlayerList = readyPlayers.map((player) => player.uuid);
    });
    state.socket.on("readyPlayers", ({ gameStatus }) => {
      const { readyPlayers } = gameStatus;
      state.readyPlayerList = readyPlayers.map((player) => player.uuid);
    });
    state.socket.on("gameStarted", ({ timeZero }) => {
      state.timeLeft = 5;
      state.countdown.start(timeZero);
    });
  };
  const toggleStatus = () => {
    state.socket.emit("readyCheck", {
      uuid: state.currentPlayer.uuid,
      readyStatus: !isCurrentPlayerReady.value,
    });
  };
  const startGame = () => {
    state.socket.emit("startGame", true);
  };
  return {
    state,
    isCurrentPlayerReady,
    _serializeGamePlayer,
    _logoutGamePlayer,
    createGame,
    joinGame,
    enterLobby,
    toggleStatus,
    startGame,
    endGame,
  };
});

/*
***Game Logic***
for registered player(host)
(1.) createGame(state.gameSettings)
(2.) loginGamePlayer(save displayName, uuid in gameStore)
(3.) enterLobby()

for registered player(non-host)
(1.) joinGame(uuid, displayName, gameCode)
(2.) loginGamePlayer(save displayName, uuid in store)
(3.) enterLobby()

for guest player
(1.) joinGame(uuid, displayName, gameCode)
(2.) loginGamePlayer(save displayName, uuid in store)
(3.) enterLobby()

> Why loginGamePlayer() comes after createGame() and joinGame()?
The guest player is allowed to change the displayerName after a failure in joinGame()
So it will be more performant to loginGamePlayer() after they successfully join the game
*/
