<script setup lang="ts">
interface Emits {
  (e: "close"): void;
}

const emit = defineEmits<Emits>();

const DEFAULT_MAX_TIME = 2;

const timeLeft = ref(DEFAULT_MAX_TIME);
const isRunning = ref(true);
const intervalId = ref(0);
const maxTime = ref(DEFAULT_MAX_TIME);

// Initialize alarm sound utility
const alarm = useAlarm();

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

function startTimer(seconds: number) {
  timeLeft.value = seconds;
  isRunning.value = true;

  intervalId.value = window.setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value <= 0) {
      stopTimer();
      alarm.play();

      setTimeout(() => {
        emit("close");
      }, 1000);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId.value);
  alarm.stop();
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

function cancelTimer() {
  emit("close");
}

onMounted(() => {
  startTimer(DEFAULT_MAX_TIME);
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <Teleport to="body">
    <div class="fixed left-0 right-0 bottom-4 z-50">
      <AppContainer>
        <div class="w-full px-4">
          <div
            class="bg-(--ui-bg) border border-(--ui-border) rounded-lg shadow-lg p-2 flex items-center gap-2"
          >
            <div class="flex-1">
              <div class="flex justify-center items-center gap-2">
                <UButton
                  variant="ghost"
                  :disabled="!isRunning"
                  @click="reduceTime()"
                >
                  -15
                </UButton>
                <div class="text-3xl font-semibold">
                  {{ formattedTime }}
                </div>
                <UButton
                  variant="ghost"
                  :disabled="!isRunning"
                  @click="addTime()"
                >
                  +15
                </UButton>
              </div>
              <div class="rounded-full bg-(--ui-bg-accented) w-full mt-1">
                <div
                  class="h-1 bg-(--ui-primary)"
                  :style="{ width: `${(timeLeft / maxTime) * 100}%` }"
                />
              </div>
            </div>
            <UButton color="neutral" class="h-11" @click="cancelTimer">
              Cancel
            </UButton>
          </div>
        </div>
      </AppContainer>
    </div>
  </Teleport>
</template>
