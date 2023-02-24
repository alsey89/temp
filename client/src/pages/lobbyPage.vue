<template>
  <!-- Game Screen -->
  <div class="game-screen q-mb-auto flex column">
    <!-- Current user -->
    <q-list class="rounded-borders column relative-position q-my-auto">
      <template v-if="gameStore.state.playerList.length !== 0">
        <div
          class="inner-list-wrapper full-width"
          style="
            border-width: 2px;
            border-style: solid none;
            border-color: #9e9e9e;
          "
        >
          <div
            class="item-wrapper"
            v-for="playerHolder in playerHolderList"
            :key="playerHolder"
            style="
              border-width: 2px;
              border-style: solid none;
              border-color: #9e9e9e;
            "
          >
            <q-item
              class="player-placeholder text-center text-weight-bold text-subtitle1 text-grey-2"
              style="color: #d8d8d9; height: 60px"
            >
              <q-item-section style="border: 2px dashed #f5f5f5" class="q-py-sm"
                >等待玩家加入</q-item-section
              >
            </q-item>
          </div>
        </div>
        <div
          class="inner-list-wrapper full-width"
          style="
            border-width: 2px;
            border-style: solid none;
            border-color: #9e9e9e;
          "
        >
          <BounceInTransitonGroup>
            <div
              class="item-wrapper"
              v-for="(player, index) in gameStore.state.playerList"
              :key="player.uuid"
              style="
                border-width: 2px;
                border-style: solid none;
                border-color: #9e9e9e;
              "
            >
              <q-item
                :key="player.uuid"
                class="col player text-weight-bold text-subtitle1"
                style="background-color: #d9d9d9; height: 60px"
              >
                <!-- headshot -->
                <q-item-section avatar>
                  <q-avatar color="grey-6" text-color="white" size="md">
                    {{ player.displayName[0].toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <!-- display name -->
                <q-item-section>
                  <q-item-label
                    class="player__name text-h6 text-weight-regular"
                  >
                    {{ player.displayName }}
                  </q-item-label>
                </q-item-section>
                <!-- Readiness -->
                <q-item-section>
                  <!-- Check whether the player is the host -->
                  <div
                    v-if="index === 0"
                    class="q-ml-auto player__status player__status--host"
                  ></div>
                  <!-- Check whether the player is ready -->
                  <ToggleReadyTransition
                    appear
                    mode="out-in"
                    v-else
                    :name="
                      gameStore.state.readyPlayerList.includes(player.uuid)
                        ? 'stamp-ready'
                        : 'stamp-preparing'
                    "
                  >
                    <div
                      v-if="
                        gameStore.state.readyPlayerList.includes(player.uuid)
                      "
                      class="q-ml-auto player__status player__status--ready"
                    >
                      Ready
                    </div>
                    <div
                      v-else
                      class="q-ml-auto player__status player__status--preparing"
                    >
                      Preparing...
                    </div>
                  </ToggleReadyTransition>
                </q-item-section>
              </q-item>
            </div>
          </BounceInTransitonGroup>
        </div>
      </template>
    </q-list>
  </div>
  <!-- Bottom Toolbar -->
  <div
    class="bottom-tool-bar flex justify-between items-center"
    style="margin-top: 100px"
  >
    <!-- Invite button -->
    <div class="wrapper row justify-start items-center" style="flex: 0 1 33.3%">
      <div
        class="invite q-px-xs-sm q-px-sm-md q-py-xs cursor-pointer q-gutter-x-xs items-center flex"
        style="border: 2px solid #bdbdbd; border-radius: 8px"
        @click="toggleInvitation"
      >
        <q-icon name="person_add" size="2rem" />
        <span class="text-h6">邀請</span>
      </div>
    </div>
    <!-- Start/Ready button -->
    <div class="wrapper row justify-center" style="flex: 0 1 33.3%">
      <div
        v-if="isHost"
        class="start-button flex flex-center text-weight-bold text-h5 text-white"
        :class="[
          {
            'animated bounce infinite slower':
              isRoomFullAndReady && !isGameStarting,
          },
          !isGameStarting && isAllPlayersReady
            ? 'cursor-pointer'
            : 'start-button--active disable',
        ]"
        @click="!isGameStarting && startGame()"
      >
        Start
      </div>
      <div
        v-else
        class="ready-button flex flex-center text-weight-bold text-h5 text-white"
        :class="[
          gameStore.isCurrentPlayerReady
            ? 'ready-button--active'
            : 'animated pulse infinite slower',
          !isGameStarting ? 'cursor-pointer' : 'disable',
        ]"
        @click="!isGameStarting && gameStore.toggleStatus()"
      >
        Ready
      </div>
    </div>
    <!-- Current player count -->
    <div class="wrapper row justify-end items-center" style="flex: 0 1 33.3%">
      <div class="flex items-center q-px-xs-sm q-px-sm-md q-gutter-x-xs">
        <q-icon name="group" size="2rem" />
        <span class="playercount text-h5">
          {{
            `${gameStore.state.playerList.length}/${gameStore.state.gameSettings.numberOfPlayers}`
          }}
        </span>
      </div>
    </div>
  </div>
  <!-- Invitation modal -->
  <q-dialog
    v-model="isInvitationOpen"
    ref="invitationRef"
    id="invitation"
    maximized
  >
    <q-card
      class="invitation-wrapper q-pa-md flex column"
      style="background-color: rgba(51, 49, 49, 0.95); height: 500px"
    >
      <q-card-section class="q-ma-none q-pa-none">
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          style="color: #fff"
        />
      </q-card-section>
      <q-card-section style="flex: 1" class="flex flex-center">
        <div class="QRCode-wrapper">
          <!-- QR code image -->
          <div
            ref="QRCodeRef"
            class="flex flex-center q-mx-auto q-mb-md QRCode-wrapper"
          ></div>
          <!-- QR code tools(copy and share) -->
          <div
            class="QRCode-tools flex items-center q-mx-auto text-white QRCode-wrapper"
            :class="
              $q.platform.is.desktop ? 'justify-center' : 'justify-between'
            "
          >
            <div
              class="QRCode-copy flex items-center cursor-pointer"
              @click="copyQRCode"
            >
              <span class="q-mr-xs text-h6">複製</span>
              <q-icon name="content_copy" size="1.6rem" />
            </div>
            <div
              v-if="!$q.platform.is.desktop"
              class="vertical"
              style="border-left: 1px solid white; height: 26px"
            ></div>
            <div
              class="QRCode-share flex items-center cursor-pointer"
              @click="shareQRCode"
              v-if="!$q.platform.is.desktop"
            >
              <span class="text-h6">分享</span>
              <q-icon name="arrow_outward" size="2rem" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BounceInTransitonGroup from "src/animations/BounceInTransitionGroup.vue";
import ToggleReadyTransition from "src/animations/ToggleReadyTransition.vue";
import QRCodeStyling from "qr-code-styling";
import {
  shallowRef,
  onMounted,
  ref,
  nextTick,
  watchEffect,
  computed,
} from "vue";
import { useGameStore } from "src/stores/game";
import { showSuccessMessage } from "src/utilities/helpers";
const gameStore = useGameStore();
// Player List Control
const playerHolderList = Array.from(
  { length: gameStore.state.gameSettings.numberOfPlayers },
  (_, i) => i + 1
);
const currentPlayerUUID = gameStore.state.currentPlayer.uuid;
const isHost = gameStore.state.gameSettings.hostUUID === currentPlayerUUID;
const isGameStarting = computed(() => gameStore.state.timeLeft !== null);
// const isAllPlayersReady = computed(
//   () =>
//     gameStore.state.gameSettings.numberOfPlayers ===
//     gameStore.state.readyPlayerList.length
// );
// const isAllPlayersReady = computed(()=>gameStore.state.playerList.every(({ uuid }) =>
//     gameStore.state.readyPlayerList.includes(uuid)
//   ));
const isAllPlayersReady = computed(
  () =>
    gameStore.state.playerList.length > 1 &&
    gameStore.state.readyPlayerList.length === gameStore.state.playerList.length
);
const isRoomFullAndReady = computed(
  () =>
    isAllPlayersReady.value &&
    gameStore.state.readyPlayerList.length ===
      gameStore.state.gameSettings.numberOfPlayers.length
);
// QR Code
const preLobbyURL = `${window.location.origin}/join?code=${gameStore.state.gameSettings.gameCode}`;
const QRCodeRef = ref(null);
const QRCode = new QRCodeStyling({
  width: 500,
  height: 500,
  type: "canvas",
  image: require("../assets/giggle.png"),
  data: preLobbyURL,
  dotsOptions: {
    color: "#000000",
    type: "square",
  },
  cornersSquareOptions: {
    color: "#000000",
    type: "square",
  },
  cornersDotOptions: {
    color: "#000000",
    type: "square",
  },
  imageOptions: {
    imageSize: 0.5,
  },
});
watchEffect(
  () => {
    if (gameStore.state.countdown === 0) {
      alert("game is about to begin");
    }
  },
  { flush: "post" }
);
const copyQRCode = () => {
  navigator.clipboard.writeText(preLobbyURL).then(() => {
    showSuccessMessage("複製成功！");
    isInvitationOpen.value = !isInvitationOpen.value;
  });
};
const shareQRCode = async () => {
  if (navigator.share) {
    try {
      await navigator.share({ name: "lala" });
    } catch (err) {
      console.log(err);
    }
  }
};
// Invitation
const isInvitationOpen = shallowRef(false);
const invitationRef = ref(null);
const toggleInvitation = async () => {
  isInvitationOpen.value = !isInvitationOpen.value;
  await nextTick();
  QRCode.append(QRCodeRef.value);
};
onMounted(() => {
  // Inject the QR Code Image onto DOM reference
  QRCode.append(QRCodeRef.value);
  gameStore.enterLobby();
});

const startGame = () => {
  // check all players are ready
  // const isAllPlayersReady = gameStore.state.playerList.every(({ uuid }) =>
  //   gameStore.state.readyPlayerList.includes(uuid)
  // );
  if (!isAllPlayersReady.value) return;
  gameStore.startGame();
};
</script>

<style lang="scss" scoped>
.game-screen {
  background-color: #424242;
  //   background-color: #d9d9d9;
  // auto is not supported in the clamp function
  //height: clamp(350px,auto,700px)
  // minimum height
  min-height: 350px;
  // decided by the inner elements
  height: auto;
  // expandable all the way to 700px
  max-height: 700px;
  // scrollbar appears when the height exceeds 700px
  overflow-y: auto;
  overflow-x: hidden;
}
.invitation-wrapper {
  width: clamp(320px, 100vw, 512px);
  margin: 0 auto;
  padding: 0 20px;
}

.ready-button,
.start-button {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #e0e0e0, 0 5px 10px 3px rgba(0, 0, 0, 0.2);
  background-color: #e0e0e0;
  transform: translateY(-3px);
  user-select: none;
}

.ready-button--active,
.start-button--active {
  box-shadow: 0 0 0 3px #e0e0e0;
  transform: translateY(-1px);
}
.player__status {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}
.player__status--host {
  color: #0a9928;
  border: 3px solid #0a9928;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
}
.player__status--host::before {
  content: "Host";
}
.player__status--preparing {
  color: #555;
  transform: rotate(0);
}
.player__status--ready {
  color: #d23;
  border: 3px solid #d23;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
  transform: rotate(-8deg);
}
.disable {
  cursor: not-allowed;
  opacity: 0.7;
}
.QRCode-wrapper {
  width: clamp(150px, 100%, 350px);
}
.QRCode-wrapper > :deep(canvas) {
  height: 100% !important;
  width: 100% !important;
}
.q-list .inner-list-wrapper:first-child {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
}
.q-list .inner-list-wrapper:last-child {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>
