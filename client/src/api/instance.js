import axios from "axios";
import { Notify } from "quasar";

const instance = axios.create({ baseURL: "/api", timeout: 1000 * 10 });
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const { response } = error;
    if (response) {
      errorHandle(response.status, response.data.msg);
      return Promise.reject(response);
    } else {
      if (!window.navigator.onLine) {
        showErrorMessage("網路異常，請確認連線狀態正常");
        return Promise.reject(error);
      } else {
        showErrorMessage("未知錯誤");
        return Promise.reject(error);
      }
    }
  }
);
// helpers
const errorTable = {
  "incorrect password": "信箱或密碼錯誤",
  "user not registered": "信箱或密碼錯誤",
  "user exists": "此信箱已被註冊",
  "not active games that match the code": "找不到匹配的遊戲房",
  "game is full": "此遊戲房已滿",
};
const showErrorMessage = (message) => {
  Notify.create({
    type: "negative",
    classes: "text-weight-bold",
    position: "top",
    icon: "report_problem",
    message: message,
    actions: [{ label: "關閉", color: "white", class: "text-weight-bolder" }],
    timeout: 3000,
  });
};
const errorHandle = (status, message) => {
  switch (status) {
    case 400:
      showErrorMessage(errorTable[message]);
      break;
    default:
      showErrorMessage(`${status} - ${message}`);
  }
};

export default instance;
