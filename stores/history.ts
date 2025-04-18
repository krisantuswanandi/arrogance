export interface History {
  id: string;
  workout: Workout;
}

export const useHistoryStore = defineStore("history", () => {
  const histories = ref<History[]>([]);

  function add(workout: Workout) {
    const id = crypto.randomUUID();
    histories.value.unshift({ id, workout });
  }

  return {
    histories,
    add,
  };
});
