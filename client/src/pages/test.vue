<template>
  <Transition>
    <div v-if="gamePhase === 'roundStart'"></div>
    <div v-else-if="gamePhase === 'roundEnd'"></div>
    <div v-else-if="gamePhase === 'gameEnd'"></div>
    <!-- Game Layout -->
    <div v-else>
      <!-- Others......... -->
      <!-- ................ -->

      <!-- Interaction Area -->
      <Transition>
        <div v-if="gamePhase === 'collecting'"></div>
        <div v-if="gamePhase === 'voting'"></div>
        <div v-if="gamePhase === 'revealing'">
          <div v-for="{ answer, votes } in votedAnswers" :key="answer">
            <!-- Answer -->
            <div>{{ answer }}</div>
            <!-- Avatar container -->
            <div>
              <span v-for="{ displayName, uuid } in votes" :key="uuid">{{
                displayName
              }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
import { ref } from "vue";
const gamePhase = ref("roundStart");
const votedAnswers = [
  {
    answer: "Taipei",
    votes: [{ displayName: "John", uuid: crypto.randomUUID() }],
  },
  {
    answer: "Tainan",
    votes: [{ displayName: "Alex", uuid: crypto.randomUUID() }],
  },
  {
    answer: "Taichung",
    votes: [
      { displayName: "Joe", uuid: crypto.randomUUID() },
      { displayName: "Anne", uuid: crypto.randomUUID() },
    ],
  },
  {
    answer: "Rome",
    votes: [
      { displayName: "Danny", uuid: crypto.randomUUID() },
      { displayName: "Summy", uuid: crypto.randomUUID() },
      { displayName: "Michael", uuid: crypto.randomUUID() },
      { displayName: "Daren", uuid: crypto.randomUUID() },
    ],
  },
];
// (1.) roundStart
// (2.) collecting -> what to display after clicking on 'submit' button
// (3.) voting -> what to display after clicking on 'the answer to vote for'
// (4.) revealing
// (5.) roundEnd
// (6.) gameEnd
</script>

<style lang="scss" scoped></style>
