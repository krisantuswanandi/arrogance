<script setup lang="ts">
const props = defineProps<{
  exerciseId: string;
  exerciseName: string;
  open: boolean;
}>();

defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

// Get records from the record store
const recordStore = useRecordStore();
const exerciseRecord = computed(
  () => recordStore.records?.[props.exerciseId] || null
);

// Editing state
const isEditingBestSet = ref(false);
const editWeight = ref(0);
const editReps = ref(0);

function getSetNumber(index: number) {
  if (!exerciseRecord.value) return 0;

  let count = 0;
  for (let i = 0; i <= index; i++) {
    if (
      !exerciseRecord.value.lastSets[i].type || // Backwards compatibility, handle old records without type
      exerciseRecord.value.lastSets[i].type === "normal"
    ) {
      count++;
    }
  }
  return count;
}

function startEditing() {
  if (!exerciseRecord.value) return;

  isEditingBestSet.value = true;
  editWeight.value = exerciseRecord.value.bestSet.weight;
  editReps.value = exerciseRecord.value.bestSet.reps;
}

async function saveBestSet() {
  if (!exerciseRecord.value) return;

  try {
    const newBestSet = {
      weight: editWeight.value,
      reps: editReps.value,
      type: exerciseRecord.value.bestSet.type || "normal",
    };

    await recordStore.updateBestSetRecord(props.exerciseId, newBestSet);
    isEditingBestSet.value = false;
  } catch (error) {
    console.error("Failed to update best set:", error);
  }
}

function cancelEditing() {
  isEditingBestSet.value = false;
}

watch(
  () => props.open,
  (newValue) => {
    if (!newValue) cancelEditing();
  }
);
</script>

<template>
  <UModal
    :open="open"
    :title="exerciseName"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <div v-if="exerciseRecord">
        <!-- Best Set Section -->
        <div>
          <div class="text-xs font-bold text-(--ui-text-dimmed)">Best Set</div>
          <div class="mt-1">
            <div class="flex items-center gap-2 mt-2">
              <div
                class="flex items-center justify-center bg-(--ui-bg-muted) w-6 h-6 rounded text-xs"
              >
                <UIcon name="lucide:trophy" />
              </div>

              <!-- Display mode -->
              <div
                v-if="!isEditingBestSet"
                class="flex items-center gap-2 flex-1"
              >
                <div>
                  {{ exerciseRecord.bestSet.weight }}
                  <span class="text-(--ui-text-muted)">kg x</span>
                  {{ exerciseRecord.bestSet.reps }}
                  <span class="text-(--ui-text-muted)">reps</span>
                </div>
                <UButton
                  icon="lucide:pencil"
                  variant="ghost"
                  color="neutral"
                  size="lg"
                  class="p-1 text-(--ui-text-dimmed)"
                  @click="startEditing"
                />
              </div>

              <!-- Edit mode -->
              <div v-else class="flex items-center gap-2 flex-1">
                <UInput
                  v-model.number="editWeight"
                  type="number"
                  size="xs"
                  class="w-14"
                />
                <span class="text-(--ui-text-muted) text-sm">kg x</span>
                <UInput
                  v-model.number="editReps"
                  type="number"
                  size="xs"
                  class="w-14"
                />
                <span class="text-(--ui-text-muted) text-sm">reps</span>
                <div class="flex items-center gap-1">
                  <UButton
                    icon="lucide:circle-check"
                    variant="ghost"
                    color="neutral"
                    size="xl"
                    class="p-1 text-(--ui-text-dimmed)"
                    @click="saveBestSet"
                  />
                  <UButton
                    icon="lucide:circle-x"
                    variant="ghost"
                    color="neutral"
                    size="xl"
                    class="p-1 text-(--ui-text-dimmed)"
                    @click="cancelEditing"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Last Sets Section -->
        <div class="mt-6">
          <div class="text-xs font-bold text-(--ui-text-dimmed)">
            Last Workout
          </div>
          <div>
            <div
              v-for="(set, index) in exerciseRecord.lastSets"
              :key="index"
              class="flex items-center gap-2 mt-2"
            >
              <div
                class="flex items-center justify-center bg-(--ui-bg-muted) w-6 h-6 rounded text-xs"
              >
                <UIcon
                  v-if="set.type === 'drop'"
                  name="lucide:arrow-down-right"
                  class="text-(--ui-text-dimmed)"
                />
                <UIcon
                  v-else-if="set.type === 'warmup'"
                  name="lucide:flame"
                  class="text-(--ui-text-dimmed)"
                />
                <span v-else>{{ getSetNumber(index) }}</span>
              </div>
              <div>
                {{ set.weight }}
                <span class="text-(--ui-text-muted)">kg x</span>
                {{ set.reps }}
                <span class="text-(--ui-text-muted)">reps</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes section -->
        <div
          v-if="exerciseRecord.lastNotes"
          class="text-xs text-(--ui-text-dimmed) whitespace-pre-line mt-4"
        >
          {{ exerciseRecord.lastNotes }}
        </div>
      </div>

      <div
        v-else
        class="text-sm text-center py-8 text-(--ui-text-dimmed) italic"
      >
        No previous sets recorded
      </div>
    </template>
  </UModal>
</template>
