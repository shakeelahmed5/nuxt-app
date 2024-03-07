<script lang="ts" setup>
const { confirming, params, isLoading } = useConfirm()
</script>

<template>
  <u-modal v-model="confirming" :ui="{ width: 'sm:max-w-sm' }">
    <u-card>
      <div class="font-semibold mb-2">
        {{ params.title }}
      </div>
      <div>
        {{ params.message }}
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <u-button color="white" @click="confirming = false"> Cancel </u-button>
          <u-button color="red" variant="solid" :loading="isLoading" @click="params.action"> {{ params.label }}</u-button>
        </div>
      </template>
    </u-card>
  </u-modal>
</template>