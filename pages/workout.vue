<script setup lang="ts">
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

function finishWorkout() {
  workoutStore.finishWorkout();
  router.push("/");
}
</script>

<template>
  <div v-if="workout">
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
          <div class="flex-1">Previous</div>
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
              model-value="20 x 12"
              class="flex-1"
              placeholder="Weight"
              disabled
            />
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
          </div>
        </div>
        <UButton class="mt-2" @click="workoutStore.addSetToExercise(exercise)">
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
    <div class="mt-8 text-center">
      <UButton class="mt-2" @click="finishWorkout">Finish Workout</UButton>
    </div>
  </div>
</template>
