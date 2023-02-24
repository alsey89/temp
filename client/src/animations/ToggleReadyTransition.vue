<template>
  <Transition v-bind="$attrs" @enter="onEnter">
    <slot></slot>
  </Transition>
</template>
<script>
export default {
  name: "ToggleReadyTransition",
};
</script>
<script setup>
import stamp from "src/assets/audio/stamp.mp3";
import lift from "src/assets/audio/lift-up.mp3";
import { useAttrs } from "vue";
const attrs = useAttrs();
const stampAudio = new Audio(stamp);
const liftAudio = new Audio(lift);
const onEnter = () => {
  if (attrs.name === "stamp-ready") {
    stampAudio.play();
  } else {
    liftAudio.play();
  }
};
</script>

<style lang="scss">
// KEYFRAMES
@keyframes stamp-ready {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.5;
    transform: scale(2.5);
  }
  100% {
    opacity: 1;
    transform: rotate(-8deg) scale(1);
  }
}
@keyframes stamp-preparing {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.5;
    transform: scale(2.5);
  }
  100% {
    transform: scale(1);
  }
}
// ANIMATION CLASS
.stamp-ready-enter-active {
  animation: stamp-ready 0.3s;
}
.stamp-ready-leave-active {
  animation: stamp-preparing 0.3s reverse;
}
.stamp-preparing-enter-active {
  animation: stamp-preparing 0.3s forwards;
}
.stamp-preparing-leave-active {
  animation: stamp-ready 0.3s reverse;
}
</style>
