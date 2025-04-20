<script setup lang="ts">
const routineStore = useRoutineStore();
const exerciseStore = useExerciseStore();

const name = ref("");
const exercises = ref<string[]>([]);
const modalRoutineOpen = ref(false);
const selectedRoutine = ref("");
const modalExerciseOpen = computed(() => !!selectedRoutine.value);

function addRoutine() {
  if (!name.value || !exercises.value.length) return;

  routineStore.add(name.value, exercises.value);
  name.value = "";
  exercises.value = [];
  modalRoutineOpen.value = false;
}

function addExercises() {
  if (!selectedRoutine.value) return;
  if (!exercises.value.length) return;

  routineStore.updateExercises(selectedRoutine.value, exercises.value);
  exercises.value = [];
  selectedRoutine.value = "";
}

function selectRoutine(routineId: string, existingExercises: string[]) {
  selectedRoutine.value = routineId;
  exercises.value = existingExercises;
}
</script>

<template>
  <div>
    <UModal
      v-model:open="modalRoutineOpen"
      title="New routine"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton>Add new routine</UButton>
      <template #body>
        <form id="form" @submit.prevent="addRoutine">
          <UFormField label="Routine name">
            <UInput v-model="name" autofocus class="w-full" />
          </UFormField>
          <UFormField label="Exercises" class="mt-4">
            <USelectMenu
              v-model="exercises"
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
    <UModal
      v-model:open="modalExerciseOpen"
      title="Update exercises"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="addExercises">
          <UFormField label="Exercises">
            <USelectMenu
              v-model="exercises"
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
          @click="selectedRoutine = ''"
        >
          Cancel
        </UButton>
        <UButton type="submit" form="form">Save</UButton>
      </template>
    </UModal>
    <ul class="mt-8">
      <li
        v-for="routine in routineStore.routines"
        :key="routine.id"
        class="mt-8"
      >
        <div class="p-2 border border-gray-300 rounded">
          <div class="flex justify-between">
            <span class="font-bold">{{ routine.name }}</span>
            <UButton
              variant="link"
              color="error"
              @click="routineStore.remove(routine.id)"
            >
              Delete
            </UButton>
          </div>
          <ol v-if="routine.exercises.length" class="my-2">
            <li v-for="exercise in routine.exercises" :key="exercise.id">
              <span>{{ exercise.name }}</span>
            </li>
          </ol>
          <UButton
            class="mt-2"
            @click="
              selectRoutine(
                routine.id,
                routine.exercises.map((e) => e.id)
              )
            "
          >
            Update exercises
          </UButton>
        </div>
      </li>
    </ul>
  </div>
</template>
