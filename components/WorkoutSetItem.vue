<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  exercise: WorkoutExercise;
  setIndex: number;
}>();

const currentSet = computed(() => props.exercise.sets[props.setIndex]);

const setNumber = computed(() => {
  let count = 0;
  for (let i = 0; i <= props.setIndex; i++) {
    if (props.exercise.sets[i].type === "normal") {
      count++;
    }
  }
  return count;
});

const setTypes: { type: WorkoutSetType; label: string }[] = [
  { type: "normal", label: "Normal Set" },
  { type: "drop", label: "Drop Set" },
  { type: "warmup", label: "Warm Up Set" },
];

const setTypesOptions = computed((): DropdownMenuItem[] =>
  setTypes.map((setType) => ({
    label: setType.label,
    type: "checkbox",
    checked: currentSet.value.type === setType.type,
    onSelect: () => (currentSet.value.type = setType.type),
  }))
);
</script>

<template>
  <div class="flex gap-2 mt-2">
    <UDropdownMenu :items="setTypesOptions" :content="{ align: 'start' }">
      <UButton
        class="w-8 bg-(--ui-bg-muted)! justify-center"
        variant="soft"
        color="neutral"
        size="sm"
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
      </UButton>
    </UDropdownMenu>
    <UInput
      v-model="currentSet.weight"
      type="number"
      class="flex-1"
      placeholder="Weight"
    />
    <UInput
      v-model="currentSet.reps"
      type="number"
      class="flex-1"
      placeholder="Reps"
    />
  </div>
</template>
