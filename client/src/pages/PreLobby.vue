<template>
  <div class="row flex-center fullscreen">
    <q-card style="width: 21rem; padding: 1rem 1.5rem">
      <q-card-section>
        <q-form
          class="column q-col-gutter-y-sm"
          @submit.prevent="joinGame"
          @validation-error="lazyRule = false"
          greedy
        >
          <div class="form-group q-mb-xs q-pt-none">
            <label for="display-name" class="text-subtitle1 text-grey-9"
              >房間Code</label
            >
            <q-input
              id="room-code"
              name="room-code"
              label="請輸入四個字元的code來加入遊戲"
              type="text"
              maxlength="4"
              outlined
              dense
              hide-bottom-space
              :lazy-rules="lazyRule"
              :rules="[(val) => val.length === 4 || '長度不足']"
              v-model="gameCode"
              :disable="isFormLocked"
            >
            </q-input>
          </div>
          <div class="form-group q-mb-xs">
            <label for="email" class="text-subtitle1 text-grey-9"
              >遊戲暱稱</label
            >
            <q-input
              id="display-name"
              name="display-name"
              label="您的遊戲暱稱"
              type="text"
              counter
              maxlength="12"
              outlined
              dense
              :lazy-rules="lazyRule"
              hide-bottom-space
              v-model="displayName"
              :disable="!!isRegisteredUser || isFormLocked"
              :rules="[(val) => !!val || '請輸入遊戲暱稱']"
            >
            </q-input>
          </div>
          <div>
            <q-btn
              class="full-width text-weight-bold text-subtitle1"
              color="primary"
              label="加入遊戲"
              padding="sm"
              type="submit"
              :loading="isFormLocked"
            />
          </div>
          <div class="text-center">
            <div class="text-subtitle2">
              已經有帳號了嗎?<router-link
                class="text-primary text-weight-medium q-px-xs"
                :class="!isFormLocked ? 'cursor-pointer' : 'disable'"
                :to="!isFormLocked ? '/' : ''"
                >登入</router-link
              >
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { reactive, toRefs, shallowRef, onMounted } from "vue";
import { useGameStore } from "src/stores/game";
import { useUserStore } from "src/stores/user";
const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();
// form-related control
const lazyRule = shallowRef("ondemand");
const isFormLocked = shallowRef(false);
const isRegisteredUser = userStore.getUser;
// form object
const queryString = useRoute().query.code;
const player = reactive({
  displayName: userStore.getUser?.displayName || "",
  gameCode: queryString?.substring(0, 4) || "",
});
const { displayName, gameCode } = toRefs(player);
onMounted(async () => {
  // if the registered user comes in via the QR Code
  if (displayName.value && gameCode.value) {
    try {
      await joinGame();
    } catch {
      console.log("error");
    }
  }
});
const joinGame = async (event) => {
  isFormLocked.value = true;
  try {
    // AJAX post request
    await gameStore.joinGame(player);
    router.push(`/lobby`);
  } catch (error) {
    isFormLocked.value = false;
    // used as the event handler
    if (event) {
      console.log(error);
    } else {
      // not used as the event handler
      throw error;
    }
  }
};
</script>
<style>
.disable {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
<!-- 
(1.) Check whether there is a query string in the URL
(2.) Check whether the user has logged in 
(1.) logged user comes via link
(2.) unlogged user comes via link ->
     (a.) login and come back -> (1.)
     (b.) join as an anonymous user ? probe the room?
(3.) logged user comes without link
(4.) unlogged user comes without link
Four scenarios:
(1.) Registered user come in via QR code
(2.) 
 -->
