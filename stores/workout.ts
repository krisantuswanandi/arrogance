interface ExerciseSet {
  weight: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface Workout {
  name: string;
  date: Date;
  notes: string;
  exercises: Exercise[];
}

export type Workouts = Record<string, Workout | undefined>;

export const useWorkoutStore = defineStore("workout", () => {
  const exerciseStore = useExerciseStore();
  const historyStore = useHistoryStore();
  const profileStore = useProfileStore();
  const recordStore = useRecordStore();

  const workoutByUser = useLocalStorage<Workouts>(
    "active-workout",
    {},
    { serializer: workoutSerializer() }
  );

  const workout = computed(() => {
    if (!profileStore.active) return;

    return workoutByUser.value[profileStore.active.id];
  });

  function startNewSession(name: string, exerciseIds: string[]) {
    if (!profileStore.active) return;

    workoutByUser.value[profileStore.active.id] = {
      name,
      date: new Date(),
      notes: "",
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
    const exercise = exerciseStore.exercises!.find(
      (exercise) => exercise.id === id
    )!;

    return {
      id: exercise.id,
      name: exercise.name,
      sets: [{ weight: 0, reps: 0 }],
    };
  }

  function removeExercise(exercise: Exercise) {
    if (!workout.value) return;

    const index = workout.value.exercises.indexOf(exercise);
    if (index !== -1) {
      workout.value.exercises.splice(index, 1);
    }
  }

  function addSetToExercise(exercise: Exercise) {
    exercise.sets.push({ weight: 0, reps: 0 });
  }

  function removeLastSetFromExercise(exercise: Exercise) {
    if (exercise.sets.length > 0) {
      exercise.sets.pop();
    }
  }

  function finishWorkout() {
    if (!workout.value) return;

    const data = workout.value;
    historyStore.add(data);
    recordStore.update(data);

    workoutByUser.value[profileStore.active!.id] = undefined;
  }

  function cancelWorkout() {
    workoutByUser.value[profileStore.active!.id] = undefined;
  }

  return {
    workout,
    startNewSession,
    addExercises,
    removeExercise,
    addSetToExercise,
    removeLastSetFromExercise,
    finishWorkout,
    cancelWorkout,
  };
});

type SerializedWorkout = Omit<Workout, "date"> & { date: string };

type SerializedWorkouts = Record<string, SerializedWorkout | undefined>;

function workoutSerializer() {
  return {
    read: (v: string) => {
      const parsed = JSON.parse(v) as SerializedWorkouts;
      const deserialized: Workouts = {};

      for (const [key, workout] of Object.entries(parsed)) {
        if (!workout) continue;

        deserialized[key] = {
          ...workout,
          date: new Date(workout.date),
        };
      }

      return deserialized;
    },
    write: (v: Workouts) => {
      const serialized: SerializedWorkouts = {};

      for (const [key, workout] of Object.entries(v)) {
        if (!workout) continue;

        serialized[key] = {
          ...workout,
          date: workout.date.toISOString(),
        };
      }

      return JSON.stringify(serialized);
    },
  };
}
