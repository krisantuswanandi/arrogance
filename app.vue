<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<template>
  <UApp>
    <Analytics />
    <div class="bg-gray-50 w-full max-w-xl m-auto min-h-dvh">
      <AppHeader />
      <AppNav />
      <div class="p-4">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>
