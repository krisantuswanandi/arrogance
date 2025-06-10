<script setup lang="ts">
import type { WorkoutExercise } from "~/stores/workout";

defineProps<{
  exercise: WorkoutExercise;
  exerciseIndex: number;
}>();

const isRecordModalOpen = ref(false);
</script>

<template>
  <div class="border-b border-(--ui-border) py-6">
    <div class="flex items-center gap-1">
      <div class="text-sm font-bold">{{ exercise.name }}</div>
      <UButton
        class="text-(--ui-text-dimmed)"
        icon="lucide:info"
        variant="ghost"
        color="neutral"
        @click="isRecordModalOpen = true"
      />
    </div>

    <div
      v-if="exercise.notes"
      class="text-sm text-(--ui-text-dimmed) whitespace-pre-line mb-4"
    >
      {{ exercise.notes }}
    </div>

    <div>
      <HistorySetItem
        v-for="(_set, setIndex) in exercise.sets"
        :key="setIndex"
        :exercise="exercise"
        :set-index="setIndex"
      />
    </div>

    <RecordModal
      v-model:open="isRecordModalOpen"
      :exercise-id="exercise.id"
      :exercise-name="exercise.name"
    />
  </div>
</template>
