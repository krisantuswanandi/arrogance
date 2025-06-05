<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const routineStore = useRoutineStore();
const exerciseStore = useExerciseStore();
const workoutStore = useWorkoutStore();
const historyStore = useHistoryStore();
const router = useRouter();

const routineName = ref("");
const routineExercises = ref<string[]>([]);
const modalRoutineOpen = ref(false);

const defaultRoutineOptions: DropdownMenuItem[] = [
  {
    label: "Custom workout",
    icon: "lucide:plus",
    onSelect() {
      modalRoutineOpen.value = true;
    },
  },
];

const routineOptions = computed<DropdownMenuItem[][]>(() => {
  if (!routineStore.routines.length) return [defaultRoutineOptions];

  return [
    routineStore.routines.map((routine) => ({
      label: routine.name,
      onSelect() {
        startNewSession(
          routine.name,
          routine.exercises.map((e) => e.id)
        );
      },
    })),
    defaultRoutineOptions,
  ];
});

function onNewRoutine() {
  if (!routineName.value || !routineExercises.value.length) return;

  startNewSession(routineName.value, routineExercises.value);
}

function startNewSession(name: string, exercises: string[]) {
  workoutStore.startNewSession(name, exercises);
  router.push("/workout");
}

function openHistoryDetail(history: WorkoutHistory) {
  historyStore.selectedHistory = history;
  router.push("/history");
}
</script>

<template>
  <div>
    <h1 class="text-sm font-semibold">Histories</h1>
    <ol class="mt-4">
      <li v-for="history in historyStore.histories" :key="history.id">
        <HistoryItem
          :history="history"
          @click="openHistoryDetail(history)"
          @delete="historyStore.remove(history.id)"
        />
      </li>
    </ol>
    <FloatingButton>
      <UButton v-if="workoutStore.workout" icon="lucide:play" to="/workout">
        Continue workout
      </UButton>
      <UDropdownMenu
        v-else
        :items="routineOptions"
        :content="{ align: 'end', side: 'top' }"
      >
        <UButton icon="lucide:play">Start workout</UButton>
      </UDropdownMenu>
    </FloatingButton>
    <UModal
      v-model:open="modalRoutineOpen"
      title="New routine"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="onNewRoutine">
          <UFormField label="Routine name">
            <UInput v-model="routineName" autofocus class="w-full" />
          </UFormField>
          <UFormField label="Exercises" class="mt-4">
            <USelectMenu
              v-model="routineExercises"
              class="w-full"
              label-key="name"
              value-key="id"
              multiple
              :items="exerciseStore.exercises"
              :search-input="{ autofocus: false }"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton
          variant="outline"
          color="neutral"
          @click="modalRoutineOpen = false"
        >
          Cancel
        </UButton>
        <UButton type="submit" form="form">Save</UButton>
      </template>
    </UModal>
  </div>
</template>
