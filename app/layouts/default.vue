<script lang="ts" setup>
const { isAuthenticated } = useSanctumAuth();
</script>

<template>
  <template v-if="isAuthenticated">
    <div class="relative isolate flex min-h-svh w-full max-md:flex-col">
      <div
        class="md:border-r-2 md:bg-slate-50 dark:bg-transparent dark:border-r-0"
      >
        <VerticalNavBar />
      </div>
      <!-- <div class="flex py-4 px-5 justify-between items-center">
      <NavBar />
      <ProfileMenu />
    </div> -->

      <UContainer
        class="py-4 md:mt-6 flex flex-col gap-4 mx-0 md:mx-auto w-full"
      >
        <slot />
      </UContainer>
    </div>
  </template>
</template>
