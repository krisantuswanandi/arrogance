<script setup lang="ts">
import { format } from "date-fns";

defineProps<{
  workout: Workout;
}>();
</script>

<template>
  <div class="border border-(--ui-border-muted) rounded p-2 mt-4">
    <div class="font-bold">{{ workout.name }}</div>
    <div>{{ format(workout.date, "d MMM yyyy, HH:mm") }}</div>
    <div v-for="exercise in workout.exercises" :key="exercise.id" class="mt-4">
      <div class="font-bold">{{ exercise.name }}</div>
      <div>
        <div v-for="(set, i) in exercise.sets" :key="i" class="flex gap-2">
          <div class="w-4">{{ i + 1 }}.</div>
          <div>{{ set.weight }} x {{ set.reps }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
