import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface Exercise {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useExerciseStore = defineStore("exercise", () => {
  const queryCache = useQueryCache();

  const { data: exercises } = useQuery<Exercise[]>({
    key: ["exercises"],
    query: () => fetchExercises(),
  });

  const { mutate: addExerciseTemp } = useMutation({
    mutation: (name: string) => addExercise(name),
    onSettled: () => queryCache.invalidateQueries({ key: ["exercises"] }),
  });

  const { mutate: editExerciseTemp } = useMutation({
    mutation: (param: { id: string; name: string }) =>
      editExercise(param.id, param.name),
    onSettled: () => queryCache.invalidateQueries({ key: ["exercises"] }),
  });

  const { mutate: deleteExerciseTemp } = useMutation({
    mutation: (id: string) => deleteExercise(id),
    onSettled: () => queryCache.invalidateQueries({ key: ["exercises"] }),
  });

  function add(name: string) {
    addExerciseTemp(name);
  }

  function edit(id: string, name: string) {
    editExerciseTemp({ id, name });
  }

  function remove(id: string) {
    deleteExerciseTemp(id);
  }

  return {
    exercises,
    add,
    edit,
    remove,
  };
});

async function fetchExercises() {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "exercises");
  const filter = where("uid", "==", auth.currentUser?.uid);
  const snap = await getDocs(query(docRef, filter));
  return snap.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        createdAt: new Date(data.createdAt.seconds),
        updatedAt: new Date(data.updatedAt.seconds),
      } satisfies Exercise;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function addExercise(name: string) {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "exercises");
  await addDoc(docRef, {
    name,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

async function editExercise(id: string, name: string) {
  const db = getFirestore();
  const docRef = doc(db, "exercises", id);
  await updateDoc(docRef, { name, updatedAt: serverTimestamp() });
}

async function deleteExercise(id: string) {
  const db = getFirestore();
  const docRef = doc(db, "exercises", id);
  await deleteDoc(docRef);
}
