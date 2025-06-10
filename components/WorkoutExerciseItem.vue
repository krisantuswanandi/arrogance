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
      | "move-exercise-up"
      | "move-exercise-down"
  ): void;
  (e: "add-notes", param: string): void;
}>();

const isRecordModalOpen = ref(false);
const isNotesModalOpen = ref(false);

const notes = ref("");

const dropdownItems = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: props.exercise.notes ? "Edit notes" : "Add notes",
        onSelect: () => {
          isNotesModalOpen.value = true;
          notes.value = props.exercise.notes || "";
        },
      },
      {
        label: "Change exercise",
        onSelect: () => emit("change-exercise"),
      },
      {
        label: "Move exercise up",
        onSelect: () => emit("move-exercise-up"),
      },
      {
        label: "Move exercise down",
        onSelect: () => emit("move-exercise-down"),
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

function saveNotes() {
  isNotesModalOpen.value = false;
  emit("add-notes", notes.value);
}
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
      class="text-xs text-(--ui-text-dimmed) whitespace-pre-wrap"
    >
      {{ exercise.notes }}
    </div>
    <div class="flex gap-2 mt-4 text-xs text-(--ui-text-dimmed) font-semibold">
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

    <UModal
      v-model:open="isNotesModalOpen"
      :title="exercise.notes ? 'Edit notes' : 'Add notes'"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="saveNotes">
          <UFormField label="Notes">
            <UTextarea
              v-model="notes"
              placeholder="Add description or notes here"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton
          variant="outline"
          color="neutral"
          @click="isNotesModalOpen = false"
        >
          Cancel
        </UButton>
        <UButton type="submit" form="form">Save</UButton>
      </template>
    </UModal>
  </div>
</template>
