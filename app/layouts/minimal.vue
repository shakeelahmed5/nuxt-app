<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: "bg-gray-100 dark:bg-transparent",
  },
});

// Light or Dark Mode
const mode = useNuxtApp().$colorMode;
</script>

<template>
  <LandingLoginLinks />
  <UContainer
    class="flex flex-col justify-center items-center pt-10 md:pt-20 pb-10 gap-5"
  >
    <LogoLight v-if="mode.value === 'light'" />
    <LogoDark v-else />

    <UCard class="w-full md:w-fit mt-3">
      <slot />
    </UCard>
  </UContainer>
</template>
