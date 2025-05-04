import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface Profile {
  id: string;
  name: string;
}

export const useProfileStore = defineStore("profile", () => {
  const { data: profiles } = useQuery<Profile[]>({
    key: ["profiles"],
    query: () => fetchProfiles(),
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
    if (!profiles.value) return;

    const id = crypto.randomUUID();
    profiles.value.push({ id, name });

    if (!activeProfileId.value) {
      activeProfileId.value = id;
    }

    if (setActive) {
      activeProfileId.value = id;
    }
  }

  function edit(id: string, name: string) {
    if (!profiles.value) return;

    const index = profiles.value.findIndex((profile) => profile.id === id);
    if (index !== -1) {
      profiles.value[index].name = name;
    }
  }

  function remove(id: string) {
    if (!profiles.value) return;
    if (activeProfileId.value === id) return;

    const index = profiles.value.findIndex((profile) => profile.id === id);
    if (index !== -1) {
      profiles.value.splice(index, 1);
    }
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
  return snap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
    };
  });
}
