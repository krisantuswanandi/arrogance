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

  const { data: exercises, refresh } = useQuery<Exercise[]>({
    key: ["exercises"],
    query: () => fetchExercises(),
  });

  const { mutateAsync: addExerciseTemp } = useMutation({
    mutation: (name: string) => addExercise(name),
    onMutate: (name: string) => {
      const oldExercises = queryCache.getQueryData<Exercise[]>(["exercises"]);
      const newExercise: Exercise = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newExercises: Exercise[] = [...(oldExercises || []), newExercise];
      newExercises.sort((a, b) => a.name.localeCompare(b.name));
      queryCache.setQueryData(["exercises"], newExercises);

      return { oldExercises, newExercises, newExercise };
    },
    onError: (_error, _vars, { oldExercises, newExercises }) => {
      if (newExercises === queryCache.getQueryData<Exercise[]>(["exercises"])) {
        queryCache.setQueryData(["exercises"], oldExercises);
      }
    },
    onSuccess: (data, _vars, { newExercise }) => {
      const currentExercises =
        queryCache.getQueryData<Exercise[]>(["exercises"]) || [];
      const newExerciseIndex = currentExercises.findIndex(
        (t) => t.id === newExercise.id
      );
      if (newExerciseIndex >= 0) {
        const copy = currentExercises.slice();
        copy.splice(newExerciseIndex, 1, data);
        queryCache.setQueryData(["exercises"], copy);
      }
    },
  });

  const { mutateAsync: editExerciseTemp } = useMutation({
    mutation: (param: { id: string; name: string }) =>
      editExercise(param.id, param.name),
    onMutate: (param: { id: string; name: string }) => {
      const oldExercises =
        queryCache.getQueryData<Exercise[]>(["exercises"]) || [];
      const updatedExerciseIndex = oldExercises.findIndex(
        (ex) => ex.id === param.id
      );
      const updatedExercise: Exercise = {
        ...oldExercises[updatedExerciseIndex],
        name: param.name,
        updatedAt: new Date(),
      };
      const newExercises = [...oldExercises];
      newExercises.splice(updatedExerciseIndex, 1, updatedExercise);
      newExercises.sort((a, b) => a.name.localeCompare(b.name));
      queryCache.setQueryData(["exercises"], newExercises);

      return { oldExercises, newExercises };
    },
    onError: (_error, _vars, { oldExercises, newExercises }) => {
      if (newExercises === queryCache.getQueryData<Exercise[]>(["exercises"])) {
        queryCache.setQueryData(["exercises"], oldExercises);
      }
    },
  });

  const { mutateAsync: deleteExerciseTemp } = useMutation({
    mutation: (id: string) => deleteExercise(id),
    onSettled: () => {
      queryCache.invalidateQueries({ key: ["exercises"] });
      refresh();
    },
  });

  async function add(name: string) {
    return addExerciseTemp(name);
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
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } satisfies Exercise;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function addExercise(name: string): Promise<Exercise> {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "exercises");

  const exerciseData = {
    name,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const res = await addDoc(docRef, exerciseData);

  return {
    ...exerciseData,
    id: res.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
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
