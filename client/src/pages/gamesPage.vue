<template>
  <div>
    <h1 class="text-center">Games</h1>
    <div class="row q-col-gutter-xl">
      <div class="col-xs-12 col-sm-6 flex flex-center">
        <router-link to="/games/god" custom v-slot="{ navigate }">
          <q-img
            @click="navigate"
            src="~assets/promotion-01.jpg"
            spinner-color="blue"
            :ratio="4 / 3"
            width="100%"
            class="cursor-pointer overflow-hidden"
            style="max-width: 360px; border-radius: 20px"
          >
            <div class="absolute-bottom text-subtitle1 text-center">
              Quiplash
            </div>
          </q-img>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.q-img {
  transition: transform 0.2s linear;
}
.q-img:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
.q-img:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
