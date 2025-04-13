<script setup lang="ts">
const routineStore = useRoutineStore();
const exerciseStore = useExerciseStore();

const name = ref("");
const exercises = ref<string[]>([]);
const modalOpen = ref(false);

function addRoutine() {
  if (name.value === "" || exercises.value.length === 0) {
    return;
  }

  routineStore.add(name.value, exercises.value);
  name.value = "";
  exercises.value = [];
  modalOpen.value = false;
}
</script>

<template>
  <div>
    <UModal
      v-model:open="modalOpen"
      title="New routine"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton>Add new routine</UButton>
      <template #body>
        <form id="form" @submit.prevent="addRoutine">
          <UFormField label="Routine name">
            <UInput v-model="name" class="w-full" />
          </UFormField>
          <UFormField label="Exercises" class="mt-4">
            <USelectMenu
              v-model="exercises"
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
        <UButton variant="outline" color="neutral" @click="modalOpen = false">
          Cancel
        </UButton>
        <UButton type="submit" form="form">Save</UButton>
      </template>
    </UModal>
    <ul class="mt-8">
      <li v-for="i in routineStore.routines" :key="i.id" class="mt-8">
        <div class="flex justify-between">
          <span class="font-bold">{{ i.name }}</span>
          <UButton
            variant="link"
            color="error"
            @click="routineStore.remove(i.id)"
            >Delete</UButton
          >
        </div>
        <ol>
          <li v-for="j in i.exercises" :key="j.id">
            <span>{{ j.name }}</span>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>
