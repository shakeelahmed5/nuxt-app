<script lang="ts" setup>
import type { TeamInvite } from "~/types/common";

const config = useRuntimeConfig();
const { copyTextToClipboard } = useUtils();

const { invites, getInvites, deleteInvite } = useTeamInvite();
getInvites();

const link = (item: TeamInvite) =>
  `${config.public.app_url}/register?ic=${item.code}`;

const status = (item: TeamInvite) => {
  if (item.deleted_at) return "Deleted";
  if (item.used_at) return "Registered";
  return "Not Registered";
};
const statusColor = (item: TeamInvite) => {
  if (item.deleted_at) return "green";
  if (item.used_at) return "green";
  return "red";
};
</script>

<template>
  <div id="team-inite-list">
    <UAccordion
      :items="invites"
      :ui="{ container: 'flex flex-col w-full mt-8 shadow-lg' }"
    >
      <template #default="{ item, index, open }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-b border-gray-200 dark:border-gray-700 px-8 py-6"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
        >
          <div class="flex">
            <h1 class="font-semibold">
              {{ item.first_name }} {{ item.last_name }}
            </h1>
            <UBadge size="xs" class="ml-3" :color="statusColor(item)">
              {{ status(item) }}
            </UBadge>
          </div>
          <template #trailing>
            <UIcon
              name="i-heroicons-chevron-right-20-solid"
              class="w-5 h-5 ms-auto transform transition-transform duration-200"
              :class="[open && 'rotate-90']"
            />
          </template>
        </UButton>
      </template>

      <template #item="{ item }">
        <div class="flex flex-col gap-8 p-8">
          <div class="flex justify-between py-4 border-b">
            <div>Invite Code:</div>
            <div class="text-sm">{{ item.code }}</div>
          </div>
          <div class="flex justify-between py-4 border-b">
            <div>Date Created:</div>
            <div class="text-sm">
              {{ $dayjs(item.created_at).format("YYYY-MM-DD") }}
            </div>
          </div>
          <div class="flex py-4 border-b text-sm text-right">
            {{ link(item) }}
          </div>
          <div v-if="statusColor(item) != 'green'" class="flex justify-between">
            <UButton color="red" @click="deleteInvite(item)"
              >Delete Invite</UButton
            >
            <UButton
              color="green"
              @click="
                copyTextToClipboard(
                  link(item),
                  'Link is copied to the clipboard'
                )
              "
              >Copy to Clipboard</UButton
            >
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
