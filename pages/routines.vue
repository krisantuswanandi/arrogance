<script setup lang="ts">
const routineStore = useRoutineStore();
const exerciseStore = useExerciseStore();

const name = ref("");
const exercises = ref<string[]>([]);
const modalRoutineOpen = ref(false);

function addRoutine() {
  if (!name.value || !exercises.value.length) return;

  routineStore.add(name.value, exercises.value);
  name.value = "";
  exercises.value = [];
  modalRoutineOpen.value = false;
}
</script>

<template>
  <div>
    <h1 class="text-sm font-semibold">Routines</h1>
    <ul class="mt-4">
      <li v-for="r in routineStore.routines" :key="r.id" class="mt-4">
        <RoutineItem
          :name="r.name"
          :exercises="r.exercises"
          @edit="routineStore.edit(r.id, $event.name, $event.exercises)"
          @delete="routineStore.remove(r.id)"
        />
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
  </div>
</template>
