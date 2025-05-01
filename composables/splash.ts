export function useSplash() {
  const accountStore = useAccountStore();

  const finished = ref(false);

  onMounted(() => {
    accountStore.login();
    finished.value = false;

    setTimeout(() => {
      finished.value = true;
    }, 1000);
  });

  const isActive = computed(() => {
    return !finished.value || !accountStore.account;
  });

  return {
    isActive,
  };
}
