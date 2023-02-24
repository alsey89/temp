<template>
  <q-form
    class="column q-col-gutter-y-sm"
    @submit.prevent="onSubmit"
    @validation-error="lazyRuleOnRegisterInput = false"
    greedy
  >
    <SlideInTransitionGroup appear>
      <!-- Name field -->
      <div class="form-group q-mb-xs q-pt-none">
        <label for="display-name" class="text-subtitle1 text-grey-9"
          >遊戲暱稱</label
        >
        <q-input
          id="display-name"
          name="displayName"
          label="您的遊戲暱稱"
          type="text"
          outlined
          dense
          hide-bottom-space
          :lazy-rules="lazyRuleOnRegisterInput"
          :disable="isFormLocked"
          v-model="v$.displayName.$model"
          :rules="[
            (val) => !v$.displayName.required.$invalid || '請輸入您的遊戲暱稱',
            (val) =>
              !v$.displayName.min.$invalid || '遊戲暱稱至少需由三個字元組成',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </div>
      <!-- Email -->
      <div class="form-group q-mb-sm">
        <label for="email" class="text-subtitle1 text-grey-9">電子郵件</label>
        <q-input
          id="email"
          name="email"
          label="您的電子郵件信箱"
          type="email"
          outlined
          dense
          hide-bottom-space
          :lazy-rules="lazyRuleOnRegisterInput"
          :disable="isFormLocked"
          v-model="v$.email.$model"
          :rules="[
            (val) => !v$.email.required.$invalid || '請輸入您的電子郵件信箱',
            (val) => !v$.email.email.$invalid || '信箱格式錯誤',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
      </div>
      <!-- Password -->
      <div class="form-group q-mb-sm">
        <label for="password" class="text-subtitle1 text-grey-9">密碼</label>
        <q-input
          id="password"
          name="password"
          label="您的密碼"
          type="password"
          outlined
          dense
          hide-bottom-space
          :lazy-rules="lazyRuleOnRegisterInput"
          :disable="isFormLocked"
          v-model="v$.password.$model"
          :rules="[
            (val) => !v$.password.required.$invalid || '請輸入您的密碼',
            (val) => !v$.password.min.$invalid || '密碼至少需由六個字元組成',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
      <!-- Confirm Password -->
      <div class="form-group q-mb-md">
        <label for="cfm_password" class="text-subtitle1 text-grey-9"
          >確認密碼</label
        >
        <q-input
          id="cfm_password"
          name="cfm_password"
          label="再次確認您的密碼"
          type="password"
          outlined
          dense
          hide-bottom-space
          :lazy-rules="lazyRuleOnRegisterInput"
          :disable="isFormLocked"
          v-model="v$.confirm_password.$model"
          :rules="[
            (val) =>
              !v$.confirm_password.required.$invalid || '請再次輸入您的密碼',
            (val) =>
              !v$.confirm_password.sameAsPassword.$invalid ||
              '與您輸入的密碼不符',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
      <!-- Register Button -->
      <div class="q-mb-md">
        <q-btn
          class="full-width text-weight-bold text-subtitle1"
          color="primary"
          label="註冊"
          padding="sm"
          type="submit"
          :loading="isFormLocked"
        />
      </div>
      <!-- Link break -->
      <div class="relative-position">
        <p class="continue q-mb-sm text-subtitle2">繼續</p>
      </div>
      <!-- Oauth -->
      <div class="row q-gutter-md justify-center">
        <a
          v-for="{ name, ref } in oAuthProviders"
          :key="ref"
          :href="!isFormLocked ? `/api/oauth/${name}` : null"
          :class="{
            'field-disable': isFormLocked,
            'cursor-pointer': !isFormLocked,
          }"
        >
          <q-icon size="md">
            <img
              :src="require(`../assets/icons/${name}-icon.svg`)"
              :alt="name"
            />
          </q-icon>
        </a>
      </div>
    </SlideInTransitionGroup>
  </q-form>
</template>

<script>
export default {
  name: "LoginForm",
};
</script>
<script setup>
import { useUserStore } from "src/stores/user";
// Import validation functions from vuelidate
import { email, required, minLength, sameAs } from "@vuelidate/validators";
// Import vuelidate
import { useVuelidate } from "@vuelidate/core";
// Import component for slide-in animation
import SlideInTransitionGroup from "src/utilities/SlideInTransitionGroup.vue";
import {
  reactive,
  computed,
  defineProps,
  toRefs,
  defineEmits,
  shallowRef,
} from "vue";
const userStore = useUserStore();
// Oauth providers
const oAuthProviders = [
  { name: "facebook", ref: 0 },
  { name: "google", ref: 1 },
  { name: "line", ref: 2 },
  { name: "apple", ref: 3 },
];
// The props to receive from the parent component
const props = defineProps({
  isFormLocked: Boolean,
});
const { isFormLocked } = toRefs(props);
// Custom event
const emit = defineEmits(["form-submit", "form-processed"]);
// State variable - Form data
const newUser = reactive({
  displayName: "",
  email: "",
  password: "",
  confirm_password: "",
});
//
const lazyRuleOnRegisterInput = shallowRef("ondemand");
// Validation rules to plug in
const validationRules = computed(() => ({
  email: { required, email },
  displayName: { required, min: minLength(3) },
  password: { required, min: minLength(6) },
  confirm_password: {
    required,
    min: minLength(6),
    sameAsPassword: sameAs(newUser.password),
  },
}));
const v$ = useVuelidate(validationRules, newUser);
const onSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  emit("form-submit");
  try {
    await userStore.register(newUser);
    window.location.reload();
  } catch (error) {
    emit("form-processed");
  }
};
</script>

<style lang="scss" scoped>
.continue {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  text-align: center;
  column-gap: 1rem;
}
.continue::before,
.continue::after {
  background-color: black;
  content: "";
  display: block;
  height: 2px;
}
.field-disable {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
