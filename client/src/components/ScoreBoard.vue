<template>
  <div class="flex column full-height q-mt-xl">
    <div class="score text-h3 q-mb-md">Score</div>
    <div class="player-score">
      <q-item
        class="flex items-center q-pa-none"
        v-for="({ displayName, uuid, score }, index) in props.playersScoresList"
        :key="uuid"
      >
        <q-avatar
          size="lg"
          text-color="grey-8"
          style="border: 1px solid #bdbdbd"
          class="q-mr-sm"
        >
          {{ index + 1 }}
        </q-avatar>
        <q-avatar color="grey-6" text-color="white" size="md" class="q-mr-sm">
          {{ displayName[0].toUpperCase() }}
        </q-avatar>
        <q-item-section>
          <q-item-label
            class="player-name text-subtitle1"
            style="color: #333333"
            >{{ displayName }}</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-item-label
            class="player-name text-subtitle1"
            style="color: #333333"
            >{{ score * 100 }} Points</q-item-label
          >
        </q-item-section>
      </q-item>
    </div>
    <!-- <div class="best-play q-mt-auto q-mb-md" style="color: #333333">
      <div class="best-play__title text-h6 q-mb-sm">Best Plays</div>
      <div
        class="best-play__box q-pa-md text-subtitle1"
        style="border: 1px solid #bdbdbd; border-radius: 8px"
      >
        <div class="flex no-wrap items-center">
          <q-avatar square style="background-color: #bdbdbd" class="q-mr-sm"
            >Q:</q-avatar
          >
          <span
            >Reporter: Regarding the invastion of ukraine...xxxxxxxxxxxxxxxxxx
            Putin: ________
          </span>
        </div>
        <div class="flex no-wrap items-center">
          <q-avatar square style="background-color: #bdbdbd" class="q-mr-sm"
            >A:</q-avatar
          >
          <span>Uh uh... It’s Mykraine</span>
        </div>
      </div>
    </div> -->
    <div class="q-mb-md q-mt-auto">
      <q-btn
        class="full-width text-subtitle1"
        no-caps
        rounded
        style="background-color: #e0e0e0"
        :loading="isWaiting"
        :disable="isWaiting"
        @click.prevent="handleClick"
      >
        Next
        <template v-slot:loading>請等候其他玩家...</template>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  playersScoresList: {
    type: Array,
    required: true,
  },
  isWaiting: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["startNextRound"]);
const handleClick = () => {
  emit("startNextRound");
};
</script>

<style lang="scss" scoped>
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  border: 1px solid #bdbdbd;
  color: #333333;
  text-align: center;
}
</style>
