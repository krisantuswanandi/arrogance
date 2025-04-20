export interface Exercise {
  id: string;
  name: string;
}

export const useExerciseStore = defineStore("exercise", () => {
  const exercises = ref<Exercise[]>(defaultExercises);

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
    exercises,
    add,
    edit,
    remove,
  };
});

const defaultExercises: Exercise[] = [
  { id: "1", name: "Push Up" },
  { id: "2", name: "Pull Up" },
  { id: "3", name: "Squat" },
  { id: "4", name: "Deadlift" },
  { id: "5", name: "Bench Press" },
  { id: "6", name: "Overhead Press" },
  { id: "7", name: "Lunges" },
  { id: "8", name: "Plank" },
  { id: "9", name: "Burpees" },
  { id: "10", name: "Mountain Climbers" },
  { id: "11", name: "Jumping Jacks" },
  { id: "12", name: "High Knees" },
  { id: "13", name: "Sit Ups" },
  { id: "14", name: "Leg Raises" },
  { id: "15", name: "Russian Twists" },
  { id: "16", name: "Bicycle Crunches" },
  { id: "17", name: "Tricep Dips" },
  { id: "18", name: "Lateral Raises" },
  { id: "19", name: "Bicep Curls" },
  { id: "20", name: "Leg Press" },
  { id: "21", name: "Calf Raises" },
  { id: "22", name: "Chest Fly" },
  { id: "23", name: "Shoulder Shrugs" },
  { id: "24", name: "Cable Rows" },
  { id: "25", name: "Lat Pulldowns" },
  { id: "26", name: "Face Pulls" },
  { id: "27", name: "Seated Rows" },
  { id: "28", name: "Leg Extensions" },
  { id: "29", name: "Leg Curls" },
  { id: "30", name: "Hip Thrusts" },
  { id: "31", name: "Glute Bridges" },
  { id: "32", name: "Side Lunges" },
  { id: "33", name: "Box Jumps" },
  { id: "34", name: "Kettlebell Swings" },
];
