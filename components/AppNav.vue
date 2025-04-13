<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const navigationItems = ref<NavigationMenuItem[]>([
  { label: "Tracker", to: "/" },
  { label: "Routine", to: "/routines" },
  { label: "Exercise", to: "/exercises" },
  { label: "Profile", to: "/profiles" },
]);
</script>

<template>
  <UNavigationMenu :items="navigationItems" class="px-4" />
</template>
