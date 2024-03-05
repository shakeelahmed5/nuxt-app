<script setup lang="ts">
import type { User } from "~/types/auth";

const props = defineProps<{
  topUsers: User[];
}>();

const { user } = useSanctumAuth<User>();
const { isLoading } = useLeaderboad();
const { asset } = useUtils();

const numberFormat = (number: number | undefined) => {
  if (number !== undefined) {
    return new Intl.NumberFormat("en-US").format(number);
  }

  return 0;
};
</script>

<template>
  <div class="leaderboard">
    <div
      class="flex justify-between items-center py-4 px-7 border-b"
      v-if="isLoading"
      v-for="item in 5"
    >
      <div class="flex gap-3 items-center">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <USkeleton class="h-4 w-[250px]" />
      </div>
      <div class="justify-self-end">
        <USkeleton class="h-4 w-[50px]" />
      </div>
    </div>
    <div v-else>
      <div v-if="!topUsers.length">
        <UAlert
          icon="i-heroicons-command-line"
          color="primary"
          description="There is no top user found for this period"
          title="Not found!"
        />
      </div>
      <div
        class="flex justify-between items-center py-4 px-7"
        :class="{
          'border-b': topUsers.length - 2 >= index && topUser.id !== user?.id,
          'border-2 border-primary rounded-lg': topUser.id === user?.id,
        }"
        v-else
        v-for="(topUser, index) in topUsers"
      >
        <div class="flex gap-3 items-center">
          <div class="w-3 text-gray-500">{{ topUser.position }}</div>
          <UAvatar
            size="lg"
            class="mx-3"
            :src="asset(topUser.avatar)"
            :alt="`${topUser.first_name} ${topUser.last_name}`"
          />
          <div>{{ topUser.first_name + " " + topUser.last_name }}</div>
        </div>
        <div class="justify-self-end">
          {{ numberFormat(topUser.points_sum) }}
        </div>
      </div>
    </div>
  </div>
</template>
