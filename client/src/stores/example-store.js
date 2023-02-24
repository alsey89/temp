import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useCounterStore = defineStore("counter", () => {
  const counter = ref(0);
  const doubleCount = computed(() => counter.value * 2);
  const increment = () => {
    counter.value++;
  };
  return {
    counter,
    doubleCount,
    increment,
  };
});
