<template>
  <div>
    <AppHeader>
      <slot name="header" />
    </AppHeader>
    <main class="px-4 pt-16 pb-4">
      <slot />
    </main>
  </div>
</template>
