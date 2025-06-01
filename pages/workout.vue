<script setup lang="ts">
import { format } from "date-fns";

definePageMeta({
  layout: false,
});

type ModalExerciseData = {
  targetExercise: WorkoutExercise;
  position: "before" | "after";
};

const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const router = useRouter();

const modalExerciseOpen = ref<boolean>(false);
const modalExerciseData = ref<ModalExerciseData | undefined>();

onMounted(() => {
  if (!workoutStore.workout) router.push("/");
});

const workout = computed(() => workoutStore.workout);

// Filter out exercises that are already in the workout
const availableExercises = computed(() => {
  if (!workout.value) return [];
  if (!exerciseStore.exercises) return [];

  const workoutExerciseIds = workout.value.exercises.map((ex) => ex.id);
  return exerciseStore.exercises.filter(
    (ex) => !workoutExerciseIds.includes(ex.id)
  );
});

watch(workout, (val) => {
  if (!val) router.push("/");
});

function handleExerciseSelect(exerciseId: string) {
  if (!exerciseId) return;

  workoutStore.addExercise(exerciseId, modalExerciseData.value);

  modalExerciseOpen.value = false;
  modalExerciseData.value = undefined;
}

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
      </template>
      <div class="border-b border-(--ui-border) pb-4">
        <div class="font-bold">
          {{ workout.name }}
        </div>
        <div class="text-sm">
          {{ format(workout.date, "d MMM yyyy, HH:mm") }}
        </div>
      </div>
      <div>
        <WorkoutItem
          v-for="exercise in workout.exercises"
          :key="exercise.id"
          :exercise="exercise"
          @add-set="workoutStore.addSetToExercise(exercise)"
          @remove-set="workoutStore.removeLastSetFromExercise(exercise)"
          @remove-exercise="workoutStore.removeExercise(exercise)"
          @add-exercise-before="openAddExercise(exercise, 'before')"
          @add-exercise-after="openAddExercise(exercise, 'after')"
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
            :items="availableExercises"
            :search-input="{
              placeholder: 'Search exercises...',
              autofocus: true,
            }"
            @update:model-value="handleExerciseSelect"
          />
        </template>
      </UModal>
    </NuxtLayout>
  </div>
</template>
