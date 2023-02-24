<template>
  <q-card
    class="col-12 q-mx-auto relative-position"
    style="display: block"
    flat
  >
    <!-- Banner -->
    <q-card-section>
      <q-carousel
        v-model="banner"
        transition-prev="slide-left"
        transition-next="slide-right"
        infinite
        swipeable
        animated
        control-color="white"
        navigation
        arrows
        :autoplay="5000"
      >
        <q-carousel-slide
          name="1"
          class="column no-wrap flex-center"
          img-src="~assets/default.jpg"
        />
        <q-carousel-slide
          name="2"
          class="column no-wrap flex-center"
          img-src="~assets/default-2.jpg"
        />
      </q-carousel>
    </q-card-section>
    <!-- Game categories -->
    <q-card-section>
      <div class="row items-center justify-between">
        <h4 class="game-category" style="color: #333333">Game Categories</h4>
        <!-- <q-btn :ripple="false" flat style="color: #3a3a3a" label="Read more" /> -->
      </div>
      <swiper
        :slides-per-view="3"
        :space-between="10"
        :modules="modules"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
      >
        <swiper-slide>
          <router-link to="/games/shami">
            <q-card>
              <q-card-section>
                <q-img
                  src="~assets/giggle.png"
                  class="cursor-pointer"
                  />
              </q-card-section>

            </q-card>
          </router-link>


        </swiper-slide>
        <!-- <swiper-slide>
          <q-img
            ratio="1"
            src="~assets/promotion-02.jpg"
            class="cursor-pointer"
          />
        </swiper-slide>
        <swiper-slide>
          <q-img
            ratio="1"
            src="~assets/promotion-03.jpg"
            class="cursor-pointer"
          />
        </swiper-slide>
        <swiper-slide>
          <q-img ratio="1" src="~assets/default.jpg" class="cursor-pointer" />
        </swiper-slide>
        <swiper-slide>
          <q-img ratio="1" src="~assets/default-2.jpg" class="cursor-pointer" />
        </swiper-slide> -->
      </swiper>
      <!-- <button @click="test">Test</button> -->
    </q-card-section>
    <q-card-section>
      <div class="row items-center q-my-lg">
        <q-input
          name="gameCode"
          ref="codeInputRef"
          type="search"
          v-model="codeInput"
          class="col-grow"
          outlined
          label="Enter Game Code"
          unmasked-value
          mask="####"
          dense
          lazy-rules="ondemand"
          :rules="[(val) => val.length === 4 || 'Please type in 4-digit code']"
        >
          <template v-slot:after>
            <q-btn
              :loading="gameSearching"
              class="q-mx-sm"
              size="md"
              style="border-radius: 4px; background-color: #d9d9d9"
              dense
              stretch
              label="Join Game"
              no-caps
              @click="joinGame"
            />
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import axios from "axios";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    /* test for connecting frontend to backend */
    function test() {
      axios
        .get("api/test")
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    /* Game code input */

    // Store the data in the state
    const codeInput = ref(null);
    // having access to the DOM input element
    const codeInputRef = ref(null);
    // Disable the button when making the AJAX call
    const gameSearching = ref(false);
    // callback function to be invoked when the button is clicked
    function joinGame() {
      codeInputRef.value.validate();
      if (codeInputRef.value.hasError) {
        return;
      }
      gameSearching.value = true;
      // AJAX call
      gameSearching.value = false;
    }
    return {
      banner: ref("1"),
      modules: [Autoplay],
      test,
      codeInput,
      codeInputRef,
      gameSearching,
      joinGame,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-carousel {
  height: clamp(160px, 50vw, 400px);
}
// .q-card {
//   width: clamp(320px, 100vw, 768px);
// }
.game-category {
  font-size: clamp(22px, calc(6.5vw+3px), 60px);
}
.q-btn {
  font-size: clamp(12px, calc(3.5vw+3px), 24px);
}
.q-tab :deep(.q-tab__label) {
  font-size: clamp(10px, calc(2.5vw+2px), 20px);
}
</style>
