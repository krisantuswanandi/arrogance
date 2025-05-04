<script setup lang="ts">
const profileStore = useProfileStore();
const name = ref("");
const modalOpen = ref(false);

function addProfile() {
  if (!name.value) return;

  profileStore.add(name.value);
  name.value = "";
  modalOpen.value = false;
}

const profiles = computed(() => profileStore.profiles);
const activeProfile = computed(() => profileStore.active);
</script>

<template>
  <div>
    <h1 class="text-sm font-semibold">Profiles</h1>
    <ul class="mt-4">
      <li v-for="i in profileStore.profiles" :key="i.id">
        <ProfileItem
          :name="i.name"
          :show-active="profiles ? profiles.length > 1 : false"
          :is-active="i.id === activeProfile?.id"
          @switch="profileStore.setActive(i.id)"
          @edit="profileStore.edit(i.id, $event)"
          @delete="profileStore.remove(i.id)"
        />
      </li>
    </ul>
    <FloatingButton>
      <UButton icon="lucide:plus" class="shadow-lg" @click="modalOpen = true">
        New profile
      </UButton>
    </FloatingButton>
    <UModal
      v-model:open="modalOpen"
      title="New profile"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form id="form" @submit.prevent="addProfile">
          <UFormField label="Profile name">
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
