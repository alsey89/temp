<template>
  <div class="avatar-wrapper" :style="{ width: size }">
    <div
      class="avatar-wrapper__body"
      :style="{
        '--size': size,
        '--color-coordinate-x': colorCoordinates[color].x,
        '--color-coordinate-y': colorCoordinates[color].y,
      }"
    ></div>
    <div
      class="avatar-wrapper__face"
      :style="{
        '--size': size,
        '--face-coordinate-x': faceCoordinates[face].x,
        '--face-coordinate-y': faceCoordinates[face].y,
      }"
    ></div>
    <div
      :class="[accessory === 'none' ? '' : 'avatar-wrapper__accessory']"
      :style="{
        '--size': size,
        '--accessory-coordinate-x': accessoryCoordinates[accessory]?.x,
        '--accessory-coordinate-y': accessoryCoordinates[accessory]?.y,
      }"
    ></div>
  </div>
</template>
<script>
export default {
  name: "GiggleAvatar",
};
</script>
<script setup>
// Import tools for guarding the props
import { defineProps, toRefs } from "vue";
// PROPS
const props = defineProps({
  size: {
    type: String,
    default: "190px",
  },
  color: {
    type: String,
    default: "maya-blue",
    validator(color) {
      return [
        "pastal-red",
        "orchid-pink",
        "lavender-blue",
        "sandy-brown",
        "maya-blue",
        "pastel-green",
        "shandy-yellow",
        "chinese-white",
        "philippine-silver",
        "davy-grey",
      ].includes(color);
    },
  },
  face: {
    type: String,
    default: "smily",
    validator(face) {
      return ["unamused", "adorkable", "smily", "astonished", "angry"].includes(
        face
      );
    },
  },
  accessory: {
    type: String,
    default: "none",
    validator(accessory) {
      return [
        "scarf",
        "tie",
        "underwear",
        "toga",
        "towel",
        "metal-spikes",
        "bandana",
        "bowtie",
        "baseball-tee",
        "apron",
        "round-glasses",
        "mustache",
        "sunglasses",
        "party-hat",
        "bow",
        "chef-hat",
        "cowboy-hat",
        "stick",
        "magical-stick",
        "spatula",
        "none",
      ].includes(accessory);
    },
  },
});
const { size, color, face, accessory } = toRefs(props);
// BODY ENUMS
const AVATAR_ORIGIN_X = -43;
const AVATAR_ORIGIN_Y = -50;
const AVATAR_WIDTH = -175;
const AVATAR_HEIGHT = -200;
const HORIZONTAL_GAP = -10;
const VERTICAL_GAP = -112;
const colorCoordinates = {
  "pastal-red": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 0,
    y: AVATAR_ORIGIN_Y,
  },
  "orchid-pink": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 1,
    y: AVATAR_ORIGIN_Y,
  },
  "lavender-blue": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 2,
    y: AVATAR_ORIGIN_Y,
  },
  "sandy-brown": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 3,
    y: AVATAR_ORIGIN_Y,
  },
  "maya-blue": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 4,
    y: AVATAR_ORIGIN_Y,
  },
  "pastel-green": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 0,
    y: AVATAR_ORIGIN_Y + AVATAR_HEIGHT + VERTICAL_GAP,
  },
  "shandy-yellow": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 1,
    y: AVATAR_ORIGIN_Y + AVATAR_HEIGHT + VERTICAL_GAP,
  },
  "chinese-white": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 2,
    y: AVATAR_ORIGIN_Y + AVATAR_HEIGHT + VERTICAL_GAP,
  },
  "philippine-silver": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 3,
    y: AVATAR_ORIGIN_Y + AVATAR_HEIGHT + VERTICAL_GAP,
  },
  "davy-grey": {
    x: AVATAR_ORIGIN_X + (AVATAR_WIDTH + HORIZONTAL_GAP) * 4,
    y: AVATAR_ORIGIN_Y + AVATAR_HEIGHT + VERTICAL_GAP,
  },
};
// FACE ENUMS
const faceCoordinates = {
  unamused: { x: -45, y: -40 },
  adorkable: { x: -220, y: -40 },
  smily: { x: -134, y: -130 },
  astonished: { x: -60, y: -230 },
  angry: { x: -205, y: -230 },
};
// ACCESSORY ENUMS
const ACCESSORY_ORIGIN_X = -59;
const ACCESSORY_ORIGIN_Y = -37.5;
const ACCESSORY_WIDTH = -190;
const ACCESSORY_HORIZONTAL_GAP = -2.5;
const ACCESSORY_HEIGHT = -240;
const accessoryCoordinates = {
  scarf: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 0,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 0,
  },
  tie: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 1,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 0,
  },
  underwear: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 2,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 0,
  },
  toga: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 3,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 0,
  },
  towel: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 4,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 0,
  },
  "metal-spikes": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 0,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 1,
  },
  bandana: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 1,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 1,
  },
  bowtie: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 2,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 1,
  },
  "baseball-tee": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 3,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 1,
  },
  apron: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 4,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 1,
  },
  "round-glasses": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 0,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 2,
  },
  mustache: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 1,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 2,
  },
  sunglasses: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 2,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 2,
  },
  "party-hat": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 3,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 2,
  },
  bow: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 4,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 2,
  },
  "chef-hat": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 0,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 3,
  },
  "cowboy-hat": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 1,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 3,
  },
  stick: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 2,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 3,
  },
  "magical-stick": {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 3,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 3,
  },
  spatula: {
    x: ACCESSORY_ORIGIN_X + (ACCESSORY_WIDTH + ACCESSORY_HORIZONTAL_GAP) * 4,
    y: ACCESSORY_ORIGIN_Y + ACCESSORY_HEIGHT * 3,
  },
};
</script>
<style lang="scss" scoped>
// BODY VARIABLES
$base-width: 190;
$base-height: 240;
$base-ratio: $base-width / $base-height;
$base-image-size: 1008;
// FACE VARIABLES
$face-width: 90;
$face-height: 80;
$face-relative-position-left: 27.5;
$face-relative-position-top: 65;
$face-image-size: 360;
// ACCESSORY VARIABLES
$accessory-width: 190;
$accessory-height: 240;
$accessory-relative-position-left: 0;
$accessory-relative-position-bottom: 0;
$accessory-image-size: 1080;
.avatar-wrapper {
  display: inline-block;
  position: relative;
  aspect-ratio: $base-ratio;
}
.avatar-wrapper__body,
.avatar-wrapper__face,
.avatar-wrapper__accessory {
  position: absolute;
  background-repeat: no-repeat;
  overflow: hidden;
}
.avatar-wrapper__body {
  z-index: 0;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  background-image: url("../assets/avatar/avatar-colors.png");
  background-position-x: calc(
    var(--size) / #{$base-width} * var(--color-coordinate-x)
  );
  background-position-y: calc(
    var(--size) / #{$base-width} * var(--color-coordinate-y)
  );
  background-size: calc(var(--size) / #{$base-width} * #{$base-image-size});
}
.avatar-wrapper__face {
  z-index: 1;
  width: calc(var(--size) / #{$base-width} * #{$face-width});
  height: calc(var(--size) / #{$base-width} * #{$face-height});
  top: calc(var(--size) / #{$base-width} * #{$face-relative-position-top});
  left: calc(var(--size) / #{$base-width} * #{$face-relative-position-left});
  background-image: url("../assets/avatar/avatar-faces.png");
  background-position-x: calc(
    var(--size) / #{$base-width} * var(--face-coordinate-x)
  );
  background-position-y: calc(
    var(--size) / #{$base-width} * var(--face-coordinate-y)
  );
  background-size: calc(var(--size) / #{$base-width} * #{$face-image-size});
}
.avatar-wrapper__accessory {
  z-index: 1;
  width: calc(var(--size) / #{$base-width} * #{$accessory-width});
  height: calc(var(--size) / #{$base-width} * #{$accessory-height});
  bottom: calc(
    var(--size) / #{$base-width} * #{$accessory-relative-position-bottom}
  );
  left: calc(
    var(--size) / #{$base-width} * #{$accessory-relative-position-left}
  );
  background-image: url("../assets/avatar/avatar-accesories.png");
  background-position-x: calc(
    var(--size) / #{$base-width} * var(--accessory-coordinate-x)
  );
  background-position-y: calc(
    var(--size) / #{$base-width} * var(--accessory-coordinate-y)
  );
  background-size: calc(
    var(--size) / #{$base-width} * #{$accessory-image-size}
  );
}
</style>
