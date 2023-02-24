<template>
  <div class="wrapper flex justify-center column no-wrap q-px-md fullscreen">
    <!-- <div class="wrapper relative-position"> -->
    <!-- Top toolbar -->
    <Transition
      appear
      enter-active-class="animated bounceIn"
      leave-active-class="animated bounceOut"
    >
      <div class="layout" v-if="isLayoutShown">
        <div class="top-tool-bar flex justify-between q-mb-lg">
          <q-icon
            name="help_outline"
            size="2rem"
            class="cursor-pointer"
            @click="isInstructionOpen = !isInstructionOpen"
          />
          <div class="counter">
            {{ props.role === "lobby" ? gameStore.state.timeLeft || "" : null }}
          </div>
          <q-icon
            class="cursor-pointer"
            name="settings"
            size="2rem"
            @click="isSettingOpen = !isSettingOpen"
          />
        </div>
        <!-- Game screen -->
        <router-view />
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
export default {
  components: { gameSettingComponent: gameSettingPage },
};
</script>
<script setup>
import { useGameStore } from "src/stores/game";
import { shallowRef, defineProps } from "vue";
const props = defineProps({
  role: {
    type: String,
    validator: (propValue) => {
      return ["lobby", "game"].includes(propValue);
    },
  },
});
const gameStore = useGameStore();
const isSettingOpen = shallowRef(false);
const isInstructionOpen = shallowRef(false);
const isLayoutShown = shallowRef(props.role === "lobby" ? true : false);
</script>

<style lang="scss" scoped>
.wrapper,
.game-setting-wrapper,
.instruction-wrapper {
  width: clamp(320px, 100vw, 512px);
  margin: 0 auto;
  // padding: 0 20px;
}
</style>
