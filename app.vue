<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<template>
  <UApp>
    <Analytics />
    <AppContainer class="min-h-dvh">
      <AppHeader />
      <AppNav />
      <div class="px-4 pt-16 pb-18">
        <NuxtPage />
      </div>
    </AppContainer>
  </UApp>
</template>
