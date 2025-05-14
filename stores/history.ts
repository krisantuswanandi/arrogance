import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface History {
  id: string;
  workout: Workout;
  createdAt: Date;
  updatedAt: Date;
}

export const useHistoryStore = defineStore("history", () => {
  const queryCache = useQueryCache();
  const profileStore = useProfileStore();

  const { data: histories } = useQuery<History[]>({
    key: ["histories"],
    query: () => fetchHistories(),
  });

  const { mutate: addHistoryTemp } = useMutation({
    mutation: (param: { profile: string; workout: Workout }) =>
      addHistory(param.profile, param.workout),
    onSettled: () => queryCache.invalidateQueries({ key: ["histories"] }),
  });

  function add(workout: Workout) {
    if (!profileStore.active) return;

    addHistoryTemp({ profile: profileStore.active.id, workout });
  }

  return {
    histories,
    add,
  };
});

async function fetchHistories() {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "histories");
  const filter = where("uid", "==", auth.currentUser?.uid);
  const snap = await getDocs(query(docRef, filter));
  return snap.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        workout: {
          ...data.workout,
          date: new Date(data.workout.date.seconds),
        },
        createdAt: new Date(data.createdAt.seconds),
        updatedAt: new Date(data.updatedAt.seconds),
      } satisfies History;
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
