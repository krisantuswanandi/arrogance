<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<template>
  <UApp>
    <Analytics />
    <div class="w-full max-w-xl m-auto min-h-dvh">
      <AppHeader />
      <AppNav />
      <div class="px-4 pt-16 pb-18">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>
