<script setup lang="ts">
import { format } from "date-fns";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  history: WorkoutHistory;
}>();

defineEmits<{
  (e: "click" | "delete"): void;
}>();

const router = useRouter();
const workoutStore = useWorkoutStore();
const routineStore = useRoutineStore();
const historyStore = useHistoryStore();

const hasActiveWorkout = computed(() => !!workoutStore.workout);

const saveAsRoutineModalOpen = ref(false);
const editHistoryModalOpen = ref(false);
const deleteModalOpen = ref(false);
const routineName = ref("");
const editHistoryForm = ref({ name: "", notes: "", focus: "" });

function shareHistory() {
  shareWorkout(props.history);
}

function openEditHistory(focusTarget = "name") {
  // Reset form data with current history values
  editHistoryForm.value = {
    name: props.history.workout.name,
    notes: props.history.workout.notes || "",
    focus: focusTarget,
  };

  editHistoryModalOpen.value = true;
}

function saveHistoryEdit() {
  if (!editHistoryForm.value.name) return;

  historyStore.update(
    props.history.id,
    editHistoryForm.value.name,
    editHistoryForm.value.notes
  );

  editHistoryModalOpen.value = false;
}

const options: DropdownMenuItem[][] = [
  [
    {
      label: "Start workout",
      disabled: hasActiveWorkout.value,
      onSelect() {
        const exerciseIds = props.history.workout.exercises.map((ex) => ex.id);
        workoutStore.startNewSession(props.history.workout.name, exerciseIds);
        router.push("/workout");
      },
    },
    {
      label: "Save as routine",
      onSelect() {
        routineName.value = props.history.workout.name;
        saveAsRoutineModalOpen.value = true;
      },
    },
    {
      label: "Edit",
      onSelect() {
        openEditHistory();
      },
    },
    {
      label: "Share",
      onSelect: shareHistory,
    },
  ],
  [
    {
      label: "Delete",
      color: "error",
      onSelect() {
        deleteModalOpen.value = true;
      },
    },
  ],
];

function saveAsRoutine() {
  if (!routineName.value) return;

  const exerciseIds = props.history.workout.exercises.map((ex) => ex.id);
  routineStore.add(routineName.value, exerciseIds);

  routineName.value = "";
  saveAsRoutineModalOpen.value = false;
}

const truncatedNotes = computed(() => {
  const notes = props.history.workout.notes || "";
  return notes.length > 150 ? notes.slice(0, 150) + "..." : notes;
});
</script>

<template>
  <div
    class="block border border-(--ui-border-muted)/30 rounded p-2 mt-4 bg-(--ui-bg-muted)/50"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-center">
      <div class="font-bold">{{ history.workout.name }}</div>
      <UDropdownMenu :items="options" :content="{ align: 'end' }">
        <UButton
          icon="lucide:ellipsis-vertical"
          variant="ghost"
          color="neutral"
          @click.stop
        />
      </UDropdownMenu>
    </div>
    <div class="text-sm text-(--ui-text-muted)">
      <div>{{ format(history.workout.date, "eeee, d MMM") }}</div>
      <div v-if="truncatedNotes" class="mt-2">{{ truncatedNotes }}</div>
    </div>
  </div>
  <UModal
    v-model:open="saveAsRoutineModalOpen"
    title="Save as routine"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="routineForm" @submit.prevent="saveAsRoutine">
        <UFormField label="Routine name">
          <UInput v-model="routineName" autofocus class="w-full" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        color="neutral"
        @click="saveAsRoutineModalOpen = false"
      >
        Cancel
      </UButton>
      <UButton type="submit" form="routineForm">Save</UButton>
    </template>
  </UModal>
  <UModal
    v-model:open="editHistoryModalOpen"
    title="Edit workout"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="editHistoryForm" @submit.prevent="saveHistoryEdit">
        <UFormField label="Name">
          <UInput
            v-model="editHistoryForm.name"
            :autofocus="editHistoryForm.focus === 'name'"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Notes" class="mt-4">
          <UTextarea
            v-model="editHistoryForm.notes"
            :autofocus="editHistoryForm.focus === 'notes'"
            class="w-full"
          />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        color="neutral"
        @click="editHistoryModalOpen = false"
      >
        Cancel
      </UButton>
      <UButton type="submit" form="editHistoryForm">Save</UButton>
    </template>
  </UModal>
  <UModal
    v-model:open="deleteModalOpen"
    title="Delete history"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p class="text-sm text-(--ui-text-muted)">
        Deleting this item will permanently remove it from your history. This
        action cannot be undone. Are you sure?
      </p>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        color="neutral"
        @click="deleteModalOpen = false"
      >
        Cancel
      </UButton>
      <UButton color="error" @click="$emit('delete')">Delete</UButton>
    </template>
  </UModal>
</template>
