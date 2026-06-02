import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  type User,
  type UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export const useAccountStore = defineStore("account", () => {
  const account = ref<User | null>(null);

  function onLoad(callback: (user: User | null) => void) {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        account.value = user;
        updateLastActive(user);
      }

      callback(user);
    });
  }

  async function loginAnonymously() {
    try {
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      await afterLogin(userCredential);
      account.value = userCredential.user;
      return userCredential.user;
    } catch {
      return null;
    }
  }

  async function loginWithGoogle() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await afterLogin(userCredential);
      account.value = userCredential.user;
      return userCredential.user;
    } catch {
      return null;
    }
  }

  async function linkToGoogle() {
    try {
      if (!account.value) return;

      const provider = new GoogleAuthProvider();
      const userCredential = await linkWithPopup(account.value, provider);
      await updateAfterLink(userCredential.user);
      account.value = userCredential.user;
      return userCredential.user;
    } catch {
      return null;
    }
  }

  async function logout() {
    try {
      const auth = getAuth();
      await auth.signOut();
      account.value = null;
    } catch (error) {
      return error
    }
  }

  return {
    account,
    loginAnonymously,
    loginWithGoogle,
    linkToGoogle,
    logout,
    onLoad,
  };
});

function afterLogin(userCredential: UserCredential) {
  const additionalUserInfo = getAdditionalUserInfo(userCredential);
  if (additionalUserInfo?.isNewUser) {
    return setupDefaultData(userCredential.user);
  } else {
    return updateLastLogin(userCredential.user);
  }
}

function setupDefaultData(user: User) {
  const db = getFirestore();

  const profilesRef = collection(db, "profiles");
  const exercisesRef = collection(db, "exercises");
  const userRef = doc(db, "users", user.uid);

  return Promise.all([
    addDoc(profilesRef, {
      name: "Default",
      uid: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    addDoc(exercisesRef, {
      name: "Bench Press",
      uid: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    addDoc(exercisesRef, {
      name: "Deadlift",
      uid: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    addDoc(exercisesRef, {
      name: "Squat",
      uid: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    setDoc(userRef, {
      uid: user.uid,
      name: user.providerData[0]?.displayName || "",
      email: user.providerData[0]?.email || "",
      photo: user.providerData[0]?.photoURL || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      lastActive: new Date(),
    }),
  ]);
}

function updateLastActive(user: User) {
  return updateUserData(user.uid, {
    lastActive: new Date(),
  });
}

function updateLastLogin(user: User) {
  return updateUserData(user.uid, {
    lastLogin: new Date(),
    lastActive: new Date(),
  });
}

function updateAfterLink(user: User) {
  return updateUserData(user.uid, {
    name: user.providerData[0]?.displayName || "",
    email: user.providerData[0]?.email || "",
    photo: user.providerData[0]?.photoURL || "",
    updatedAt: new Date(),
    linkedToGoogle: new Date(),
  });
}

function updateUserData(uid: string, data: Record<string, string | Date>) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);
  return updateDoc(userRef, data);
}
