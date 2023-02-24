<template>
  <div class="full-height flex column">
    <div class="final-score text-center" style="margin-top: 30%">
      您最後的分數是 {{ playerScore * 100 }} 分
    </div>
    <div class="ranking q-mb-xl text-center">
      在與你朋友的競賽中排 {{ playerRank }} /
      {{ props.playersScoresList.length }}
    </div>
    <div class="best-play q-px-md q-py-lg q-mb-xl">
      <div class="best-play__title q-pa-sm">Your best play</div>
      <div class="best-play__qustion flex items-center q-mb-sm">
        <q-avatar
          rounded
          size="md"
          style="background-color: #bdbdbd; color: #333333"
          class="q-mr-xs"
          >Q:
        </q-avatar>
        Reporter: Regarding the invastion of ukraine... Putin: ________
      </div>
      <div class="best-play__answer flex items-center">
        <q-avatar
          rounded
          size="md"
          style="background-color: #bdbdbd; color: #333333"
          class="q-mr-xs"
          >A: </q-avatar
        >Uh uh... It’s Mykraine
      </div>
    </div>
    <div class="share">
      <!-- Line break -->
      <div class="continue text-subtitle2 q-mb-md">分享至社交媒體</div>
      <!-- Icons -->
      <div class="icon-wrapper flex justify-center">
        <q-icon
          :name="icon"
          size="md"
          class="q-mx-sm cursor-pointer"
          style="color: #747980"
          v-for="{ name, icon } in socialMediaShare"
          :key="name"
          @click="shareResult"
        />
      </div>
    </div>
    <div class="q-mt-auto q-mb-lg">
      <q-btn
        rounded
        label="確認"
        class="full-width"
        style="background-color: #e0e0e0; color: #333333"
        @click.prevent="handleConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { useGameStore } from "src/stores/game";
// Props
const props = defineProps({
  playersScoresList: {
    type: Array,
    required: true,
  },
});
// Emits
const emit = defineEmits(["gameEnd"]);
// Game store
const gameStore = useGameStore();
// Getter
const playerScore = computed(
  () =>
    props.playersScoresList.find(
      (player) => player.uuid === gameStore.state.currentPlayer.uuid
    ).score
);
console.log("getter playerScore", playerScore.value);
const playerRank = computed(
  () =>
    props.playersScoresList.findIndex(
      (player) => player.uuid === gameStore.state.currentPlayer.uuid
    ) + 1
);
// Handler
const handleConfirm = () => {
  emit("gameEnd");
};
const socialMediaShare = [
  { name: "facebook", icon: "fa-brands fa-square-facebook" },
  { name: "instagram", icon: "fa-brands fa-instagram" },
  { name: "twitter", icon: "fa-brands fa-twitter" },
];
const shareResult = () => {
  const msg = `Q: 你最喜歡什麼？\nA: sdada`;
  window.open(
    `http://twitter.com/share?&text=${encodeURIComponent(
      msg
    )}&hashtags=javascript,programming`
  );
};
</script>

<style lang="scss" scoped>
.best-play {
  position: relative;
  height: auto;
  border: 1px solid #bdbdbd;
  border-radius: 8px;
}
.best-play__title {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: #bdbdbd;
  color: #333333;
}
.continue {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  column-gap: 1rem;
  align-items: center;
  text-align: center;
  color: #747980;
}
.continue::before,
.continue::after {
  background-color: #cdced1;
  content: "";
  display: block;
  height: 2px;
}
</style>
