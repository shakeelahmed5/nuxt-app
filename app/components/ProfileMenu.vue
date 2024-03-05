<script lang="ts" setup>
import type { User } from "~~/models/user";

const { user, logout } = useSanctumAuth<User>();

const dropdownLabel = computed(() => `Hey, ${user.value!.first_name}!`);

const actions = [
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-start-on-rectangle",
      click: async () => {
        await logout();
        window._paq.push(["setCustomUrl", "/logout"]);
        window._paq.push(["trackPageView"]);
        window._paq.push(["resetUserId"]);
      },
    },
  ],
];
</script>

<template>
  <div>
    <UDropdown :items="actions">
      <UButton
        color="white"
        variant="ghost"
        :label="dropdownLabel"
        trailing-icon="i-heroicons-chevron-down"
      />
    </UDropdown>
  </div>
</template>

<style scoped></style>
