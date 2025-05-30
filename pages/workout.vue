<script setup lang="ts">
definePageMeta({
  layout: false,
});

const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const router = useRouter();

const selectedExercise = ref<string>();
const modalExerciseOpen = ref(false);

onMounted(() => {
  if (!workoutStore.workout) router.push("/");
});

const workout = computed(() => workoutStore.workout);

watch(workout, (val) => {
  if (!val) router.push("/");
});

watch(selectedExercise, (val) => {
  if (val) {
    workoutStore.addExercises([val]);
    selectedExercise.value = undefined;
    modalExerciseOpen.value = false;
  }
});

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
      <div class="border-b border-(--ui-border) pb-4">
        <div class="font-bold">
          {{ workout.name }}
        </div>
        <div class="text-sm">
          {{ workout.date.toDateString() }}
        </div>
      </div>
      <div>
        <div
          v-for="exercise in workout.exercises"
          :key="exercise.id"
          class="border-b border-(--ui-border) py-6"
        >
          <div class="text-sm font-bold">{{ exercise.name }}</div>
          <div
            class="flex gap-2 mt-2 text-xs text-(--ui-text-muted) font-semibold"
          >
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
              <UInput
                :ui="{ base: 'w-8 bg-(--ui-bg-muted)! text-center' }"
                variant="soft"
                :value="i + 1"
                readonly
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
          <div class="flex gap-1 mt-2">
            <UButton
              class="flex-1 justify-center bg-(--ui-bg-elevated)"
              variant="soft"
              @click="workoutStore.addSetToExercise(exercise)"
            >
              <UIcon name="lucide:plus" />
              Add set
            </UButton>
            <UDropdownMenu
              :items="[
                {
                  label: 'Delete exercise',
                  onSelect() {
                    workoutStore.removeExercise(exercise);
                  },
                },
                {
                  label: 'Delete set',
                  disabled: exercise.sets.length <= 1,
                  onSelect() {
                    workoutStore.removeLastSetFromExercise(exercise);
                  },
                },
              ]"
            >
              <UButton
                class="w-10 justify-center bg-(--ui-bg-elevated)"
                variant="soft"
                color="neutral"
              >
                <UIcon name="lucide:ellipsis-vertical" />
              </UButton>
            </UDropdownMenu>
          </div>
        </div>
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
          <USelectMenu
            v-model="selectedExercise"
            class="w-full"
            label-key="name"
            value-key="id"
            :items="exerciseStore.exercises"
            :search-input="{
              placeholder: 'Search exercises...',
              autofocus: true,
            }"
          />
        </template>
      </UModal>
    </NuxtLayout>
  </div>
</template>
