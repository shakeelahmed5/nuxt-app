<script lang="ts" setup>
definePageMeta({
  layout: "landing",
  middleware: ["sanctum:auth"],
});

useSeoMeta({
  title: "Welcome",
});

await navigateTo("/dashboard");
</script>

<template>
  <UContainer class="flex flex-col gap-10"> </UContainer>
</template>

<style scoped></style>
