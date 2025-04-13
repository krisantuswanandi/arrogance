interface Profile {
  id: string;
  name: string;
}

export const useProfileStore = defineStore("profile", () => {
  const profiles = ref<Profile[]>([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Doe" },
  ]);

  const activeProfileId = ref("1");

  const active = computed(() => {
    return profiles.value.find(
      (profile) => profile.id === activeProfileId.value
    )!;
  });

  function add(name: string) {
    const id = crypto.randomUUID();
    profiles.value.push({ id, name });

    if (!activeProfileId.value) {
      activeProfileId.value = id;
    }
  }

  function remove(id: string) {
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
    remove,
    active,
    setActive,
  };
});
