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
              <div>
                {{ exerciseRecord.bestSet.weight }}
                <span class="text-(--ui-text-muted)">kg x</span>
                {{ exerciseRecord.bestSet.reps }}
                <span class="text-(--ui-text-muted)">reps</span>
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
