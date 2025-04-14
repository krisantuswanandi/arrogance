<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const routineStore = useRoutineStore();
const exerciseStore = useExerciseStore();

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
    routineStore.routines.map((routine) => ({ label: routine.name })),
    defaultRoutineOptions,
  ];
});

function addRoutine() {
  if (!routineName.value || !routineExercises.value.length) return;

  routineStore.add(routineName.value, routineExercises.value);
  routineName.value = "";
  routineExercises.value = [];
  modalRoutineOpen.value = false;
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
        <form id="form" @submit.prevent="addRoutine">
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
