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

interface Profile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useProfileStore = defineStore("profile", () => {
  const queryCache = useQueryCache();

  const { data: profiles } = useQuery<Profile[]>({
    key: ["profiles"],
    query: () => fetchProfiles(),
  });

  const { mutate: addProfileTemp } = useMutation({
    mutation: (name: string) => addProfile(name),
    onSettled: () => queryCache.invalidateQueries({ key: ["profiles"] }),
  });

  const { mutate: editProfileTemp } = useMutation({
    mutation: (param: { id: string; name: string }) =>
      editProfile(param.id, param.name),
    onSettled: () => queryCache.invalidateQueries({ key: ["profiles"] }),
  });

  const { mutate: deleteProfileTemp } = useMutation({
    mutation: (id: string) => deleteProfile(id),
    onSettled: () => queryCache.invalidateQueries({ key: ["profiles"] }),
  });

  const activeProfileId = useLocalStorage("active-profile", "");
  watch(profiles, (val) => {
    if (activeProfileId.value) return;
    if (!val) return;
    if (!val.length) return;
    activeProfileId.value = val[0].id;
  });

  const active = computed(() => {
    if (!profiles.value) return null;

    return profiles.value.find(
      (profile) => profile.id === activeProfileId.value,
    )!;
  });

  function add(name: string, setActive?: boolean) {
    addProfileTemp(name);

    if (setActive) {
      // activeProfileId.value = id;
    }
  }

  function edit(id: string, name: string) {
    editProfileTemp({ id, name });
  }

  function remove(id: string) {
    deleteProfileTemp(id);
  }

  function setActive(id: string) {
    activeProfileId.value = id;
  }

  return {
    profiles,
    add,
    edit,
    remove,
    active,
    setActive,
  };
});

async function fetchProfiles() {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "profiles");
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
      } satisfies Profile;
    })
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

async function addProfile(name: string) {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = collection(db, "profiles");
  await addDoc(docRef, {
    name,
    uid: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

async function editProfile(id: string, name: string) {
  const db = getFirestore();
  const docRef = doc(db, "profiles", id);
  await updateDoc(docRef, { name, updatedAt: serverTimestamp() });
}

async function deleteProfile(id: string) {
  const db = getFirestore();
  const docRef = doc(db, "profiles", id);
  await deleteDoc(docRef);
}
