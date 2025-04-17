<script setup lang="ts">
const activeSessionStore = useActiveSessionStore();
const exerciseStore = useExerciseStore();

const newExercises = ref<string[]>([]);

function addExercises() {
  if (!newExercises.value.length) return;

  activeSessionStore.addExercises(newExercises.value);
  newExercises.value = [];
}
</script>

<template>
  <div>
    <div class="font-bold">
      {{ activeSessionStore.sessionName }}
    </div>
    <div class="text-sm">
      {{ activeSessionStore.sessionDate.toDateString() }}
    </div>
    <div>
      <div
        v-for="exercise in activeSessionStore.sessionExercises"
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
        <UButton
          class="mt-2"
          @click="activeSessionStore.addSetToExercise(exercise)"
        >
          <UIcon name="uil:plus" />
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
  </div>
</template>
