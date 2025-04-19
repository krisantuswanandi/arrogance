<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  name: string;
  showActive: boolean;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: "switch" | "delete"): void;
  (e: "edit", name: string): void;
}>();

const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const newName = ref("");

const options = computed(() => {
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
  ];

  if (!props.isActive) {
    options[0].unshift({
      label: "Set active",
      onSelect() {
        emit("switch");
      },
    });

    options.push([
      {
        label: "Delete",
        color: "error",
        onSelect() {
          deleteModalOpen.value = true;
        },
      },
    ]);
  }

  return options;
});

function editProfile() {
  if (!newName.value) return;

  emit("edit", newName.value);
  newName.value = "";
  editModalOpen.value = false;
}
</script>

<template>
  <div class="flex items-center justify-between mt-4">
    <div class="flex items-center gap-2">
      <UAvatar :alt="name" size="md" />
      <span>{{ name }}</span>
      <UIcon
        v-if="showActive && isActive"
        class="text-green-600 text-sm"
        name="lucide:circle-check"
        size="16"
      />
    </div>
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
    title="Edit profile"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="form" @submit.prevent="editProfile">
        <UFormField label="Profile name">
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
    title="Edit profile"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p class="text-sm text-(--ui-text-muted)">
        Deleting a profile will remove all workout history and data associated
        with it. Are you sure you want to delete this profile?
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
      <UButton @click="emit('delete')" color="error">Delete</UButton>
    </template>
  </UModal>
</template>
