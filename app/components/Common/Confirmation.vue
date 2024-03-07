<script setup lang="ts">
defineProps<{
  title: string;
  text: string;
  image?: string;
  data?: object | number | string | [];
}>();

const modelValue = defineModel({ type: Boolean, default: false });

const emit = defineEmits(["confirm"]);
</script>

<template>
  <UModal v-model="modelValue" prevent-close>
    <div
      class="p-4 text-center flex flex-col gap-4 max-w-fit mx-auto items-center"
    >
      <img :src="image" class="w-10 h-10" />
      <h2 class="font-bold text-lg">{{ title }}</h2>
      <p>{{ text }}</p>

      <div class="flex justify-between py-4 gap-3">
        <UButton color="gray" @click="modelValue = false">Cancel</UButton>
        <UButton color="primary" @click="emit('confirm', data)"
          >Confirm</UButton
        >
      </div>
    </div>
  </UModal>
</template>
