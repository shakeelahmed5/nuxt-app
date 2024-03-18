<script lang="ts" setup>
const { schema, form, state, save, isLoading } = useTeamInvite();
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-4 sm:min-w-80 md:min-w-96 max-w-md"
    @submit="save"
  >
    <UFormGroup label="First Name" name="first_name">
      <UInput v-model="state.first_name" />
    </UFormGroup>
    <UFormGroup label="Last Name" name="last_name">
      <UInput v-model="state.last_name" />
    </UFormGroup>
    <UFormGroup label="Country" name="country_id">
      <CommonCountryDropdown v-model="state.country_id" return-value="value" />
    </UFormGroup>

    <div class="flex justify-end">
      <UButton type="submit" :loading="isLoading"> Create Invite </UButton>
    </div>
  </UForm>
</template>
