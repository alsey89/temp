import axiosInstance from "./instance";

export default {
  create(form) {
    return axiosInstance.post("/game/create", JSON.stringify(form));
  },
  join(form) {
    return axiosInstance.post("/game/join", JSON.stringify(form));
  },
};
