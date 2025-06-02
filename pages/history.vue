<script setup lang="ts">
import { format } from "date-fns";

definePageMeta({
  layout: false,
});

const historyStore = useHistoryStore();
const router = useRouter();

const history = computed(() => historyStore.selectedHistory);

onMounted(() => {
  if (!history.value) {
    router.replace("/");
  }
});

function goBack() {
  historyStore.selectedHistory = null;
  router.back();
}
</script>

<template>
  <div v-if="!!history">
    <NuxtLayout name="blank">
      <template #header>
        <div class="h-12 flex items-center gap-1">
          <UButton variant="ghost" size="xs" color="neutral" @click="goBack">
            <UIcon name="lucide:arrow-left" size="20" />
          </UButton>
          <div class="text-sm font-bold">{{ history.workout.name }}</div>
        </div>
      </template>

      <div class="border-b border-(--ui-border) pb-4">
        <div class="font-bold">
          {{ history.workout.name }}
        </div>
        <div class="text-sm">
          {{ format(history.workout.date, "d MMM yyyy, HH:mm") }}
        </div>
      </div>

      <div>
        <HistoryExerciseItem
          v-for="(exercise, exerciseIndex) in history.workout.exercises"
          :key="exercise.id"
          :exercise="exercise"
          :exercise-index="exerciseIndex"
        />
      </div>
    </NuxtLayout>
  </div>
</template>
