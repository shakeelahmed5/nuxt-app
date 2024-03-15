<script setup lang="ts">
const route = useRoute();

const links = [
  {
    label: "General",
    to: "/settings/general",
  },
  {
    label: "Team Contact Details",
    //   icon: 'i-heroicons-home',
    to: "/settings/contact-details",
  },
  {
    label: "Change Password",
    //   icon: 'i-heroicons-chart-bar',
    to: `/settings/change-password`,
  },
];
</script>

<template>
  <PageHeader sub-title="User" title="Profile">
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
