import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

export interface ExerciseRecord {
  bestSet: WorkoutSet;
  lastSets: WorkoutSet[];
  lastNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExerciseRecords = Record<string, ExerciseRecord>;

export const useRecordStore = defineStore("record", () => {
  const queryCache = useQueryCache();
  const profileStore = useProfileStore();

  const activeProfileId = computed(() => profileStore.active?.id);

  const { data: records, refresh } = useQuery({
    key: () => ["records", activeProfileId.value || ""],
    query: () => fetchRecords(activeProfileId.value),
  });

  const { mutate: updateRecordsTemp } = useMutation({
    mutation: (param: {
      profile: string;
      workout: Workout;
      records?: ExerciseRecords;
    }) => updateRecords(param.profile, param.workout, param.records),
    onSettled: () => {
      refresh();
      queryCache.invalidateQueries({
        key: ["records", activeProfileId.value || ""],
      });
    },
  });

  function update(workout: Workout) {
    if (!activeProfileId.value) return;

    updateRecordsTemp({
      profile: activeProfileId.value,
      workout,
      records: records.value,
    });
  }

  return {
    records,
    update,
  };
});

async function fetchRecords(profile?: string) {
  const records: ExerciseRecords = {};

  if (!profile) return records;

  const db = getFirestore();
  const docRef = collection(db, "profiles", profile, "records");
  const snap = await getDocs(docRef);
  snap.docs.forEach((doc) => {
    const data = doc.data();

    records[doc.id] = {
      bestSet: data.bestSet,
      lastSets: data.lastSets,
      lastNotes: data.lastNotes,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } satisfies ExerciseRecord;
  });

  return records;
}

async function updateRecords(
  profile: string,
  workout: Workout,
  records?: ExerciseRecords
) {
  const db = getFirestore();

  const recordsUpdate = workout.exercises.map((exercise) => {
    const lastRecord = records ? records[exercise.id] : null;

    const docRef = doc(db, "profiles", profile, "records", exercise.id);
    setDoc(docRef, {
      bestSet: getBestSet(exercise.sets, lastRecord?.bestSet),
      lastSets: exercise.sets,
      lastNotes: exercise.notes,
      createdAt: lastRecord?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await Promise.all(recordsUpdate);
}

function getBestSet(currentSets: WorkoutSet[], currentBest?: WorkoutSet) {
  const combinedSets = [...(currentBest ? [currentBest] : []), ...currentSets];
  const sortedSets = combinedSets.sort((a, b) => {
    if (b.weight === a.weight) {
      return b.reps - a.reps;
    }
    return b.weight - a.weight;
  });
  return sortedSets[0];
}
