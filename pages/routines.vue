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

function editRoutine() {
  if (!selectedRoutine.value) return;
  if (!name.value || !exercises.value.length) return;

  routineStore.edit(selectedRoutine.value, name.value, exercises.value);
  name.value = "";
  exercises.value = [];
  selectedRoutine.value = "";
}

function selectRoutine(
  routineId: string,
  routineName: string,
  existingExercises: string[],
) {
  name.value = routineName;
  exercises.value = existingExercises;
  selectedRoutine.value = routineId;
}
</script>

<template>
  <div>
    <h1 class="text-sm font-semibold">Routines</h1>
    <ul class="mt-4">
      <li
        v-for="routine in routineStore.routines"
        :key="routine.id"
        class="mt-4"
      >
        <div class="p-2 border border-(--ui-border-muted) rounded">
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
                routine.name,
                routine.exercises.map((e) => e.id),
              )
            "
          >
            Update
          </UButton>
        </div>
      </li>
    </ul>
    <FloatingButton>
      <UButton
        icon="lucide:plus"
        class="shadow-lg"
        @click="modalRoutineOpen = true"
      >
        New routine
      </UButton>
    </FloatingButton>
    <UModal
      v-model:open="modalRoutineOpen"
      title="New routine"
      :ui="{ footer: 'justify-end' }"
    >
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
        <form id="form" @submit.prevent="editRoutine">
          <UFormField label="Routine name">
            <UInput v-model="name" autofocus class="w-full" />
          </UFormField>
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
  </div>
</template>
