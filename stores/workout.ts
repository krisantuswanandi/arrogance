interface Set {
  weight: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  name: string;
  date: Date;
  exercises: Exercise[];
}

export const useWorkoutStore = defineStore("workout", () => {
  const exerciseStore = useExerciseStore();
  const historyStore = useHistoryStore();

  const workout = ref<Workout | undefined>();

  function startNewSession(name: string, exerciseIds: string[]) {
    workout.value = {
      name,
      date: new Date(),
      exercises: [],
    };
    addExercises(exerciseIds);
  }

  function addExercises(ids: string | string[]) {
    if (!workout.value) return;
    if (!Array.isArray(ids)) ids = [ids];

    const exercises = workout.value.exercises;

    ids.forEach((id) => {
      const exercise = createNewExercise(id);
      exercises.push(exercise);
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

  function finishWorkout() {
    if (!workout.value) return;
    const data = workout.value;
    historyStore.add(data);
    workout.value = undefined;
  }

  return {
    workout,
    startNewSession,
    addExercises,
    addSetToExercise,
    finishWorkout,
  };
});
