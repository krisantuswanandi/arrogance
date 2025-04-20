<script setup lang="ts">
defineProps<{
  icon?: string;
  label: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
<template>
  <div class="h-12">
    <div class="fixed bottom-14 left-0 w-full z-50">
      <AppContainer class="p-4 flex justify-end">
        <UButton :icon="icon" class="shadow-lg" @click="emit('click')">
          {{ label }}
        </UButton>
      </AppContainer>
    </div>
  </div>
</template>
