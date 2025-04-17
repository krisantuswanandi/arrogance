interface Set {
  weight: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export const useActiveSessionStore = defineStore("active-session", () => {
  const exerciseStore = useExerciseStore();

  const sessionName = ref("");
  const sessionDate = ref(new Date());
  const sessionExercises = ref<Exercise[]>([]);

  function startNewSession(name: string, exerciseIds: string[]) {
    sessionName.value = name;
    sessionDate.value = new Date();
    sessionExercises.value = [];
    addExercises(exerciseIds);
  }

  function addExercises(ids: string | string[]) {
    if (!Array.isArray(ids)) ids = [ids];

    ids.forEach((id) => {
      const exercise = createNewExercise(id);
      sessionExercises.value.push(exercise);
    });
  }

  function createNewExercise(id: string): Exercise {
    const exercise = exerciseStore.exercises.find(
      (exercise) => exercise.id === id
    )!;

    return {
      id: exercise.id,
      name: exercise.name,
      sets: [{ weight: 0, reps: 0 }],
    };
  }

  function addSetToExercise(exercise: Exercise) {
    exercise.sets.push({ weight: 0, reps: 0 });
  }

  return {
    sessionName,
    sessionDate,
    sessionExercises,
    startNewSession,
    addExercises,
    addSetToExercise,
  };
});
