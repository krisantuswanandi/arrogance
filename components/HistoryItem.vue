<script setup lang="ts">
import { format } from "date-fns";

defineProps<{
  history: WorkoutHistory;
}>();
</script>

<template>
  <div
    class="block border border-(--ui-border-muted)/30 rounded p-2 mt-4 bg-(--ui-bg-muted)/50"
  >
    <div class="font-bold">{{ history.workout.name }}</div>
    <div class="text-xs text-(--ui-text-muted)">
      {{ format(history.workout.date, "d MMM yyyy") }}
    </div>
  </div>
</template>
