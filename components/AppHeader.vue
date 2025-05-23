<template>
  <header
    class="fixed top-0 left-0 w-full bg-(--ui-bg) z-50 border-b border-(--ui-border-muted)"
  >
    <AppContainer class="px-4 h-12 flex items-center justify-between">
      <slot />
    </AppContainer>
  </header>
</template>
