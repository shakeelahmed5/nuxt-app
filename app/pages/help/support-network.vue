<script setup lang="ts">
const sponsors = ref<Sponsor[]>([]);
const loading = ref<boolean>(false);
const sanctumFetch = useSanctumClient();

type Sponsor = {
  first_name: string;
  last_name: string;
  avatar: string;
  country: string;
  contact_details: {
    facebook_url?: string;
    instagram_url?: string;
    email_address?: string;
    sms?: string;
  };
  openInfo: boolean;
};

onMounted(async () => {
  loading.value = true;
  await sanctumFetch("/api/help/sponsors").then((res) => {
    res.data.forEach((sponsor: Sponsor) => (sponsor.openInfo = false));
    sponsors.value = res.data;
    loading.value = false;
  });
});
</script>
<template>
  <div>
    <div>
      <BackButton class="mb-8" />
    </div>
    <PageHeader sub-title="Help" title="Ask Your Support Network" />

    <div class="w-full md:max-w-[600px] mx-auto">
      <div v-if="loading">
        <UCard class="mt-8">
          <div class="flex items-center space-x-4">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-[250px]" />
              <USkeleton class="h-4 w-[200px]" />
            </div>
          </div>
        </UCard>
        <UCard class="mt-8">
          <div class="flex items-center space-x-4">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-[250px]" />
              <USkeleton class="h-4 w-[200px]" />
            </div>
          </div>
        </UCard>
      </div>

      <div v-else>
        <UAccordion
          :items="sponsors"
          :ui="{
            wrapper: '',
            item: { base: 'pb-0' },
            container: 'shadow rounded',
          }"
        >
          <template #default="{ item, index, open }">
            <UButton
              color="gray"
              variant="ghost"
              class="border-0"
              :ui="{ rounded: 'rounded-lg', padding: { sm: 'py-4 px-3' } }"
            >
              <template #leading>
                <div class="text-primary font-bold p-2 text-3xl">
                  {{ index + 1 }}
                </div>
                <UAvatar
                  size="lg"
                  :src="item.avatar"
                  :alt="`${item.first_name} ${item.last_name}`"
                />
              </template>

              <div class="truncate text-left ml-3">
                <h3 class="font-bold">
                  {{ `${item.first_name} ${item.last_name}` }}
                </h3>
                <span class="text-gray-400">{{ item.country }}</span>
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

          <template #item="{ item, index, open }">
            <div
              class="py-4 px-6 flex justify-between items-center border-t border-b"
            >
              <div class="font-bold text-md">Facebook</div>
              <div>{{ item.contact_details.facebook_url }}</div>
            </div>
            <div class="py-4 px-6 flex justify-between items-center border-b">
              <div class="font-bold text-md">Instagram</div>
              <div>{{ item.contact_details.instagram_url }}</div>
            </div>
            <div class="py-4 px-6 flex justify-between items-center border-b">
              <div class="font-bold text-md">Email</div>
              <div>{{ item.contact_details.email_address }}</div>
            </div>
            <div class="py-4 px-6 flex justify-between items-center">
              <div class="font-bold text-md">SMS</div>
              <div>{{ item.contact_details.sms }}</div>
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
  </div>
</template>
