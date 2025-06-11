import { format } from "date-fns";

const DEFAULT_MAX_TIME = 5;

export const useTimerStore = defineStore("timer", () => {
  const timeLeft = ref(0);
  const isRunning = ref(false);
  const intervalId = ref(0);
  const maxTime = ref(DEFAULT_MAX_TIME);

  // Initialize alarm sound utility
  const alarmSound = createAlarmSound();

  const formattedTime = computed(() => {
    const date = new Date(timeLeft.value * 1000);
    return format(date, "mm:ss");
  });

  function startTimer(seconds: number = DEFAULT_MAX_TIME) {
    if (isRunning.value) return;

    timeLeft.value = seconds;
    maxTime.value = seconds;
    isRunning.value = true;

    if (intervalId.value) {
      clearInterval(intervalId.value);
    }

    intervalId.value = window.setInterval(() => {
      timeLeft.value--;

      if (timeLeft.value <= 0) {
        stopTimer();
        alarmSound.play();
      }
    }, 1000);
  }

  function stopTimer() {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = 0;
    }
    alarmSound.stop();
    timeLeft.value = 0;
    isRunning.value = false;
    maxTime.value = DEFAULT_MAX_TIME;
  }

  function addTime(time = 15) {
    const left = timeLeft.value + time;
    timeLeft.value = left;
    if (left > maxTime.value) {
      maxTime.value = left;
    }
  }

  function reduceTime(time = 15) {
    const left = timeLeft.value - time;
    timeLeft.value = left < 0 ? 0 : left;
  }

  return {
    timeLeft,
    isRunning,
    maxTime,
    formattedTime,
    startTimer,
    stopTimer,
    addTime,
    reduceTime,
  };
});
