<script setup lang="ts">
const { getUsers, topUsers, getDateString } = useLeaderboad();

onMounted(() => {
  getUsers('lastMonth');
})

</script>

<template>
    <UCard :ui="{strategy: 'override', body: {padding: ''}}">
        <template #header>
            <div class="text-center font-bold">{{ getDateString('lastMonth').format('MMMM YYYY') }}</div>
        </template>

        <LeaderboardList :top-users="topUsers" />

  </UCard>
</template>