import { format } from "date-fns";

/**
 * Format workout history into a shareable text format
 */
export function formatWorkoutForSharing(history: WorkoutHistory): string {
  const { workout } = history;
  const date = format(workout.date, "d MMM yyyy, HH:mm");
  let shareText = `${workout.name} (${date})\n\n`;

  shareText += workout.exercises
    .map((exercise) => {
      let exerciseText = `${exercise.name}:\n`;

      exerciseText += exercise.sets
        .map((set, index) => {
          let setText = `${index + 1}. ${set.weight} kg x ${set.reps} reps`;
          if (set.type === "warmup") setText += " (Warm up set)";
          if (set.type === "drop") setText += " (Drop set)";

          setText += "\n";

          return setText;
        })
        .join("");

      exerciseText += "\n";

      return exerciseText;
    })
    .join("");

  return shareText;
}

/**
 * Share workout history via Web Share API or copy to clipboard
 */
export async function shareWorkout(history: WorkoutHistory): Promise<void> {
  const text = formatWorkoutForSharing(history);
  const toast = useToast();

  try {
    if (navigator.share) {
      // Web Share API is supported
      await navigator.share({
        title: history.workout.name,
        text: text,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(text);
      toast.add({ description: "Workout copied to clipboard!" });
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }

    toast.add({ description: "Failed to copy workout to clipboard." });
  }
}
