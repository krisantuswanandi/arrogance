<script setup lang="ts">
const exerciseStore = useExerciseStore();

const props = defineProps<{
  name: string;
  exercises: Exercise[];
}>();

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "edit", param: { name: string; exercises: string[] }): void;
}>();

const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const newName = ref("");
const newExercises = ref<string[]>([]);

const options = computed(() => {
  return [
    [
      {
        label: "Edit",
        onSelect() {
          newName.value = props.name;
          newExercises.value = props.exercises.map((e) => e.id);
          editModalOpen.value = true;
        },
      },
      {
        label: "Delete",
        color: "error",
        onSelect() {
          deleteModalOpen.value = true;
        },
      },
    ],
  ];
});

function editRoutine() {
  if (!newName.value || !newExercises.value.length) return;

  emit("edit", { name: newName.value, exercises: newExercises.value });
  newName.value = "";
  newExercises.value = [];
  editModalOpen.value = false;
}
</script>

<template>
  <div class="p-1 border border-(--ui-border-muted) rounded">
    <div class="flex justify-between items-center">
      <span class="pl-2 font-bold">{{ name }}</span>
      <UDropdownMenu :items="options" :content="{ align: 'end' }">
        <UButton
          icon="lucide:ellipsis-vertical"
          variant="ghost"
          color="neutral"
          size="lg"
        />
      </UDropdownMenu>
    </div>
    <ol v-if="exercises.length" class="pl-6 py-2">
      <li
        v-for="exercise in exercises"
        :key="exercise.id"
        class="text-sm list-disc"
      >
        <span>{{ exercise.name }}</span>
      </li>
    </ol>
  </div>
  <UModal
    v-model:open="editModalOpen"
    title="Edit routine"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="form" @submit.prevent="editRoutine">
        <UFormField label="Routine name">
          <UInput v-model="newName" autofocus class="w-full" />
        </UFormField>
        <UFormField label="Exercises" class="mt-4">
          <USelectMenu
            v-model="newExercises"
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
      <UButton variant="outline" color="neutral" @click="editModalOpen = false">
        Cancel
      </UButton>
      <UButton type="submit" form="form">Save</UButton>
    </template>
  </UModal>
  <UModal
    v-model:open="deleteModalOpen"
    title="Delete routine"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p class="text-sm text-(--ui-text-muted)">
        Are you sure you want to delete this routine?
      </p>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        color="neutral"
        @click="deleteModalOpen = false"
      >
        Cancel
      </UButton>
      <UButton color="error" @click="emit('delete')">Delete</UButton>
    </template>
  </UModal>
</template>
