<script setup lang="ts">
import { string } from "zod";
const country = ref();
type Contact = {
  country_id: number;
  country: {
    id: number;
    value: string;
    name: string;
  };
  description: string;
};
const sanctumFetch = useSanctumClient();
const companyContacts = ref<Contact[]>([]);
const filteredContacts = computed(() => {
  if (!country) return [];
  const filtereded = companyContacts.value.filter((contact) => {
    return contact.country?.id === country.value.value;
  });
  return filtereded;
});
onMounted(async () => {
  await sanctumFetch("/api/company-contacts")
    .then((res) => {
      companyContacts.value = res;
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>
<template>
  <div>
    <div>
      <BackButton class="mb-8" />
    </div>
    <PageHeader sub-title="Help" title="2. Contact Company Help" />
    <div class="w-full md:max-w-[600px] mx-auto">
      <UFormGroup label="Select your country">
        <CommonCountryDropdown return-value="object" v-model="country" />
      </UFormGroup>

      <div v-if="country" class="mt-6">
        <div v-for="contact in filteredContacts">
          <h3 class="text-center mb-6 font-bold border-b pb-2">
            {{ country.name }}
          </h3>
          <div v-html="contact.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>
