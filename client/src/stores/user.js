import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { api } from "src/boot/axios";
export const useUserStore = defineStore("user", () => {
  const state = reactive({ user: null });
  const getUser = computed(() => state.user);
  const register = async (form) => {
    const response = await api.auth.register(form);
    const { msg, ...userInfo } = response.data;
    state.user = userInfo;
  };
  const login = async (form) => {
    const response = await api.auth.login(form);
    const { msg, ...userInfo } = response.data;
    state.user = userInfo;
  };
  const logout = async (form) => {};
  return {
    state,
    getUser,
    login,
    register,
  };
});
