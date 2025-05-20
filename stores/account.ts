import {
  getAuth,
  signInAnonymously,
  getAdditionalUserInfo,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export interface Account {
  uid: string;
}

export const useAccountStore = defineStore("account", () => {
  const account = ref<Account | null>(null);

  async function login() {
    try {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);

      const additionalUserInfo = getAdditionalUserInfo(userCredential);
      if (additionalUserInfo?.isNewUser) {
        await setupDefaultData(userCredential.user.uid);
      }

      account.value = userCredential.user;
    } catch (error: unknown) {
      console.error("login failed", error);
    }
  }

  return {
    account,
    login,
  };
});

async function setupDefaultData(uid: string) {
  const db = getFirestore();

  const profilesRef = collection(db, "profiles");
  const exercisesRef = collection(db, "exercises");

  await Promise.all([
    addDoc(profilesRef, {
      name: "Default",
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    addDoc(exercisesRef, {
      name: "Bench Press",
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    addDoc(exercisesRef, {
      name: "Deadlift",
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    addDoc(exercisesRef, {
      name: "Squat",
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  ]);
}
