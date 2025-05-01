import { getAuth, signInAnonymously } from "firebase/auth";

export interface Account {
  uid: string;
}

export const useAccountStore = defineStore("account", () => {
  const account = ref<Account | null>(null);

  async function login() {
    try {
      const auth = getAuth();
      const data = await signInAnonymously(auth);
      account.value = data.user;
    } catch (error: any) {
      console.error("login failed", error.code, error.message);
    }
  }

  return {
    account,
    login,
  };
});
