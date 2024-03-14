<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:auth"],
});
</script>

<template>
  <PageHeader sub-title="Tracker" title="View Daily Dozen" />
  <UCard> View Trackers</UCard>
</template>
