interface Profile {
  id: string;
  name: string;
}

export const useProfileStore = defineStore("profile", () => {
  const profiles = ref<Profile[]>([{ id: "1", name: "Default" }]);

  const activeProfileId = ref("1");

  const active = computed(() => {
    return profiles.value.find(
      (profile) => profile.id === activeProfileId.value
    )!;
  });

  function add(name: string, setActive?: boolean) {
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
    const index = profiles.value.findIndex((profile) => profile.id === id);
    if (index !== -1) {
      profiles.value[index].name = name;
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
    edit,
    remove,
    active,
    setActive,
  };
});
