<template>
  <div>
    <AppHeader v-if="$slots.header">
      <slot name="header" />
    </AppHeader>
    <main :class="['px-4 pb-4', $slots.header ? 'pt-16' : 'pt-4']">
      <slot />
    </main>
  </div>
</template>
