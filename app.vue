<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

initFirebase();

const route = useRoute();
const router = useRouter();
const ready = ref(false);
const accountStore = useAccountStore();

accountStore.onLoad((user) => {
  if (route.name === "login" && !!user) {
    router.push("/");
  } else if (route.name !== "login" && !user) {
    router.push("/login");
  }

  ready.value = true;
});
</script>

<template>
  <UApp>
    <Analytics />
    <AppSplash v-if="!ready" />
    <AppContainer v-else class="min-h-dvh">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </AppContainer>
  </UApp>
</template>
