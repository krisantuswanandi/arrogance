<script setup lang="ts">
const profileStore = useProfileStore();
</script>

<template>
  <header class="p-4 flex items-center justify-between">
    <div>[LOGO HERE]</div>
    <USelect
      :model-value="profileStore.active.id"
      :items="profileStore.profiles"
      label-key="name"
      value-key="id"
      class="w-30"
      @update:model-value="profileStore.setActive($event)"
    />
  </header>
</template>
