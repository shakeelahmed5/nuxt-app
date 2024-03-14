<script lang="ts" setup>
definePageMeta({
  layout: "minimal",
  middleware: ["sanctum:guest"],
});

useSeoMeta({
  title: "Register",
});
</script>

<template>
  <div class="text-3xl mb-6 text-center font-semibold text-primary">
    Register
  </div>
  <AuthRegisterForm />
</template>

<style scoped></style>
