<template>
  <div class="progress-bar q-mb-sm">
    <q-linear-progress
      size="24px"
      style="border-radius: 10px"
      color="white"
      :value="progress"
      animation-speed="2100"
      :instant-feedback="timeLeft === 5 ? true : false"
    >
      <div
        class="text-center absolute-full flex flex-center text-caption"
        style="color: #333333"
      >
        Ends in {{ timeLeft }}s
      </div>
    </q-linear-progress>
    <div>
      <GiggleAvatar
        size="5rem"
        accessory="underwear"
        face="smily"
        color="maya-blue"
      />
    </div>
    Question:{{ question.question }} QuestionId:{{ question.questionId }}
    <q-btn @click="onClick" label="Click me" />
    <q-btn @click="onClickk" label="Click me again" />
  </div>
</template>

<script setup>
import { CountdownTimer } from "src/utilities/helpers";
import { ref, computed } from "vue";
import GiggleAvatar from "src/components/GiggleAvatar.vue";
const question = ref({ question: null, questionId: null });
const onClick = () => {
  question.value = { question: "lalala", questionId: 1233455 };
};
const onClickk = () => {
  question.value = { question: "dahai", questionId: 1111111 };
};
const countdown = new CountdownTimer(
  () => {
    timeLeft.value--;
  },
  () => {
    console.log((timeLeft.value = 5));
    console.log("time is up");
  },
  1000
);
const timeLeft = ref(5);
const progress = computed(() => timeLeft.value / 5);
countdown.start(Date.now() + 5000);
</script>

<style lang="scss" scoped></style>
