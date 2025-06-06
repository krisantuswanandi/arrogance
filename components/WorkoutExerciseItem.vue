<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  exercise: WorkoutExercise;
}>();

const emit = defineEmits<{
  (
    e:
      | "add-set"
      | "remove-set"
      | "remove-exercise"
      | "add-exercise-before"
      | "add-exercise-after"
      | "add-drop-set"
      | "change-exercise"
  ): void;
}>();

const isRecordModalOpen = ref(false);

const dropdownItems = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: "Change exercise",
        onSelect: () => emit("change-exercise"),
      },
      {
        label: "Add exercise before",
        onSelect: () => emit("add-exercise-before"),
      },
      {
        label: "Add exercise after",
        onSelect: () => emit("add-exercise-after"),
      },
      {
        label: "Add drop set",
        onSelect: () => emit("add-drop-set"),
      },
    ],
    [
      {
        label: "Delete exercise",
        color: "error",
        onSelect: () => emit("remove-exercise"),
      },
      {
        label: "Delete set",
        color: "error",
        disabled: props.exercise.sets.length <= 1,
        onSelect: () => emit("remove-set"),
      },
    ],
  ];
});
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
    <div class="flex gap-2 mt-2 text-xs text-(--ui-text-dimmed) font-semibold">
      <div class="w-8">Set</div>
      <div class="flex-1">Weight</div>
      <div class="flex-1">Reps</div>
    </div>
    <div>
      <WorkoutSetItem
        v-for="(_set, i) in exercise.sets"
        :key="i"
        :exercise="exercise"
        :set-index="i"
      />
    </div>
    <div class="flex gap-1 mt-2">
      <UButton
        class="flex-1 justify-center bg-(--ui-bg-elevated)"
        variant="soft"
        @click="emit('add-set')"
      >
        <UIcon name="lucide:plus" />
        Add set
      </UButton>
      <UDropdownMenu :items="dropdownItems" :content="{ align: 'end' }">
        <UButton
          class="px-2 justify-center bg-(--ui-bg-elevated)"
          icon="lucide:ellipsis-vertical"
          variant="soft"
          color="neutral"
        />
      </UDropdownMenu>
    </div>

    <RecordModal
      v-model:open="isRecordModalOpen"
      :exercise-id="exercise.id"
      :exercise-name="exercise.name"
    />
  </div>
</template>
