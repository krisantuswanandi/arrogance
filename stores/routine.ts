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

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const useRoutineStore = defineStore("routine", () => {
  const queryCache = useQueryCache();

  const { data: routines } = useQuery<Routine[]>({
    key: ["routines"],
    query: () => fetchRoutines(),
  });

  const { mutate: addRoutineTemp } = useMutation({
    mutation: (param: { name: string; exerciseIds: string[] }) =>
      addRoutine(param.name, param.exerciseIds),
    onSettled: () => queryCache.invalidateQueries({ key: ["routines"] }),
  });

  const { mutate: editRoutineTemp } = useMutation({
    mutation: (param: { id: string; name: string; exerciseIds: string[] }) =>
      editRoutine(param.id, param.name, param.exerciseIds),
    onSettled: () => queryCache.invalidateQueries({ key: ["routines"] }),
  });

  const { mutate: deleteRoutineTemp } = useMutation({
    mutation: (id: string) => deleteRoutine(id),
    onSettled: () => queryCache.invalidateQueries({ key: ["routines"] }),
  });

  function add(name: string, exerciseIds: string[]) {
    addRoutineTemp({ name, exerciseIds });
  }

  function remove(id: string) {
    deleteRoutineTemp(id);
  }

  function edit(id: string, name: string, exerciseIds: string[]) {
    editRoutineTemp({ id, name, exerciseIds });
  }

  const routinesWithExercises = computed(() => {
    if (!routines.value) return [];

    const exerciseStore = useExerciseStore();
    const exercises = exerciseStore.exercises;

    if (!exercises) return [];

    return routines.value.map((routine) => {
      const { exerciseIds, ...rest } = routine;

      return {
        ...rest,
        exercises: exerciseIds
          .map((exerciseId) => {
            const exercise = exercises.find(
              (exercise) => exercise.id === exerciseId,
            );
            return exercise;
          })
          .filter((exercise) => !!exercise),
      };
    });
  });

  return {
    routines: routinesWithExercises,
    add,
    edit,
    remove,
  };
});

async function fetchRoutines() {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "routines");
  const filter = where("uid", "==", auth.currentUser?.uid);
  const snap = await getDocs(query(docRef, filter));
  return snap.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        exerciseIds: data.exerciseIds,
        createdAt: new Date(data.createdAt.seconds),
        updatedAt: new Date(data.updatedAt.seconds),
      } satisfies Routine;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function addRoutine(name: string, exerciseIds: string[]) {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "routines");
  await addDoc(docRef, {
    name,
    exerciseIds,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

async function editRoutine(id: string, name: string, exerciseIds: string[]) {
  const db = getFirestore();
  const docRef = doc(db, "routines", id);
  await updateDoc(docRef, { name, exerciseIds, updatedAt: serverTimestamp() });
}

async function deleteRoutine(id: string) {
  const db = getFirestore();
  const docRef = doc(db, "routines", id);
  await deleteDoc(docRef);
}
