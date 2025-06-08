<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { format } from "date-fns";

const routineStore = useRoutineStore();
const workoutStore = useWorkoutStore();
const historyStore = useHistoryStore();
const router = useRouter();

const defaultRoutineOptions: DropdownMenuItem[] = [
  {
    label: "Custom workout",
    icon: "lucide:plus",
    onSelect() {
      const title = format(new Date(), "dd/MM/yy");
      startNewSession(`Workout ${title}`, []);
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
  </div>
</template>
