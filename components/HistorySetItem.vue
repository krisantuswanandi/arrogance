<script setup lang="ts">
import type { WorkoutExercise } from "~/stores/workout";

const props = defineProps<{
  exercise: WorkoutExercise;
  setIndex: number;
}>();

const currentSet = computed(() => props.exercise.sets[props.setIndex]);

const setNumber = computed(() => {
  let count = 0;
  for (let i = 0; i <= props.setIndex; i++) {
    if (
      !props.exercise.sets[i].type || // Backwards compatibility
      props.exercise.sets[i].type === "normal"
    ) {
      count++;
    }
  }
  return count;
});
</script>

<template>
  <div class="flex items-center gap-2 mt-2">
    <div
      class="flex items-center justify-center bg-(--ui-bg-muted) w-6 h-6 rounded text-xs"
    >
      <UIcon
        v-if="currentSet.type === 'drop'"
        name="lucide:arrow-down-right"
        class="text-(--ui-text-dimmed)"
      />
      <UIcon
        v-else-if="currentSet.type === 'warmup'"
        name="lucide:flame"
        class="text-(--ui-text-dimmed)"
      />
      <span v-else>{{ setNumber }}</span>
    </div>
    <div>
      {{ currentSet.weight }}
      <span class="text-(--ui-text-muted)">kg x</span>
      {{ currentSet.reps }}
      <span class="text-(--ui-text-muted)">reps</span>
    </div>
  </div>
</template>
