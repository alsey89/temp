<template>
  <TransitionGroup name="slide">
    <slot></slot>
  </TransitionGroup>
</template>

<script>
export default {
  name: "SlideInTransitionGroup",
};
</script>

<style lang="scss">
.slide-enter-active {
  transition: all 0.1s cubic-bezier(0.37, 0.82, 0.2, 1);
}
.slide-enter-from {
  transform: translateX(-100px);
  opacity: 0;
}
@for $i from 1 through 10 {
  .slide-enter-active.form-group:nth-child(#{$i}),
  .slide-leave-active.form-group:nth-child(#{$i}) {
    transition-delay: $i * 0.1s;
  }
}
</style>
