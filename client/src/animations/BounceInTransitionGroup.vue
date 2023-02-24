<template>
  <TransitionGroup
    enter-active-class="bounceInRight"
    leave-active-class="bounceOutRight"
    @enter="onEnter"
    @leave="onEnter"
  >
    <slot></slot>
  </TransitionGroup>
</template>
<script>
export default {
  name: "BounceInTransitionGroup",
};
</script>
<script setup>
import swoosh from "src/assets/audio/swoosh.mp3";
const audio = new Audio(swoosh);
const onEnter = async () => {
  const playing = await audio.play();
  if (playing !== undefined) {
    playing;
  }
};
</script>

<style lang="scss">
@keyframes bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0) scaleX(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0) scaleX(1);
  }

  75% {
    transform: translate3d(10px, 0, 0) scaleX(0.98);
  }

  90% {
    transform: translate3d(-5px, 0, 0) scaleX(0.995);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
.bounceInRight {
  animation-name: bounceInRight;
  animation-duration: 1s;
}
.bounceOutRight {
  animation-name: bounceInRight;
  animation-duration: 1s;
  animation-direction: reverse;
}
</style>
