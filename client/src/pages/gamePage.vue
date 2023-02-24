<template>
  <div style="max-width: 400px" class="q-mx-auto relative-position">
    <q-carousel
      v-model="slider"
      transition-prev="slide-left"
      transition-next="slide-right"
      infinite
      swipeable
      animated
      control-color="white"
      navigation
      arrows
      :autoplay=5000
      height="auto"
      style="aspect-ratio: 4/3; width: 100%"
    >
      <q-carousel-slide
        name="1"
        class="column no-wrap flex-center"
        img-src="~assets/giggle.png"
      />
      <!-- <q-carousel-slide
        name="2"
        class="column no-wrap flex-center"
        img-src="~assets/default-2.jpg"
      /> -->
    </q-carousel>

    <h4 class="text-center q-px-xs q-my-sm">
      Shami?!?!?!?
    </h4>
    <p>
      Get ready to test your wit and humor in the ultimate party game!
      Shami is the next big thing in gaming, taking the classic multiple choice formula to new heights.
      With hilarious questions and quirky characters,
      you and your friends will be laughing like never before.
      So gather around, grab your phone, tablet or computer, and let the games begin!
    </p>
    <div class="flex flex-center">
      <q-btn
        no-caps
        color="primary"
        rounded
        label="Create Game"
        style="width: 100%"
        to="/games/shami/settings"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const slider = ref("1");
const modal = ref(false);
</script>

<style lang="scss" scoped></style>
