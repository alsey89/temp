import { Notify } from "quasar";

const serializer = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

const showSuccessMessage = (message) => {
  Notify.create({
    type: "positive",
    classes: "text-weight-bold",
    position: "top",
    message: message,
    timeout: 1000,
  });
};
const showWarningMessage = (message) => {
  Notify.create({
    type: "negative",
    classes: "text-weight-bold",
    position: "center",
    message,
    timeout: 1000,
  });
};
// self-adjusting timer
class Timer {
  expected = null;
  timeout = null;
  constructor(callback, interval) {
    this.interval = interval;
    this.callback = callback;
  }
  start() {
    this.expected = Date.now() + this.interval;
    this.timeout = setTimeout(this.iteration.bind(this), this.interval);
  }
  stop() {
    clearTimeout(this.timeout);
  }
  reset() {
    this.expected = null;
    this.timeout = null;
  }
  iteration() {
    let drift = Date.now() - this.expected;
    this.callback();
    this.expected += this.interval;
    this.timeout = setTimeout(this.iteration.bind(this), this.interval - drift);
  }
}
class CountdownTimer {
  expected = null;
  timeout = null;
  endTimeStamp = null;
  constructor(onTick, callback, interval) {
    this.onTick = onTick;
    this.callback = callback;
    this.interval = interval;
  }
  start(endTimeStamp) {
    this.endTimeStamp = endTimeStamp;
    this.expected = Date.now() + this.interval;
    this.timeout = setTimeout(this.iteration.bind(this), this.interval);
  }
  stop() {
    clearTimeout(this.timeout);
  }
  iteration() {
    const now = Date.now();
    if (this.endTimeStamp - now <= 500) {
      this.callback();
      return this.stop();
    }
    const drift = now - this.expected;
    this.onTick();
    this.expected += this.interval;
    this.timeout = setTimeout(this.iteration.bind(this), this.interval - drift);
  }
}
const setAsyncTimeout = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay * 1000));
export {
  serializer,
  CountdownTimer,
  showSuccessMessage,
  showWarningMessage,
  setAsyncTimeout,
  Timer,
};
