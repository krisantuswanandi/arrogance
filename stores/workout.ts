export type WorkoutSetType = "normal" | "drop" | "warmup";
export interface WorkoutSet {
  weight: number;
  reps: number;
  type?: WorkoutSetType;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  name: string;
  date: Date;
  notes: string;
  exercises: WorkoutExercise[];
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

    exerciseIds.forEach((id) => addExercise(id));
  }

  function addExercise(
    id: string,
    options?: {
      targetExercise: WorkoutExercise;
      position: "before" | "after";
    }
  ) {
    if (!workout.value) return;

    const exercise = createNewExercise(id);
    const exercises = workout.value.exercises;

    if (!options) {
      exercises.push(exercise);
      return;
    }

    const index = exercises.indexOf(options.targetExercise);
    if (index !== -1) {
      const insertIndex = options.position === "before" ? index : index + 1;
      exercises.splice(insertIndex, 0, exercise);
    }
  }

  function createNewExercise(id: string): WorkoutExercise {
    const exercise = exerciseStore.exercises!.find(
      (exercise) => exercise.id === id
    )!;

    return {
      id: exercise.id,
      name: exercise.name,
      sets: [{ weight: 0, reps: 0, type: "normal" }],
    };
  }

  function removeExercise(exercise: WorkoutExercise) {
    if (!workout.value) return;

    const index = workout.value.exercises.indexOf(exercise);
    if (index !== -1) {
      workout.value.exercises.splice(index, 1);
    }
  }

  function addSetToExercise(
    exercise: WorkoutExercise,
    type: WorkoutSetType = "normal"
  ) {
    exercise.sets.push({ weight: 0, reps: 0, type });
  }

  function removeLastSetFromExercise(exercise: WorkoutExercise) {
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
    addExercise,
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
