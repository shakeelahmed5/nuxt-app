<script lang="ts" setup>
definePageMeta({
  layout: "minimal",
  middleware: ["sanctum:guest"],
});

useSeoMeta({
  title: "Login",
});

const route = useRoute();
const resetToken = route.query.reset as string | undefined;
</script>

<template>
  <div class="text-3xl mb-6 text-center font-semibold text-primary">Log in</div>
  <AuthLoginForm :token="resetToken" />
</template>

<style scoped></style>
