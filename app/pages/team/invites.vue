<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:auth"],
});

// useSeoMeta({
//   title: "My Team Invites",
// });

// const { user } = useSanctumAuth()
</script>

<template>
  <PageHeader sub-title="My Team" title="My Team Invites" />
  <div class="w-full md:max-w-[600px] mx-auto flex flex-col gap-4">
    <UAlert
      icon="i-heroicons-envelope"
      description="Each new team member needs a unique invite code to join to this team training site. Generate a new invite link by filling out the form below."
      title="Invite a New Team Member!"
      color="green"
      variant="soft"
    />

    <UCard class="mt-4">
      <template #header>
        <h1 class="font-semibold">Create a New Team Invite</h1>
      </template>

      <div class="flex flex-col gap-2">
        <TeamCreateInvite />
      </div>
    </UCard>

    <TeamDisplayInvites />
  </div>
</template>

<style scoped></style>
