<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const routineStore = useRoutineStore();
const exerciseStore = useExerciseStore();
const activeSessionStore = useActiveSessionStore();
const router = useRouter();

const routineName = ref("");
const routineExercises = ref<string[]>([]);
const modalRoutineOpen = ref(false);

const defaultRoutineOptions: DropdownMenuItem[] = [
  {
    label: "New routine",
    icon: "uil:plus",
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
  activeSessionStore.startNewSession(name, exercises);
  router.push("/active-session");
}
</script>

<template>
  <div>
    <UModal
      v-model:open="modalRoutineOpen"
      title="New routine"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="onNewRoutine">
          <UFormField label="Routine name">
            <UInput v-model="routineName" class="w-full" />
          </UFormField>
          <UFormField label="Exercises" class="mt-4">
            <USelectMenu
              v-model="routineExercises"
              class="w-full"
              label-key="name"
              value-key="id"
              multiple
              :items="exerciseStore.exercises"
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
    <UDropdownMenu :items="routineOptions" :content="{ align: 'start' }">
      <UButton>Track new workout</UButton>
    </UDropdownMenu>
  </div>
</template>
