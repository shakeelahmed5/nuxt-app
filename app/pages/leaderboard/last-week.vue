<script setup lang="ts">
const { getUsers, topUsers, getDateString } = useLeaderboad();

onMounted(() => {
  getUsers('lastWeek');
})

</script>

<template>
    <UCard :ui="{strategy: 'override', body: {padding: ''}}">
        <template #header>
            <div class="text-center font-bold">Week of {{ getDateString('lastWeek').format('MMMM DD, YYYY') }}</div>
        </template>

        <LeaderboardList :top-users="topUsers" />

    </UCard>
</template>