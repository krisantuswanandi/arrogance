<script setup lang="ts">
const accountStore = useAccountStore();
const profileStore = useProfileStore();

const isLoading = ref(false);

const name = ref("");
const modalOpen = ref(false);

const profiles = computed(() => profileStore.profiles);
const activeProfile = computed(() => profileStore.active);

const account = computed(() => accountStore.account?.providerData.at(0));

async function link() {
  try {
    isLoading.value = true;

    await accountStore.linkToGoogle();
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    isLoading.value = false;
  }
}

function addProfile() {
  if (!name.value) return;

  profileStore.add(name.value);
  name.value = "";
  modalOpen.value = false;
}

async function logout() {
  try {
    isLoading.value = true;

    await accountStore.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div>
      <h1 class="text-sm font-semibold">Account</h1>
      <div
        v-if="account"
        class="mt-2 border border-(--ui-border-muted) rounded-lg p-2 flex items-center gap-2"
      >
        <NuxtImg
          v-if="account.photoURL"
          :src="account.photoURL"
          :alt="account.displayName || account.email || ''"
          class="rounded-full"
        />
        <div>
          <div class="font-semibold">{{ account.displayName }}</div>
          <div class="text-sm text-(--ui-text-dimmed)">{{ account.email }}</div>
        </div>
      </div>
      <div v-else class="mt-2">
        <UButton
          size="lg"
          block
          :disabled="isLoading"
          variant="outline"
          color="neutral"
          @click="link"
        >
          <Icon name="i-logos-google-icon" />
          Link to Google
        </UButton>
        <div class="mt-1 text-xs text-(--ui-text-dimmed) italic">
          Link your account to Google so you won't lose your data.
        </div>
      </div>
    </div>
    <div class="mt-6">
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
    </div>
    <div class="mt-12 text-center">
      <UButton
        variant="ghost"
        color="error"
        :disabled="isLoading"
        @click="logout"
      >
        Sign Out
      </UButton>
    </div>
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
