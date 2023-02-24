<template>
  <div
    class="joystick"
    :class="{ 'joystick--active': leverHeld }"
    @mousemove="handleMousemove"
  >
    <div
      ref="leverRef"
      class="joystick__lever"
      :class="{ 'joystick__lever--active': leverHeld }"
      @mousedown="leverHeld = true"
    ></div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>
<script setup>
import { ref } from "vue";
const leverRef = ref(null);
const leverHeld = ref(false);
const handleMouseup = () => {
  if (leverHeld.value) {
    leverHeld.value = !leverHeld.value;
  }
};
console.log(leverRef);
const handleMousemove = ($event) => {
  if (!leverHeld.value) return;
  console.log("mouse move");
  console.log($event);
};
document.addEventListener("mouseup", handleMouseup);
</script>

<style lang="scss" scoped>
.joystick {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e0e0e0;
  opacity: 0.5;
}
.joystick__lever {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.7;
}
.joystick--active {
  opacity: 1;
}
.joystick__lever--active {
  opacity: 0.7;
}
</style>
