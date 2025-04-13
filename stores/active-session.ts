export interface Activity {
  id: string;
  routineId: string;
}

export const useActiveSessionStore = defineStore("active-session", () => {
  const activeSession = ref<Activity>();

  return {
    activeSession,
  };
});
