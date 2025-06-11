<script setup lang="ts">
interface Emits {
  (e: "close"): void;
}

const emit = defineEmits<Emits>();
const timerStore = useTimerStore();

function cancelTimer() {
  timerStore.stopTimer();
  emit("close");
}

// Auto-close timer when it reaches zero
watch(
  () => timerStore.timeLeft,
  (newTime) => {
    if (newTime <= 0 && !timerStore.isRunning) {
      setTimeout(() => {
        emit("close");
      }, 1000);
    }
  }
);

onMounted(() => {
  timerStore.startTimer();
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
                  :disabled="!timerStore.isRunning"
                  @click="timerStore.reduceTime()"
                >
                  -15
                </UButton>
                <div class="text-xl font-semibold">
                  {{ timerStore.formattedTime }}
                </div>
                <UButton
                  variant="ghost"
                  :disabled="!timerStore.isRunning"
                  @click="timerStore.addTime()"
                >
                  +15
                </UButton>
              </div>
              <div class="rounded-full bg-(--ui-bg-accented) w-full mt-2">
                <div
                  class="h-1 bg-(--ui-primary) transition-transform duration-300 origin-left rounded-full"
                  :style="`transform: scaleX(${
                    timerStore.timeLeft / timerStore.maxTime
                  })`"
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
