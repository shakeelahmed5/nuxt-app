<script setup lang="ts">
const route = useRoute();

const links = [
  {
    label: "This Week",
    to: "/leaderboard/this-week",
  },
  {
    label: "This Month",
    //   icon: 'i-heroicons-home',
    to: "/leaderboard/this-month",
  },
  {
    label: "Last Week",
    //   icon: 'i-heroicons-chart-bar',
    to: `/leaderboard/last-week`,
  },
  {
    label: "Last Month",
    //   icon: 'i-heroicons-chart-bar',
    to: `/leaderboard/last-month`,
  },
];
</script>

<template>
  <PageHeader sub-title="TEACHER" title="Leaderboard">
    <UHorizontalNavigation :links="links" class="mt-4">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UHorizontalNavigation>
  </PageHeader>

  <div class="w-full md:max-w-[600px] mx-auto">
    <NuxtPage />
  </div>
  
</template>
