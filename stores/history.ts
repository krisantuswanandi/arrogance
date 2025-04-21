export interface History {
  id: string;
  workout: Workout;
}

export const useHistoryStore = defineStore("history", () => {
  const profileStore = useProfileStore();

  const historiesByUser = ref<Record<string, History[] | undefined>>({});

  const histories = computed(() => {
    return historiesByUser.value[profileStore.active.id];
  });

  function add(workout: Workout) {
    const id = crypto.randomUUID();

    if (!histories.value) {
      historiesByUser.value[profileStore.active.id] = [{ id, workout }];
    } else {
      historiesByUser.value[profileStore.active.id]!.unshift({ id, workout });
    }
  }

  return {
    histories,
    add,
  };
});
