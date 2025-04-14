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
    <UModal
      v-model:open="modalOpen"
      title="New exercise"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton>Add new exercise</UButton>
      <template #body>
        <form id="form" @submit.prevent="addExercise">
          <UFormField label="Exercise name">
            <UInput v-model="name" class="w-full" />
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
      <li
        v-for="i in exerciseStore.exercises"
        :key="i.id"
        class="flex justify-between"
      >
        {{ i.name }}
        <UButton
          variant="link"
          color="error"
          @click="exerciseStore.remove(i.id)"
        >
          Delete
        </UButton>
      </li>
    </ul>
  </div>
</template>
