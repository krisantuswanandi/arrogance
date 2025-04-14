<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const profileStore = useProfileStore();

const profileName = ref("");
const modalProfileOpen = ref(false);

const defaultProfileOptions: DropdownMenuItem[] = [
  {
    label: "New profile",
    icon: "uil:plus",
    onSelect() {
      modalProfileOpen.value = true;
    },
  },
];

const profileOptions = computed<DropdownMenuItem[][]>(() => {
  if (!profileStore.profiles.length) return [defaultProfileOptions];

  return [
    profileStore.profiles.map((profile) => ({
      label: profile.name,
      onSelect() {
        profileStore.setActive(profile.id);
      },
    })),
    defaultProfileOptions,
  ];
});

function addProfile() {
  if (!profileName.value) return;

  profileStore.add(profileName.value, true);
  profileName.value = "";
  modalProfileOpen.value = false;
}
</script>

<template>
  <header class="p-4 flex items-center justify-between">
    <div>[LOGO HERE]</div>
    <UDropdownMenu :items="profileOptions" :content="{ align: 'start' }">
      <UButton variant="outline" color="neutral">
        {{ profileStore.active.name }}
      </UButton>
    </UDropdownMenu>
    <UModal
      v-model:open="modalProfileOpen"
      title="New profile"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="addProfile">
          <UFormField label="Profile name">
            <UInput v-model="profileName" class="w-full" />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton
          variant="outline"
          color="neutral"
          @click="modalProfileOpen = false"
        >
          Cancel
        </UButton>
        <UButton type="submit" form="form">Save</UButton>
      </template>
    </UModal>
  </header>
</template>
