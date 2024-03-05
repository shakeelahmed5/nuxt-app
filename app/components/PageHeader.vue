<script setup lang="ts">
const props = defineProps<{
  subTitle: string;
  title: string;
}>();
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-800 mb-4">
    <div
      class="mb-3 text-sm/6 font-semibold text-primary flex items-center gap-1.5"
    >
      {{ subTitle }}
    </div>
    <h1
      class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
    >
      {{ title }}
    </h1>
    <slot>
      <div class="pb-8"></div>
    </slot>
  </div>
</template>
