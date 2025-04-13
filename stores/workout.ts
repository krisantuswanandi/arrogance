export interface Workout {
  id: string;
  routineId: string;
}

export const useWorkoutStore = defineStore("workout", () => {
  const workouts = ref<Workout[]>([]);

  function add(routineId: string) {
    const id = crypto.randomUUID();
    workouts.value.push({ id, routineId });
  }

  function remove(id: string) {
    const index = workouts.value.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      workouts.value.splice(index, 1);
    }
  }

  return {
    workouts,
    add,
    remove,
  };
});
