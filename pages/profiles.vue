<script setup lang="ts">
const profileStore = useProfileStore();
const name = ref("");
const modalOpen = ref(false);

function addProfile() {
  if (name.value === "") return;

  profileStore.add(name.value);
  name.value = "";
  modalOpen.value = false;
}
</script>

<template>
  <div>
    <UModal
      v-model:open="modalOpen"
      title="New profile"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton>Create new profile</UButton>
      <template #body>
        <form
          id="form"
          class="flex items-center gap-4"
          @submit.prevent="addProfile"
        >
          <label for="abc" class="text-sm">Profile name</label>
          <UInput id="abc" v-model="name" class="flex-1" />
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
        v-for="i in profileStore.profiles"
        :key="i.id"
        class="flex justify-between"
      >
        <span>
          {{ i.name }}
          <span
            v-if="i.id === profileStore.active?.id"
            class="text-green-600 text-sm"
          >
            (Active)
          </span>
        </span>
        <span>
          <UButton
            variant="link"
            color="neutral"
            :disabled="i.id === profileStore.active?.id"
            @click="profileStore.setActive(i.id)"
          >
            Switch
          </UButton>
          <UButton
            variant="link"
            color="error"
            :disabled="i.id === profileStore.active?.id"
            @click="profileStore.remove(i.id)"
          >
            Delete
          </UButton>
        </span>
      </li>
    </ul>
  </div>
</template>
