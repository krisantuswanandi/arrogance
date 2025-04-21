export interface Exercise {
  id: string;
  name: string;
}

export const useExerciseStore = defineStore("exercise", () => {
  const exercises = ref<Exercise[]>(defaultExercises);

  const sortedExercises = computed(() => {
    return exercises.value.toSorted((a, b) => a.name.localeCompare(b.name));
  });

  function add(name: string) {
    const id = crypto.randomUUID();
    exercises.value.push({ id, name });
  }

  function edit(id: string, name: string) {
    const index = exercises.value.findIndex((exercise) => exercise.id === id);
    if (index !== -1) {
      exercises.value[index].name = name;
    }
  }

  function remove(id: string) {
    const index = exercises.value.findIndex((exercise) => exercise.id === id);
    if (index !== -1) {
      exercises.value.splice(index, 1);
    }
  }

  return {
    exercises: sortedExercises,
    add,
    edit,
    remove,
  };
});

const defaultExercises: Exercise[] = [
  { id: "1", name: "Deadlift" },
  { id: "2", name: "Squat" },
  { id: "3", name: "Bench Press" },
];
