<script setup lang="ts">
const router = useRouter();
const cards = [
  { title: "Search Training Materials", route: "search" },
  //   { title: "Contact Company Help", route: "contact-company" },
  { title: "Ask your Support Network", route: "support-network" },
];
</script>
<template>
  <PageHeader sub-title="Help" title="Getting Help">
    <UCard class="mt-6">
      <h4 class="font-bold">Where do I find answers to my questions?</h4>
      <p class="mt-3 mb-0 text-muted">
        Answers to your questions are few steps away. <br />
        For quick answers you'll want to go in this order.
      </p>
    </UCard>
  </PageHeader>
  <div class="w-full md:max-w-[600px] mx-auto">
    <div class="mt-4 flex flex-col gap-3">
      <UCard
        class="cursor-pointer"
        v-for="(card, index) in cards"
        @click="router.push(`/help/${card.route}`)"
      >
        <div class="flex justify-between items-center font-bold">
          <h3>{{ `${index + 1}. ${card.title}` }}</h3>
          <UIcon name="i-heroicons-chevron-right" />
        </div>
      </UCard>
    </div>
  </div>
</template>
