<template>
  <div class="wrapper flex column no-wrap q-px-md fullscreen">
    <Transition
      appear
      enter-active-class="animated bounceIn"
      leave-active-class="animated bounceOut"
      mode="out-in"
    >
      <div v-if="phase === 'roundStart'" class="fullscreen flex flex-center">
        <span class="text-h1">Round {{ currentRound }}</span>
      </div>
      <ScoreBoardComponent
        v-else-if="phase === 'roundEnd'"
        :playersScoresList="playersScoresList"
        :isWaiting="isWaiting"
        @startNextRound="submit"
      />
      <SocialShareComponent
        v-else-if="phase === 'gameEnd'"
        :playersScoresList="playersScoresList"
        @gameEnd="submit"
      />
      <div v-else class="game-layout full-height flex column no-wrap">
        <div class="top-tool-bar flex justify-between q-mt-xl q-mb-lg">
          <q-icon
            name="help_outline"
            size="2rem"
            class="cursor-pointer"
            @click="isInstructionOpen = !isInstructionOpen"
          />
          <div class="counter">
            {{ currentRound }} / {{ gameStore.state.gameSettings.rounds }}
          </div>
          <q-icon
            class="cursor-pointer"
            name="settings"
            size="2rem"
            @click="isSettingOpen = !isSettingOpen"
          />
        </div>
        <!-- Game screen -->
        <div class="progress-bar q-mb-sm">
          <q-linear-progress
            size="24px"
            style="border-radius: 10px"
            color="white"
            :value="progress"
            animation-speed="2100"
            :instant-feedback="timeLeft === SECONDS_PER_ROUND ? true : false"
          >
            <div
              class="text-center absolute-full flex flex-center text-caption"
              style="color: #333333"
            >
              Ends in {{ timeLeft }}s
            </div>
          </q-linear-progress>
        </div>
        <!-- Question window -->
        <div
          class="question-window q-pa-md q-mb-md"
          style="background-color: #f2f2f2; border-radius: 8px"
        >
          <!-- question icon -->
          <div class="q-mb-xs">
            <span
              class="text-weight-bold text-h6 flex flex-center"
              style="
                background-color: #bdbdbd;
                border-radius: 4px;
                width: 40px;
                height: 40px;
              "
            >
              Q:
            </span>
          </div>
          <!-- Question -->
          <div class="h6">{{ currentQuestion.question }}</div>
        </div>
        <!-- Interaction zone -->
        <div
          class="interaction-zone q-mb-md col-grow"
          style="min-height: 150px"
        >
          <Transition
            :name="getAnimationName"
            appear
            mode="out-in"
            :duration="{ enter: 3000, leave: 550 }"
            :leave-active-class="prevAnimationName"
            @after-enter="onAfterEnter"
          >
            <!-- Collecting -->
            <div
              class="answer-collecting-zone flex column full-height"
              v-if="phase === 'collecting'"
            >
              <div class="players-status row q-col-gutter-xs q-mb-auto">
                <div
                  v-for="{ displayName, uuid } in gameStore.state.playerList"
                  :key="uuid"
                  class="col-xs-6 col-sm-4"
                >
                  <q-chip
                    class="full-width"
                    outline
                    :icon-right="
                      !answeredPlayers.find((player) => player.uuid === uuid)
                        ? 'sms'
                        : 'check_circle'
                    "
                    style="border-radius: 4px; border: 1px solid #bdbdbd"
                    :ripple="false"
                  >
                    <q-avatar
                      rounded
                      color="grey-6"
                      text-color="white"
                      size="sm"
                      class="q-mr-sm"
                    >
                      {{ displayName[0] }}
                    </q-avatar>
                    {{ displayName }}
                  </q-chip>
                </div>
              </div>
              <div class="answer-box text-center">
                <q-input
                  :filled="isWaiting"
                  :disable="isWaiting"
                  type="text"
                  v-model="answerToSubmit"
                  square
                  outlined
                  dense
                  label="請輸入您的答案"
                  label-color="grey-6"
                  hide-bottom-space
                />
              </div>
            </div>
            <!-- Voting -->
            <div
              class="voting-zone full-height flex column relative-position"
              v-else-if="phase === 'voting'"
            >
              <div
                class="q-mb-xs answer"
                v-for="({ answer, _id: answerId }, index) in currentAnswers"
                :key="answer"
                :style="{ '--order': index }"
              >
                <q-btn
                  :unelevated="isWaiting"
                  :disable="isWaiting"
                  class="full-width"
                  :label="answer"
                  rounded
                  dense
                  :ripple="false"
                  :color="answerToVote === answerId ? 'grey-8' : ''"
                  :text-color="answerToVote === answerId ? 'white' : 'grey-8'"
                  @click="answerToVote = answerId"
                />
              </div>
            </div>
            <!-- Revealing -->
            <div
              v-else-if="phase === 'revealing'"
              key="revealing"
              class="full-height overflow-hidden"
            >
              <TransitionGroup
                name="slide"
                appear
                @after-enter="handleAfterSlideInAndOut"
              >
                <div
                  v-for="(
                    { answer, votes, displayName }, index
                  ) in votedAnswers"
                  :key="answer"
                  class="q-mb-xs voted-answer full-height"
                  style="pointer-events: none"
                  :style="{
                    '--order': index,
                    '--total-player': 8,
                  }"
                >
                  <!-- voted answer and avatars -->
                  <div class="relative-position">
                    <q-btn
                      class="full-width"
                      :label="answer"
                      rounded
                      dense
                      :ripple="false"
                      text-color="grey-8"
                    />
                    <span class="voted-answer__avatar-wrapper">
                      <TransitionGroup name="avatar" appear>
                        <q-avatar
                          v-for="({ displayName, uuid }, i) in votes"
                          :key="uuid"
                          round
                          color="grey-6"
                          text-color="white"
                          size="sm"
                          class="q-mr-sm"
                          :style="{
                            '--order': i,
                            '--parent-order': index,
                            '--total-player': 8,
                          }"
                        >
                          {{ displayName[0] }}
                        </q-avatar>
                      </TransitionGroup>
                    </span>
                  </div>
                  <!-- socre -->
                  <div class="relative-position full-height">
                    <Transition
                      appear
                      name="float-up"
                      @after-enter="(e) => e.remove()"
                    >
                      <div
                        class="voted-answer__score text-subtitle1 flex flex-center"
                        style="color: #333333"
                        :style="{
                          '--parent-order': index,
                          '--total-player': 8,
                        }"
                      >
                        <q-avatar
                          round
                          color="grey-6"
                          text-color="white"
                          size="sm"
                          class="q-mr-xs"
                        >
                          {{ displayName[0] }}
                        </q-avatar>
                        <span class="q-mr-xs">{{ displayName }}</span>
                        +{{ votes.length * 100 }}
                      </div>
                    </Transition>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </Transition>
        </div>
        <!-- Bottom Button -->
        <div class="q-mt-auto q-mb-md">
          <q-btn
            :loading="isWaiting"
            :unelevated="isWaiting"
            :disable="isWaiting"
            rounded
            text-color="grey-8"
            color="grey-4"
            class="full-width"
            @click.prevent="submit"
          >
            送出
            <template v-slot:loading>
              <q-spinner-clock class="on-left" />
              {{ waitingMessageSelector(phase) }}
            </template>
          </q-btn>
        </div>
      </div>
    </Transition>
    <!-- Setting modal -->
    <q-dialog v-model="isSettingOpen">
      <div class="game-setting-wrapper q-pa-md" style="background: white">
        <gameSettingComponent
          role="updater"
          v-bind="gameStore.state.gameSettings"
        />
      </div>
    </q-dialog>
    <!-- Instruction modal  -->
    <q-dialog v-model="isInstructionOpen">
      <q-card
        class="instruction-wrapper q-pa-md flex column"
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
        <q-card-section style="color: #fff">
          <div class="text-h6 q-mb-md">如何開始遊戲?</div>
          <div class="text-subtitle2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
            accusantium in quis ullam praesentium velit modi eos fuga veritatis
            atque cupiditate maxime facilis, placeat, assumenda impedit, quidem
            iste sit earum!
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import gameSettingPage from "src/pages/gameSettingPage.vue";
import ScoreBoard from "src/components/ScoreBoard.vue";
import SocialShare from "src/components/SocialShare.vue";
import { showWarningMessage } from "src/utilities/helpers";
export default {
  components: {
    gameSettingComponent: gameSettingPage,
    ScoreBoardComponent: ScoreBoard,
    SocialShareComponent: SocialShare,
  },
};
</script>
<script setup>
import { setAsyncTimeout, CountdownTimer } from "src/utilities/helpers";
import { useGameStore } from "src/stores/game";
import {
  shallowRef,
  defineProps,
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
} from "vue";
import { useRouter } from "vue-router";
// =========================== ROUTER ===========================
const router = useRouter();
// =========================== PROPS ===========================
const props = defineProps({
  role: {
    type: String,
    validator: (propValue) => {
      return ["lobby", "game"].includes(propValue);
    },
  },
});
// =========================== STORES ===========================
const gameStore = useGameStore();
// =========================== CONSTANT VARIABLES ===========================
const SECONDS_PER_ROUND = 60;
// =========================== DATA ===========================
// General
const isSettingOpen = shallowRef(false);
const isInstructionOpen = shallowRef(false);
const isWaiting = ref(false);
const timeLeft = ref(SECONDS_PER_ROUND);
const phase = ref("roundStart");
const prevAnimationName = ref("roundStart");
const currentRound = ref(1);
const currentQuestion = ref({ question: null, questionId: null });
// "collecting" phase
const answerToSubmit = ref("");
const answeredPlayers = ref([]);
// "voting" phase
const currentAnswers = ref([]);
const answerToVote = ref(null);
// "revealing" phase
const votedAnswers = ref([]);
// "roundEnd" phase
const playersScoresList = ref([]);
// =========================== HELPERS ===========================
const countdown = new CountdownTimer(
  () => {
    timeLeft.value--;
  },
  () => {
    console.log("time is up");
    timeLeft.value = SECONDS_PER_ROUND;
  },
  1000
);
const restartTimer = () => {
  countdown.stop();
  timeLeft.value = SECONDS_PER_ROUND;
  countdown.start(Date.now() + SECONDS_PER_ROUND * 1000);
};
const animationSelector = (gamePhase) => {
  switch (gamePhase) {
    case "voting":
      return "stagger";
    case "revealing":
      return "reveal";
    default:
      return null;
  }
};
const waitingMessageSelector = (gamePhase) => {
  switch (gamePhase) {
    case "revealing":
      return "請稍等";
    default:
      return "請等候其他玩家...";
  }
};
// =========================== GETTER ===========================
const progress = computed(() => timeLeft.value / SECONDS_PER_ROUND);
const getAnimationName = computed(() => {
  return animationSelector(phase.value);
});
const isHost =
  gameStore.state.gameSettings.hostUUID === gameStore.state.currentPlayer.uuid;
const hasGameEnded = computed(
  () => currentRound.value === gameStore.state.gameSettings.rounds
);
// =========================== METHODS ===========================
const phaseHandlers = {
  collecting: async () => {
    const isAnswerValid = !!answerToSubmit.value.trim();
    if (!isAnswerValid) return showWarningMessage("答案不可以為空白");
    console.log("question object passed to backend", {
      displayName: gameStore.state.currentPlayer.displayName,
      uuid: gameStore.state.currentPlayer.uuid,
      answer: answerToSubmit.value,
      questionId: currentQuestion.value.questionId,
      round: currentRound.value,
    });
    gameStore.state.socket.emit("submitAnswer", {
      displayName: gameStore.state.currentPlayer.displayName,
      uuid: gameStore.state.currentPlayer.uuid,
      answer: answerToSubmit.value,
      questionId: currentQuestion.value.questionId,
      round: currentRound.value,
    });
    isWaiting.value = true;
    // answerToSubmit.value = "";
  },
  voting: () => {
    const isVoteValid = !!answerToVote.value;
    if (!isVoteValid) return showWarningMessage("請選擇答案");
    console.log("cast the vote", {
      displayName: gameStore.state.currentPlayer.displayName,
      uuid: gameStore.state.currentPlayer.uuid,
      answerId: answerToVote.value,
    });
    gameStore.state.socket.emit("submitVote", {
      displayName: gameStore.state.currentPlayer.displayName,
      uuid: gameStore.state.currentPlayer.uuid,
      answerId: answerToVote.value,
    });
    isWaiting.value = true;
  },
  roundEnd: () => {
    if (hasGameEnded.value) {
      // gameEnd
      phase.value = "gameEnd";
    } else {
      // new roundStart
      phase.value = "roundStart";
      isWaiting.value = true;
      currentRound.value = currentRound.value + 1;
    }
  },
  gameEnd: () => {
    // gameStore.endGame();
    if (isHost) {
      router.push(`games/${gameStore.state.gameSettings.gameMode}/settings`);
    } else {
      router.push(`/join`);
    }
  },
};
const submit = () => {
  phaseHandlers[phase.value]();
};
const kickStart = () => {
  // General
  gameStore.state.socket.on("timerSkipped", (data) => {
    console.log("timer Skipped");
    countdown.stop();
    timeLeft.value = SECONDS_PER_ROUND;
  });
  gameStore.state.socket.on("error", (error) => {
    console.log("error", error);
  });
  // (1.) "collecting" phase
  gameStore.state.socket.on("questionServed", (data) => {
    console.log("questionServed", data);
    const { question, _id } = data.question;
    currentQuestion.value = { question, questionId: _id };
    phase.value = "collecting";
    isWaiting.value = false;
    restartTimer();
    // countdown.start(Date.now() + SECONDS_PER_ROUND * 1000);
  });
  gameStore.state.socket.on("answerSubmitted", (data) => {
    console.log("answer submitted", data);
    answeredPlayers.value = data.gameStatus.answeredPlayers;
  });
  // (2.) "voting" phase
  gameStore.state.socket.on("votesServed", ({ candidates }) => {
    console.log("votesServed", candidates);
    phase.value = "voting";
    isWaiting.value = false;
    currentAnswers.value = candidates;
    // timeLeft.value = SECONDS_PER_ROUND;
    // countdown.start(Date.now() + SECONDS_PER_ROUND * 1000);
    restartTimer();
  });
  gameStore.state.socket.on("voteSubmitted", (data) => {
    console.log("voteSubmitted", data);
  });
  // (3.) "revealing" phase
  gameStore.state.socket.on("subroundResultsServed", ({ results }) => {
    console.log("subroundResultsServed", results);
    console.log("timeLeft", timeLeft.value);
    phase.value = "revealing";
    votedAnswers.value = results;
    // reset state fields
    answerToSubmit.value = "";
    answeredPlayers.value = [];
    currentAnswers.value = [];
    answerToVote.value = null;
    // timeLeft.value = SECONDS_PER_ROUND;
  });
  // (4.) "roundEnd" phase
  gameStore.state.socket.on("roundResultsServed", ({ results }) => {
    console.log("roundResultsServed", results);
    phase.value = "roundEnd";
    isWaiting.value = false;
    // timeLeft.value = SECONDS_PER_ROUND;
    playersScoresList.value = results;
    if (hasGameEnded.value) return gameStore.state.socket.emit("endGame");
  });
};
// =========================== JAVASCRIPT HOOKS FOR ANIMATIONS ===========================
const handleAfterSlideInAndOut = (e) => {
  const indexNumber = Number(e.style.getPropertyValue("--order"));
  if (indexNumber === votedAnswers.value.length - 1) {
    // When the last element finishes animation
    console.log("the last element completes animation");
  }
  e.remove();
};
const onAfterEnter = (e) => {
  if (phase.value === "voting") {
    const listItems = e.querySelectorAll(".answer");
    Array.from(listItems).forEach((ele) => {
      const distanceFromTop = ele.offsetTop * -1 + "px";
      ele.style.setProperty("--move-y", distanceFromTop);
    });
  }
  if (phase.value === "revealing") {
  }
};
// =========================== LIFE CYCLE HOOKS ===========================
onMounted(() => {
  kickStart();
});
onUnmounted(() => {
  console.log("component unmounted");
  gameStore.endGame();
});
// =========================== WATCHERS(SIDE EFFECTS) ===========================
watch(
  phase,
  async (newValue, oldValue) => {
    if (newValue === "roundStart") {
      await setAsyncTimeout(1);
      gameStore.state.socket.emit("set");
      isWaiting.value = false;
    }
    const animationName = animationSelector(oldValue);
    if (!animationName) return;
    prevAnimationName.value = animationName + "-leave";
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wrapper,
.game-setting-wrapper,
.instruction-wrapper {
  width: clamp(320px, 100vw, 512px);
  margin: 0 auto;
  // padding: 0 20px;
}

// shami
.round-wrapper {
  width: clamp(320px, 100vw, 512px);
  margin: 0 auto;
}
.q-linear-progress :deep(.q-linear-progress__model) {
  margin: 3px;
  border-radius: 10px;
}
.question-window {
  min-height: 200px;
  // decided by the inner elements
  height: auto;
  // expandable all the way to 700px
  max-height: 350px;
  // scrollbar appears when the height exceeds 700px
  overflow-y: auto;
  overflow-x: hidden;
}
.voted-answer__avatar-wrapper {
  position: absolute;
  right: 0;
  bottom: -10px;
  z-index: 1;
}
.voted-answer__score {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  text-align: center;
}
// ANIMATION FOR "VOTING"
.stagger-enter-active .answer {
  opacity: 0;
  animation: stagger 0.5s ease calc(var(--order) * 0.2s) forwards;
}
.stagger-leave .answer {
  animation: collapse 0.5s linear forwards;
}
@keyframes stagger {
  from {
    opacity: 0;
    transform: translateX(-1em);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes collapse {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(var(--move-y));
  }
}

// ANIMATION FOR REVEALING
$slide-in-duration: 0.5s;
$slide-out-duration: 0.5s;
$avatar-in-duration: 0.1s;
$score-up-duration: 1s;
// $total-reveal-duration: $slide-in-duration + var(--total-player, 8) *
//   $avatar-in-duration + $score-up-duration + $slide-out-duration;
.slide-enter-active {
  opacity: 0;
  animation: slideIn $slide-in-duration ease
      calc(
        (
            #{$slide-in-duration} + var(--total-player, 8) * #{$avatar-in-duration} +
              #{$score-up-duration} + #{$slide-out-duration}
          ) * var(--order)
      )
      forwards,
    slideOut $slide-out-duration ease
      calc(
        (
            #{$slide-in-duration} + var(--total-player, 8) * #{$avatar-in-duration} +
              #{$score-up-duration} + #{$slide-out-duration}
          ) * var(--order) + #{$slide-in-duration} + var(--total-player, 8) * #{$avatar-in-duration} +
          #{$score-up-duration}
      );
}
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideOut {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
.avatar-enter-from {
  opacity: 0;
  transform: translateX(1em);
}
.avatar-enter-active {
  transition: all $avatar-in-duration ease;
  transition-delay: calc(
    (
        #{$slide-in-duration} + var(--total-player, 8) * #{$avatar-in-duration} +
          #{$score-up-duration} + #{$slide-out-duration}
      ) * var(--parent-order) + #{$slide-in-duration} + var(--order) * #{$avatar-in-duration}
  );
}
.float-up-enter-active {
  opacity: 0;
  animation-name: floatUp;
  animation-duration: $score-up-duration;
  animation-delay: calc(
    (
        #{$slide-in-duration} + var(--total-player, 8) * #{$avatar-in-duration} +
          #{$score-up-duration} + #{$slide-out-duration}
      ) * var(--parent-order) + #{$slide-in-duration} + var(--total-player, 8) *
      #{$avatar-in-duration}
  );
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
@keyframes floatUp {
  0% {
    opacity: 1;
    bottom: 0;
    top: 100%;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
    bottom: 100%;
    top: 0%;
  }
}
</style>
