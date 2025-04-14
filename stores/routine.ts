interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export const useRoutineStore = defineStore("routine", () => {
  const routines = ref<Routine[]>([]);

  function add(name: string, exerciseIds: string[]) {
    const id = crypto.randomUUID();
    routines.value.push({ id, name, exerciseIds });
  }

  function remove(id: string) {
    const index = routines.value.findIndex((routine) => routine.id === id);
    if (index !== -1) {
      routines.value.splice(index, 1);
    }
  }

  function updateExercises(routineId: string, exerciseIds: string[]) {
    const routine = routines.value.find((routine) => routine.id === routineId);
    if (routine) {
      routine.exerciseIds = exerciseIds;
    }
  }

  const routinesWithExercises = computed(() => {
    const exerciseStore = useExerciseStore();
    const exercises = exerciseStore.exercises;

    return routines.value.map((routine) => {
      const { exerciseIds, ...rest } = routine;

      return {
        ...rest,
        exercises: exerciseIds
          .map((exerciseId) => {
            const exercise = exercises.find(
              (exercise) => exercise.id === exerciseId
            );
            return exercise;
          })
          .filter((exercise) => !!exercise),
      };
    });
  });

  return {
    routines: routinesWithExercises,
    add,
    updateExercises,
    remove,
  };
});
