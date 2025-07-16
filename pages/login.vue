<script setup lang="ts">
definePageMeta({
  layout: false,
});

const accountStore = useAccountStore();
const router = useRouter();

const isLoading = ref(false);

async function login(type = "") {
  try {
    isLoading.value = true;

    let user;
    switch (type) {
      case "google":
        user = await accountStore.loginWithGoogle();
        break;
      default:
        user = await accountStore.loginAnonymously();
    }

    if (user) router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <NuxtLayout name="blank">
    <div class="min-h-dvh flex items-center justify-center p-4">
      <div class="w-48">
        <UButton
          size="lg"
          block
          :disabled="isLoading"
          variant="outline"
          color="neutral"
          @click="login('google')"
        >
          <Icon name="i-logos-google-icon" />
          Login with Google
        </UButton>

        <UButton
          size="lg"
          block
          variant="link"
          color="neutral"
          class="underline underline-offset-4 opacity-60"
          :loading="isLoading"
          @click="login()"
        >
          Skip for now
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>
