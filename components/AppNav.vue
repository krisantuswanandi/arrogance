<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const navigationItems = ref<NavigationMenuItem[]>([
  { label: "Home", to: "/", icon: "lucide:house" },
  { label: "Routine", to: "/routines", icon: "lucide:clipboard-list" },
  { label: "Exercise", to: "/exercises", icon: "lucide:dumbbell" },
  { label: "Profile", to: "/profiles", icon: "lucide:user-round" },
]);
</script>

<template>
  <div
    class="fixed bottom-0 left-0 w-full bg-(--ui-bg) z-50 border-t border-(--ui-border-muted)"
  >
    <AppContainer>
      <UNavigationMenu
        :items="navigationItems"
        highlight
        class="px-4 block"
        :ui="{ item: 'flex-1 p-0', link: 'flex flex-col items-center gap-0' }"
      >
        <template #item="{ item }">
          <span class="p-1 flex">
            <UIcon :name="item.icon!" size="20" />
          </span>
          <span class="text-xs">{{ item.label }}</span>
        </template>
      </UNavigationMenu>
    </AppContainer>
  </div>
</template>
