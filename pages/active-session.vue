<script setup lang="ts">
const exerciseStore = useExerciseStore();

interface Set {
  weight: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

const newExercise = ref("");
const exercises = ref<Exercise[]>([
  {
    id: "1",
    name: "Bench Press",
    sets: [
      { weight: 0, reps: 0 },
      { weight: 0, reps: 0 },
    ],
  },
]);

function addExercise() {
  if (newExercise.value === "") return;

  const exercise = exerciseStore.exercises.find(
    (exercise) => exercise.id === newExercise.value
  )!;

  exercises.value.push({
    id: exercise.id,
    name: exercise.name,
    sets: [{ weight: 0, reps: 0 }],
  });

  newExercise.value = "";
}

function addSet(exercise: Exercise) {
  exercise.sets.push({ weight: 0, reps: 0 });
}
</script>

<template>
  <div>
    <div>Push Day</div>
    <div>{{ new Date().toDateString() }}</div>
    <div>
      <div v-for="exercise in exercises" :key="exercise.id" class="mt-8">
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
        <UButton class="mt-2" @click="addSet(exercise)">
          <UIcon name="uil:plus" />
          Add set
        </UButton>
      </div>
    </div>
    <div class="mt-8">
      <USelect
        v-model="newExercise"
        :items="exerciseStore.exercises"
        label-key="name"
        value-key="id"
        class="w-full"
      />
      <UButton class="mt-2" @click="addExercise">Add exercise</UButton>
    </div>
  </div>
</template>
