import { format } from "date-fns";

const DEFAULT_TIMER_DURATION = 120_000;

export const useTimerStore = defineStore("timer", () => {
  const timeLeft = ref(0);
  const isRunning = ref(false);
  const animationId = ref(0);
  const duration = ref(0);
  const progressLimit = ref(0);
  const startTime = ref(0);

  // Initialize alarm sound utility
  const alarmSound = createAlarmSound();

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  // Show notification when timer completes
  const showTimerNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Rest Timer Complete", {
        body: "Time to get back to your workout!",
        icon: "/logo.svg",
        tag: "workout-timer",
        requireInteraction: true,
      });
    }
  };

  const formattedTime = computed(() => {
    const date = new Date(timeLeft.value);
    return format(date, "mm:ss");
  });

  function updateTimer(currentTime: number) {
    if (!isRunning.value) return;

    const elapsed = Math.floor(currentTime - startTime.value);
    const remaining = Math.max(0, duration.value - elapsed);

    timeLeft.value = remaining;
    if (remaining <= 0) {
      stopTimer();
      alarmSound.play();
      showTimerNotification();
    } else {
      animationId.value = requestAnimationFrame(updateTimer);
    }
  }

  function startTimer(_duration = DEFAULT_TIMER_DURATION) {
    if (isRunning.value) return;

    timeLeft.value = _duration;
    duration.value = _duration;
    progressLimit.value = _duration;
    startTime.value = performance.now();
    isRunning.value = true;

    if (animationId.value) {
      cancelAnimationFrame(animationId.value);
    }

    animationId.value = requestAnimationFrame(updateTimer);
  }

  function stopTimer() {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value);
      animationId.value = 0;
    }
    alarmSound.stop();
    timeLeft.value = 0;
    isRunning.value = false;
    duration.value = DEFAULT_TIMER_DURATION;
    progressLimit.value = DEFAULT_TIMER_DURATION;
    startTime.value = 0;
  }

  function addTime(time = 15_000) {
    progressLimit.value = Math.max(
      DEFAULT_TIMER_DURATION,
      timeLeft.value + time
    );
    startTime.value += time;
  }

  function reduceTime(time = 15_000) {
    startTime.value -= time;
  }

  return {
    timeLeft,
    isRunning,
    duration,
    progressLimit,
    formattedTime,
    startTimer,
    stopTimer,
    addTime,
    reduceTime,
    requestNotificationPermission,
    showTimerNotification,
  };
});
