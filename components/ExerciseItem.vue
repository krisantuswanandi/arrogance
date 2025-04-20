<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  name: string;
}>();

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "edit", name: string): void;
}>();

const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const newName = ref("");

const options: DropdownMenuItem[][] = [
  [
    {
      label: "Edit",
      onSelect() {
        newName.value = props.name;
        editModalOpen.value = true;
      },
    },
  ],
  [
    {
      label: "Delete",
      color: "error",
      onSelect() {
        deleteModalOpen.value = true;
      },
    },
  ],
];

function editExercise() {
  if (!newName.value) return;

  emit("edit", newName.value);
  newName.value = "";
  editModalOpen.value = false;
}
</script>

<template>
  <div
    class="flex items-center justify-between py-1 border-b border-(--ui-border-muted)"
  >
    <span>{{ name }}</span>
    <UDropdownMenu :items="options" :content="{ align: 'end' }">
      <UButton
        icon="lucide:ellipsis-vertical"
        variant="ghost"
        color="neutral"
        size="lg"
      />
    </UDropdownMenu>
  </div>
  <UModal
    v-model:open="editModalOpen"
    title="Edit exercise"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="form" @submit.prevent="editExercise">
        <UFormField label="Exercise name">
          <UInput v-model="newName" autofocus class="w-full" />
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
    title="Delete exercise"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p class="text-sm text-(--ui-text-muted)">
        Deleting this exercise will remove all data associated with it, such as
        previous log and best records. Are you sure you want to delete this
        exercise?
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
