<template>
  <q-form
    class="column q-col-gutter-y-sm"
    @submit.prevent="onSubmit"
    @validation-error="lazyRuleOnLoginInput = false"
    greedy
  >
  <!-- <div> -->
    <!-- Email field -->
    <SlideInTransitionGroup appear>
      <div class="form-group q-mb-xs q-pt-none">
        <label for="email" class="text-subtitle1 text-grey-9">電子郵件</label>
        <q-input
          id="email"
          name="email"
          label="您的電子郵件信箱"
          type="text"
          outlined
          dense
          hide-bottom-space
          :lazy-rules="lazyRuleOnLoginInput"
          v-model="v$.email.$model"
          bottom-slots
          :disable="isFormLocked"
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
      <!-- Password field -->
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
          :lazy-rules="lazyRuleOnLoginInput"
          bottom-slots
          :disable="isFormLocked"
          v-model="v$.password.$model"
          :rules="[
            (val) => !v$.password.required.$invalid || '請輸入對應的密碼',
            (val) => !v$.password.min.$invalid || '密碼至少需由六個字元組成',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
      <!-- Remember me and forget password -->
      <div class="row justify-between items-center q-mb-sm">
        <q-checkbox
          class="text-subtitle2"
          dense
          label="記住我的登入電子郵件"
          v-model="rememberMe"
          :disable="isFormLocked"
        />
        <!-- <a href="#">Forget Password?</a> -->
      </div>
      <!-- Submit button -->
      <div class="q-mb-sm">
        <q-btn
          class="full-width q-mb-xs text-weight-bold text-subtitle1"
          type="submit"
          color="primary"
          label="登入"
          padding="sm"
          :loading="isFormLocked"
        />
        <!-- Reset password -->
        <p
          class="text-right text-subtitle2 text-grey-9 q-ma-none"
          :class="{
            'field-disable': isFormLocked,
            'cursor-pointer': !isFormLocked,
          }"
          @click="!isFormLocked && (isModalOpen = !isModalOpen)"
        >
          重設密碼
        </p>
      </div>
      <!-- Link break -->
      <div class="relative-position">
        <p class="continue q-mb-sm text-subtitle2">繼續</p>
      </div>
      <!-- Oauth -->
      <div class="row q-gutter-md justify-center q-mb-sm">
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
      <!-- Signup -->
      <div class="text-center">
        <div class="text-subtitle2">
          還沒有帳號嗎?<span
            class="text-primary text-weight-medium q-px-xs"
            :class="{
              'register--hover': !isFormLocked,
              'field-disable': isFormLocked,
              'cursor-pointer': !isFormLocked,
            }"
            @click="!isFormLocked && emit('switch-to-register')"
            >註冊</span
          >
        </div>
      </div>
    </SlideInTransitionGroup>
  <!-- </div> -->
  </q-form>
  <!-- Modal -->
  <q-dialog v-model="isModalOpen" :persistent="isFormLocked">
    <q-card style="width: 21rem">
      <q-card-section>
        <div class="text-h6">重設密碼</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p :disable="isFormLocked">
          請輸入您的電子郵件地址，我們會立即寄出<span class="text-weight-bold"
            >重設密碼</span
          >電子郵件至您的註冊信箱，協助您修改密碼。
        </p>
        <q-input
          id="resetEmail"
          name="resetEmail"
          ref="resetEmailRef"
          label="您的電子郵件地址"
          type="email"
          v-model="resetEmail"
          outlined
          dense
          hide-bottom-space
          :lazy-rules="lazyRuleOnResetInput"
          bottom-slots
          :disable="isFormLocked"
          :rules="[
            (val, rules) => rules.email(val) || '請輸入有效的電子郵件地址',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          class="text-weight-bold"
          type="button"
          style="background: #e0e0e0; color: #616161"
          label="取消"
          @click="isModalOpen = false"
          :disable="isFormLocked"
        />
        <q-btn
          class="text-weight-bold"
          type="button"
          color="positive"
          label="確認"
          :loading="isFormLocked"
          @click="requestResetEmail"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "LoginForm",
};
</script>
<script setup>
import { useUserStore } from "src/stores/user";
import { email, required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useRouter, useRoute } from 'vue-router'
import SlideInTransitionGroup from "src/utilities/SlideInTransitionGroup.vue";
import {
  ref,
  reactive,
  shallowRef,
  computed,
  defineProps,
  toRefs,
  defineEmits,
  watch,
} from "vue";
import axios from "axios";
const route = useRoute();
const router = useRouter()
const userStore = useUserStore();
// Oauth providers
const oAuthProviders = [
  { name: "facebook", ref: 0 },
  { name: "google", ref: 1 },
  { name: "line", ref: 2 },
  { name: "apple", ref: 3 },
];
// The props to receive from the parent component
const props = defineProps({ isFormLocked: Boolean });
const { isFormLocked } = toRefs(props);
// Custom event
const emit = defineEmits([
  "form-submit",
  "form-processed",
  "switch-to-register",
]);
const emailFromStorage = localStorage.getItem("email");
const rememberMe = shallowRef(emailFromStorage ? true : false);
// Remove email from local Storage when user uncheck remember me
watch(rememberMe, (rememberEmail) => {
  if (!rememberEmail) {
    localStorage.removeItem("email");
  }
});
const user = reactive({
  email: emailFromStorage || "",
  password: "",
});
const validationRules = computed(() => ({
  email: {
    required,
    email,
  },
  password: { required, min: minLength(6) },
}));
const v$ = useVuelidate(validationRules, user);
const lazyRuleOnLoginInput = shallowRef("ondemand");
const onSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  emit("form-submit");
  // const response = await axios.post("/api/login", user);
  try {
    await userStore.login(user);
    // after async call
    if (rememberMe.value) {
      localStorage.setItem("email", user.email);
    } else {
      localStorage.removeItem("email");
    }
    // window.location.reload();
    router.push({name: 'home'})
  } catch (error) {
    console.log("there is an error", error);
    emit("form-processed");
    user.password = "";
  }
};
// Modal
const isModalOpen = shallowRef(false);
const resetEmailRef = ref(null);
const resetEmail = shallowRef("");
const lazyRuleOnResetInput = ref("ondemand");
const requestResetEmail = () => {
  // validate the form only when submission
  resetEmailRef.value.validate();
  // turen the rule to false so that user will get the constant feedback
  lazyRuleOnResetInput.value = false;
  // check whether there is an error
  const hasError = resetEmailRef.value.hasError;
  if (hasError) return;
  try {
    // async call
    emit("form-submit");
  } catch (error) {
  } finally {
    setTimeout(() => {
      emit("form-processed");
    }, 3000);
  }
};
</script>
<style scoped>
.continue {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  column-gap: 1rem;
  align-items: center;
  text-align: center;
}
.continue::before,
.continue::after {
  background-color: black;
  content: "";
  display: block;
  height: 2px;
}
.register--hover:hover {
  text-decoration: underline;
}
.field-disable {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
