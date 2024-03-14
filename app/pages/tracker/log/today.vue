<script lang="ts" setup>
import { type TrackerDate } from "@/types/tracker";

definePageMeta({
  middleware: ["sanctum:auth"],
});

// Date
const dayjs = useDayjs();
const todayDate = dayjs().format("YYYY-MM-DD");

// Get Trackers
const sanctumFetch = useSanctumClient();

// today
const { data: todayResponse } = await sanctumFetch(
  `/api/trackers/date?date=${todayDate}`
);
const todayTrackers = reactive<TrackerDate[]>(todayResponse);

const { minus, plus, save, request } = useTracker();

// Nav Links
const links = [
  {
    label: "Today",
    to: "/tracker/log/today",
  },
  {
    label: "Yesterday",
    to: "/tracker/log/yesterday",
  },
];
</script>

<template>
  <PageHeader sub-title="Tracker" title="Log Daily Dozen">
    <UHorizontalNavigation :links="links" class="mt-4">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UHorizontalNavigation>
  </PageHeader>

  <!-- Cards -->
  <div class="w-full md:max-w-[600px] mx-auto">
    <!-- Card Loop -->
    <UCard v-for="tracker in todayTrackers" :key="tracker.order" class="mb-5">
      <template #header>
        <h4 class="font-semibold">{{ tracker.title }}</h4>
      </template>

      <div class="font-bold text-2xl text-center">
        {{ tracker.points.unit_qty }}
      </div>
      <div class="text-center">
        {{
          tracker.points.unit_qty == 1
            ? tracker.count_sub_title_singular
            : tracker.count_sub_title_plural
        }}
      </div>
      <div class="flex justify-between gap-4">
        <!-- Left Button -->
        <div>
          <UButton
            icon="i-heroicons-minus"
            size="xl"
            color="primary"
            square
            variant="solid"
            :disabled="request"
            @click="minus(tracker)"
          />
        </div>
        <!-- Center -->
        <div class="w-full mt-4">
          <UMeter
            :value="tracker.points.unit_qty"
            :min="0"
            :max="tracker.max_count"
          />
        </div>
        <!-- Right Button -->
        <div>
          <UButton
            icon="i-heroicons-plus"
            size="xl"
            color="primary"
            square
            variant="solid"
            :disabled="request"
            @click="plus(tracker)"
          />
        </div>
      </div>
      <div class="text-sm text-center">
        {{ tracker.points.total_points }}
        {{ tracker.points.total_points === 1 ? "Star Earned" : "Stars Earned" }}
      </div>
    </UCard>

    <!-- Save Button -->
    <UButton @click="save(todayTrackers, todayDate)" block size="lg"
      >Save</UButton
    >
  </div>
</template>
