<template>
  <div class="row flex-center fullscreen">
    <q-card style="width: 21rem; padding: 1rem 1.5rem">
      <!-- Toggle button -->
      <q-card-section>
        <q-btn-toggle
          :disable="isFormLocked"
          size="lg"
          v-model="mode"
          spread
          no-caps
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { label: '登入', value: LoginForm },
            { label: '註冊', value: RegisterForm },
          ]"
        />
      </q-card-section>
      <!-- Login/Register form -->
      <q-card-section>
        <component
          :is="mode"
          :isFormLocked="isFormLocked"
          @form-submit="isFormLocked = true"
          @form-processed="isFormLocked = false"
          @switch-to-register="mode = RegisterForm"
        ></component>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: "LoginRegister",
};
</script>
<script setup>
import { useRouter } from "vue-router";
import LoginForm from "src/components/LoginForm.vue";
import RegisterForm from "src/components/RegisterForm.vue";
import { shallowRef, ref } from "vue";
const mode = shallowRef(LoginForm);
const isFormLocked = ref(false);
const router = useRouter();
const isFromJoin = router.options.history.state.back;
// store in the local storage in case of Oauth
</script>
