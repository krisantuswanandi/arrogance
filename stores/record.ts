import { getFirestore, collection, getDocs } from "firebase/firestore";
import type { ExerciseSet } from "./workout";

export interface ExerciseRecord {
  bestSet: ExerciseSet;
  lastSets: ExerciseSet[];
  createdAt: Date;
  updatedAt: Date;
}

export const useRecordStore = defineStore("record", () => {
  const profileStore = useProfileStore();

  const activeProfileId = computed(() => profileStore.active?.id);

  const { data: records } = useQuery({
    key: () => ["records", activeProfileId.value || ""],
    query: () => fetchRecords(activeProfileId.value),
  });

  return {
    records,
  };
});

async function fetchRecords(profile?: string) {
  const records: Record<string, ExerciseRecord> = {};

  if (!profile) return records;

  const db = getFirestore();
  const docRef = collection(db, "profiles", profile, "records");
  const snap = await getDocs(docRef);
  snap.docs.forEach((doc) => {
    const data = doc.data();

    records[doc.id] = {
      bestSet: data.bestSet,
      lastSets: data.lastSets,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } satisfies ExerciseRecord;
  });

  return records;
}
