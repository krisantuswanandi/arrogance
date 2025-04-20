<script setup lang="ts">
const exerciseStore = useExerciseStore();
const name = ref("");
const modalOpen = ref(false);

function addExercise() {
  if (!name.value) return;

  exerciseStore.add(name.value);
  name.value = "";
  modalOpen.value = false;
}
</script>

<template>
  <div>
    <h1 class="text-sm font-semibold">Exercises</h1>
    <ul class="mt-4">
      <li v-for="i in exerciseStore.exercises" :key="i.id">
        <ExerciseItem
          :name="i.name"
          @edit="exerciseStore.edit(i.id, $event)"
          @delete="exerciseStore.remove(i.id)"
        />
      </li>
    </ul>
    <FloatingButton>
      <UButton icon="lucide:plus" class="shadow-lg" @click="modalOpen = true">
        New exercise
      </UButton>
    </FloatingButton>
    <UModal
      v-model:open="modalOpen"
      title="New exercise"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="addExercise">
          <UFormField label="Exercise name">
            <UInput v-model="name" autofocus class="w-full" />
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
  </div>
</template>
