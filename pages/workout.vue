<script setup lang="ts">
definePageMeta({
  layout: false,
});

const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const router = useRouter();

const newExercises = ref<string[]>([]);

onMounted(() => {
  if (!workoutStore.workout) router.push("/");
});

const workout = computed(() => workoutStore.workout);

watch(workout, (val) => {
  if (!val) router.push("/");
});

function addExercises() {
  if (!newExercises.value.length) return;

  workoutStore.addExercises(newExercises.value);
  newExercises.value = [];
}

function cancelWorkout() {
  workoutStore.cancelWorkout();
  router.push("/");
}

function finishWorkout() {
  workoutStore.finishWorkout();
  router.push("/");
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
      <div class="font-bold">
        {{ workout.name }}
      </div>
      <div class="text-sm">
        {{ workout.date.toDateString() }}
      </div>
      <div>
        <div
          v-for="exercise in workout.exercises"
          :key="exercise.id"
          class="mt-8"
        >
          <div class="font-bold">{{ exercise.name }}</div>
          <div class="flex gap-2 mt-2">
            <div class="w-8">Set</div>
            <div class="flex-1">Weight</div>
            <div class="flex-1">Reps</div>
          </div>
          <div>
            <div
              v-for="(set, i) in exercise.sets"
              :key="i"
              class="flex gap-2 mt-2"
            >
              <div class="w-8">{{ i + 1 }}</div>
              <UInput
                v-model="set.weight"
                type="number"
                class="flex-1"
                placeholder="Weight"
              />
              <UInput
                v-model="set.reps"
                type="number"
                class="flex-1"
                placeholder="Reps"
              />
              <UButton
                variant="ghost"
                color="error"
                :disabled="exercise.sets.length < 2"
              >
                <UIcon name="lucide:trash" />
              </UButton>
            </div>
          </div>
          <UButton
            class="mt-2"
            @click="workoutStore.addSetToExercise(exercise)"
          >
            <UIcon name="lucide:plus" />
            Add set
          </UButton>
        </div>
      </div>
      <div class="mt-8">
        <USelect
          v-model="newExercises"
          :items="exerciseStore.exercises"
          label-key="name"
          value-key="id"
          class="w-full"
          multiple
        />
        <UButton class="mt-2" @click="addExercises">Add exercises</UButton>
      </div>
      <div class="mt-8 py-8 flex flex-col justify-center items-center">
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
    </NuxtLayout>
  </div>
</template>
