import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  and,
} from "firebase/firestore";

export interface WorkoutHistory {
  id: string;
  workout: Workout;
  createdAt: Date;
  updatedAt: Date;
}

export const useHistoryStore = defineStore("history", () => {
  const queryCache = useQueryCache();
  const profileStore = useProfileStore();

  const activeProfileId = computed(() => profileStore.active?.id);

  const { data: histories } = useQuery<WorkoutHistory[]>({
    key: () => ["histories", activeProfileId.value || ""],
    query: () => fetchHistories(activeProfileId.value),
  });

  const { mutate: addHistoryTemp } = useMutation({
    mutation: (param: { profile: string; workout: Workout }) =>
      addHistory(param.profile, param.workout),
    onSettled: () => queryCache.invalidateQueries({ key: ["histories"] }),
  });

  function add(workout: Workout) {
    if (!activeProfileId.value) return;

    addHistoryTemp({ profile: activeProfileId.value, workout });
  }

  // history selected for detail view
  // intentionally cleared when page reloads
  const selectedHistory = ref<WorkoutHistory | null>(null);

  return {
    histories,
    add,
    selectedHistory,
  };
});

async function fetchHistories(profile?: string) {
  if (!profile) return [];

  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "histories");
  const uidFilter = where("uid", "==", auth.currentUser?.uid);
  const profileFilter = where("profile", "==", profile);
  const filter = and(uidFilter, profileFilter);
  const snap = await getDocs(query(docRef, filter));
  return snap.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        workout: {
          ...data.workout,
          date: data.workout.date.toDate(),
        },
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } satisfies WorkoutHistory;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function addHistory(profile: string, workout: Workout) {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "histories");
  await addDoc(docRef, {
    workout,
    profile,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
