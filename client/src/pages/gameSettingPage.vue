<template>
  <q-form @submit="props.role === 'initializer' ? startGame() : updateGame()">
    <!-- Game Mode -->
    <div class="mode q-mb-md">
      <div class="row q-col-gutter-sm">
        <div
          class="col-6 flex justify-center"
          v-for="({ name, value }, index) in modeOptions"
          :key="index"
        >
          <q-img
            ratio="1"
            src="~assets/promotion-01.jpg"
            class="cursor-pointer q-mb-sm"
            style="max-width: 300px"
          />
          <q-checkbox
            size="xs"
            dense
            v-model="formObj[value]"
            :label="name"
            :disable="
              (props.role === 'updater' && name === 'Streamer Mode') ||
              isProcessing
            "
          />
        </div>
      </div>
    </div>
    <!-- Number of Players -->
    <div class="players q-mb-md">
      <div class="text-h6 q-mb-sm">Number of Players</div>
      <div class="number-of-player flex justify-center items-center">
        <label
          v-for="(numberOfPlayers, index) in numberOfPlayersOptions"
          :key="index"
          class="square"
          :for="`player-square${numberOfPlayers}`"
        >
          <input
            :id="`player-square${numberOfPlayers}`"
            type="radio"
            name="numberOfPlayers"
            class="hidden"
            v-model="formObj.numberOfPlayers"
            :value="numberOfPlayers"
            :disabled="
              props.role === 'updater' || numberOfPlayers > 5 || isProcessing
            "
          />
          <div
            class="square__content flex flex-center"
            :class="[
              numberOfPlayers > 5 || props.role === 'updater'
                ? 'square__content--locked'
                : 'cursor-pointer',
            ]"
          >
            {{ numberOfPlayers }}
          </div>
        </label>
      </div>
    </div>
    <!-- Number of Rounds -->
    <div class="round q-mb-md">
      <div class="text-h6 q-mb-sm">Number of Rounds</div>
      <div class="number-of-round flex flex-center">
        <label
          v-for="(numberOfRounds, index) in numberOfRoundsOptions"
          :key="index"
          class="square"
          :for="`round-square${numberOfRounds}`"
        >
          <input
            :disabled="isProcessing"
            :id="`round-square${numberOfRounds}`"
            type="radio"
            name="numberOfRounds"
            class="hidden"
            v-model="formObj.numberOfRounds"
            :value="numberOfRounds"
          />
          <div class="square__content flex flex-center cursor-pointer">
            {{ numberOfRounds }}
          </div>
        </label>
      </div>
    </div>
    <!-- Start/Update button -->
    <div class="flex flex-center q-mb-md full-width">
      <q-btn
        :loading="isProcessing"
        type="submit"
        no-caps
        color="primary"
        rounded
        :label="props.role === 'initializer' ? 'Start Game' : 'Update Game'"
        style="width: 100%"
      />
    </div>
  </q-form>
</template>

<script setup>
import { reactive, ref, defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGameStore } from "src/stores/game";
// setup
const router = useRouter();
const numberOfPlayersOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const numberOfRoundsOptions = Array.from({ length: 6 }, (_, i) => i + 1);
const props = defineProps({
  role: {
    default: "initializer",
    type: String,
    validator: (propValue) => {
      return ["initializer", "updater"].includes(propValue);
    },
  },
  gameMode: String,
  streamer: Boolean,
  isPrivate: Boolean,
  numberOfPlayers: Number,
  rounds: Number,
});
const gameStore = useGameStore();
// state variables
const formObj =
  props.role === "initializer"
    ? reactive({
        gameMode: useRoute().params.gameMode,
        streamer: false,
        privateGame: true,
        numberOfPlayers: 3,
        numberOfRounds: 1,
      })
    : reactive({
        gameMode: props.gameMode,
        streamer: props.streamer,
        privateGame: props.isPrivate,
        numberOfPlayers: props.numberOfPlayers,
        numberOfRounds: props.rounds,
      });
const modeOptions = [
  { name: "Private Mode", value: "privateGame" },
  { name: "Streamer Mode", value: "streamer" },
];
const isProcessing = ref(false);
const startGame = async () => {
  // Before API call
  isProcessing.value = true;
  // Making API calls
  try {
    // console.log("formObj", formObj);
    await gameStore.createGame(formObj);
    router.push(`/lobby`);
  } catch (error) {
    console.log(error);
  }
  // After API calls
  isProcessing.value = false;
};
const updateGame = function () {
  // Before API call
  isProcessing.value = true;
  // Making API call
  console.log(formObj);
  // fetch back gameID
  // After API calls
  //   isProcessing.value = false;
};
</script>

<style lang="scss" scoped>
.mode {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.square {
  flex: 1 0 13.2%;
  position: relative;
  margin: 5px;
  border-radius: 4px;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.square:nth-child(1),
.square:nth-child(7) {
  margin-left: 0;
}
.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.square__content {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid #e0e0e0;
}
.square__content--locked {
  background-color: #e0e0e0;
  border: 0;
}
.square__content--locked::before {
  position: absolute;
  display: inline-block;
  line-height: 10px;
  top: 1px;
  right: 1px;
  content: url("~assets/icons/padlock.svg");
}
.square > input[type="radio"]:checked + .square__content {
  background-color: #4f4f4f;
  color: white;
}
</style>
