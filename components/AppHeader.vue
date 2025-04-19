<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const profileStore = useProfileStore();
const colorMode = useColorMode();

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
  <header
    class="fixed top-0 left-0 w-full bg-(--ui-bg) z-50 border-b border-(--ui-border-muted)"
  >
    <div
      class="px-4 py-2 w-full max-w-xl m-auto flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <UIcon name="game-icons:muscle-up" size="24" />
        <span class="font-semibold">Workout Log</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          class="capitalize"
          variant="outline"
          color="neutral"
          @click="
            colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
          "
        >
          {{ colorMode.value }}
        </UButton>
        <UDropdownMenu :items="profileOptions" :content="{ align: 'end' }">
          <UButton
            variant="outline"
            color="neutral"
            trailing-icon="lucide:chevron-down"
          >
            {{ profileStore.active.name }}
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
    <UModal
      v-model:open="modalProfileOpen"
      title="New profile"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="addProfile">
          <UFormField label="Profile name">
            <UInput v-model="profileName" autofocus class="w-full" />
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
