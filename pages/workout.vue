<script setup lang="ts">
definePageMeta({
  layout: false,
});

type ModalExerciseData = {
  targetExercise: WorkoutExercise;
  position: "before" | "after";
};

type ChangeExerciseData = {
  exercise: WorkoutExercise;
};

const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const timerStore = useTimerStore();
const router = useRouter();
const toast = useToast();

const modalExerciseOpen = ref(false);
const modalExerciseData = ref<ModalExerciseData | undefined>();
const changeExerciseModalOpen = ref(false);
const changeExerciseData = ref<ChangeExerciseData | undefined>();
const editWorkoutModalOpen = ref(false);
const editWorkoutForm = ref({ name: "", notes: "", focus: "" });
const timerOpen = ref(timerStore.isRunning);

const newExerciseName = ref("");
const newExerciseLoading = ref(false);
const newExerciseMode = ref("");

onMounted(() => {
  if (!workoutStore.workout) router.push("/");
});

const workout = computed(() => workoutStore.workout);

const newOption = {
  id: "new",
  name: "New exercise",
  icon: "lucide:plus",
};

// Filter out exercises that are already in the workout
const availableExercises = computed(() => {
  if (!workout.value) return [];
  if (!exerciseStore.exercises) return [];

  const workoutExerciseIds = workout.value.exercises.map((ex) => ex.id);
  const filteredExercises = exerciseStore.exercises.filter(
    (ex) => !workoutExerciseIds.includes(ex.id)
  );

  return [[newOption], filteredExercises];
});

// Get all exercises for the change exercise modal
// For changing exercise, we want to show all exercises except those already in the workout
const allExercisesExceptCurrent = computed(() => {
  if (!exerciseStore.exercises) return [];
  if (!changeExerciseData.value || !workout.value) return [];

  // Get all exercise IDs that are currently in the workout except the one being changed
  const newExerciseId = changeExerciseData.value.exercise.id;
  const workoutExerciseIds = workout.value.exercises
    .filter((ex) => ex.id !== newExerciseId)
    .map((ex) => ex.id);

  // Only show exercises that aren't already in the workout
  const filteredExercises = exerciseStore.exercises.filter(
    (ex) => !workoutExerciseIds.includes(ex.id)
  );

  return [[newOption], filteredExercises];
});

watch(workout, (val) => {
  if (!val) router.push("/");
});

function cancelWorkout() {
  workoutStore.cancelWorkout();
  router.push("/");
}

function finishWorkout() {
  workoutStore.finishWorkout();
  router.push("/");
}

function openAddExercise(
  targetExercise: WorkoutExercise,
  position: "before" | "after"
) {
  modalExerciseOpen.value = true;
  modalExerciseData.value = { targetExercise, position };
}

function handleExerciseSelect(exerciseId: string) {
  if (!exerciseId) return;

  if (exerciseId === "new") {
    modalExerciseOpen.value = false;
    openNewExerciseModal("add");
    return;
  }

  workoutStore.addExercise(exerciseId, modalExerciseData.value);

  modalExerciseOpen.value = false;
  modalExerciseData.value = undefined;
}

function openChangeExercise(exercise: WorkoutExercise) {
  changeExerciseModalOpen.value = true;
  changeExerciseData.value = { exercise };
}

function handleChangeExercise(newExerciseId: string) {
  if (!newExerciseId || !changeExerciseData.value) return;

  if (newExerciseId === "new") {
    changeExerciseModalOpen.value = false;
    openNewExerciseModal("change");
    return;
  }

  workoutStore.changeExercise(changeExerciseData.value.exercise, newExerciseId);

  changeExerciseModalOpen.value = false;
  changeExerciseData.value = undefined;
}

function openEditWorkoutModal(focusTarget = "name") {
  if (!workout.value) return;

  // Reset form data with current workout values
  editWorkoutForm.value = {
    name: workout.value.name,
    notes: workout.value.notes,
    focus: focusTarget,
  };

  editWorkoutModalOpen.value = true;
}

function saveWorkoutEdit() {
  if (!workout.value) return;

  // Update workout name and notes
  workout.value.name = editWorkoutForm.value.name;
  workout.value.notes = editWorkoutForm.value.notes;

  editWorkoutModalOpen.value = false;
}

function openNewExerciseModal(mode: string) {
  newExerciseMode.value = mode;
  newExerciseName.value = "";
  newExerciseLoading.value = false;
}

async function addNewExercise(name: string, mode: string) {
  newExerciseLoading.value = true;

  const newExerciseId = await exerciseStore.add(name.trim());

  if (!newExerciseId) {
    newExerciseLoading.value = false;
    return;
  }

  try {
    if (mode === "add") {
      handleExerciseSelect(newExerciseId);
    } else if (mode === "change") {
      handleChangeExercise(newExerciseId);
    }
  } catch {
    logFirebase("workout_error", {
      message: "Failed to add new exercise on workout page",
    });
    toast.add({
      description: `New exercise '${name}' is successfully created, but failed to add to workout. Please refresh the page and try again`,
      color: "error",
    });
  } finally {
    newExerciseMode.value = "";
    newExerciseName.value = "";
  }
}
</script>

<template>
  <div v-if="workout">
    <NuxtLayout name="blank">
      <template #header>
        <div class="h-12 flex items-center gap-1">
          <UButton
            variant="ghost"
            size="xs"
            color="neutral"
            @click="router.push('/')"
          >
            <UIcon name="lucide:arrow-left" size="20" />
          </UButton>
          <div class="text-sm font-bold">Current Workout</div>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            variant="ghost"
            size="xs"
            color="neutral"
            @click="timerOpen = true"
          >
            <UIcon name="lucide:timer" size="16" />
          </UButton>
          <UButton
            variant="ghost"
            size="xs"
            color="neutral"
            @click="openEditWorkoutModal()"
          >
            <UIcon name="lucide:pencil" size="16" />
          </UButton>
        </div>
      </template>
      <div class="border-b border-(--ui-border) pb-4">
        <div class="font-bold" @click="openEditWorkoutModal()">
          {{ workout.name }}
        </div>
        <div class="text-sm mt-1" @click="openEditWorkoutModal('notes')">
          <div
            v-if="workout.notes"
            class="text-(--ui-text-muted) whitespace-pre-wrap"
          >
            {{ workout.notes }}
          </div>
          <div v-else class="text-(--ui-text-dimmed)/75 italic">
            Add description or notes here
          </div>
        </div>
      </div>
      <div>
        <WorkoutExerciseItem
          v-for="exercise in workout.exercises"
          :key="exercise.id"
          :exercise="exercise"
          @add-set="workoutStore.addSetToExercise(exercise)"
          @remove-set="workoutStore.removeLastSetFromExercise(exercise)"
          @remove-exercise="workoutStore.removeExercise(exercise)"
          @add-exercise-before="openAddExercise(exercise, 'before')"
          @add-exercise-after="openAddExercise(exercise, 'after')"
          @add-drop-set="workoutStore.addSetToExercise(exercise, 'drop')"
          @change-exercise="openChangeExercise(exercise)"
          @move-exercise-up="workoutStore.moveExercise(exercise, 'up')"
          @move-exercise-down="workoutStore.moveExercise(exercise, 'down')"
          @add-notes="exercise.notes = $event"
        />
      </div>
      <div class="mt-8 flex justify-center">
        <UButton class="px-12" @click="modalExerciseOpen = true">
          <UIcon name="lucide:plus" />
          Add exercise
        </UButton>
      </div>
      <div class="mt-16 py-8 flex flex-col justify-center items-center">
        <UButton class="mt-2 px-8" @click="finishWorkout">
          Finish Workout
        </UButton>
        <UButton
          class="mt-2 px-8"
          variant="ghost"
          color="error"
          @click="cancelWorkout"
        >
          Cancel Workout
        </UButton>
      </div>

      <UModal v-model:open="modalExerciseOpen" title="Add exercise">
        <template #body>
          <div
            v-if="availableExercises.length === 0"
            class="text-center py-4 text-(--ui-text-muted)"
          >
            All exercises have been added
          </div>
          <USelectMenu
            v-else
            class="w-full"
            label-key="name"
            value-key="id"
            create-item
            :items="availableExercises"
            :search-input="{
              placeholder: 'Search exercises...',
              autofocus: true,
            }"
            @update:model-value="handleExerciseSelect"
            @create="addNewExercise($event, 'add')"
          />
        </template>
      </UModal>

      <UModal v-model:open="changeExerciseModalOpen" title="Change exercise">
        <template #body>
          <div
            v-if="allExercisesExceptCurrent.length === 0"
            class="text-center py-4 text-(--ui-text-muted)"
          >
            No other exercises available
          </div>
          <USelectMenu
            v-else
            class="w-full"
            label-key="name"
            value-key="id"
            create-item
            :items="allExercisesExceptCurrent"
            :search-input="{
              placeholder: 'Search exercises...',
              autofocus: true,
            }"
            @update:model-value="handleChangeExercise"
            @create="addNewExercise($event, 'change')"
          />
        </template>
      </UModal>

      <UModal
        v-model:open="editWorkoutModalOpen"
        title="Edit workout"
        :ui="{ footer: 'justify-end' }"
      >
        <template #body>
          <form id="form" @submit.prevent="saveWorkoutEdit">
            <UFormField label="Name">
              <UInput
                v-model="editWorkoutForm.name"
                :autofocus="editWorkoutForm.focus === 'name'"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Notes" class="mt-4">
              <UTextarea
                v-model="editWorkoutForm.notes"
                :autofocus="editWorkoutForm.focus === 'notes'"
                class="w-full"
              />
            </UFormField>
          </form>
        </template>
        <template #footer>
          <UButton
            variant="outline"
            color="neutral"
            @click="editWorkoutModalOpen = false"
          >
            Cancel
          </UButton>
          <UButton type="submit" form="form">Save</UButton>
        </template>
      </UModal>

      <UModal
        :open="!!newExerciseMode"
        title="Create exercise"
        :ui="{ footer: 'justify-end' }"
        @update:open="newExerciseMode = ''"
      >
        <template #body>
          <form
            id="form"
            @submit.prevent="addNewExercise(newExerciseName, newExerciseMode)"
          >
            <UFormField label="Name">
              <UInput v-model="newExerciseName" class="w-full" />
            </UFormField>
          </form>
        </template>
        <template #footer>
          <UButton
            type="submit"
            form="form"
            block
            :loading="newExerciseLoading"
          >
            Save
          </UButton>
        </template>
      </UModal>

      <WorkoutTimer v-if="timerOpen" @close="timerOpen = false" />
    </NuxtLayout>
  </div>
</template>
