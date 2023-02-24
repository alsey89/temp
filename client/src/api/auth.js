import axiosInstance from "./instance";

export default {
  register(form) {
    return axiosInstance.post("/register", JSON.stringify(form));
  },
  login(form) {
    return axiosInstance.post("/login", JSON.stringify(form));
  },
};
