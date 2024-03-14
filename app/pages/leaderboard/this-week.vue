<script setup lang="ts">
const { getUsers, topUsers, getDateString } = useLeaderboad();

onMounted(() => {
  getUsers('thisWeek');
})

</script>

<template>
    <UCard :ui="{strategy: 'override', body: {padding: ''}}">
      <template #header>
        <div class="text-center font-bold">Week of {{ getDateString('thisWeek').format('MMMM DD, YYYY') }}</div>
      </template>

      <LeaderboardList :top-users="topUsers" />

    </UCard>
</template>