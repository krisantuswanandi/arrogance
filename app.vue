<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

const { isActive: isSplashActive } = useSplash();
const accountStore = useAccountStore();

initFirebase();
</script>

<template>
  <UApp>
    <Analytics />
    <AppSplash v-if="isSplashActive" />
    <AppContainer v-if="!!accountStore.account" class="min-h-dvh">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </AppContainer>
  </UApp>
</template>
