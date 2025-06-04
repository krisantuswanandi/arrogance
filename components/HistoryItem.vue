<script setup lang="ts">
import { format } from "date-fns";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  history: WorkoutHistory;
}>();

defineEmits<{
  (e: "click"): void;
}>();

const router = useRouter();
const workoutStore = useWorkoutStore();
const exerciseStore = useExerciseStore();
const routineStore = useRoutineStore();

const hasActiveWorkout = computed(() => !!workoutStore.workout);

const saveAsRoutineModalOpen = ref(false);
const routineName = ref("");

const options: DropdownMenuItem[][] = [
  [
    {
      label: "Start workout",
      disabled: hasActiveWorkout.value,
      onSelect() {
        if (!exerciseStore.exercises) return;

        const historyExercises = props.history.workout.exercises;
        const availableExerciseIds = exerciseStore.exercises.map((ex) => ex.id);

        const hasMissingExercises = historyExercises.some(
          (exercise) => !availableExerciseIds.includes(exercise.id)
        );

        if (hasMissingExercises) {
          alert("Some exercises in this workout no longer exist.");
        } else {
          const exercises = props.history.workout.exercises.map((ex) => ex.id);
          workoutStore.startNewSession(props.history.workout.name, exercises);
          router.push("/workout");
        }
      },
    },
    {
      label: "Save as routine",
      onSelect() {
        routineName.value = props.history.workout.name;
        saveAsRoutineModalOpen.value = true;
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
    <div class="text-xs text-(--ui-text-muted)">
      {{ format(history.workout.date, "d MMM yyyy") }}
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
  </div>
</template>
