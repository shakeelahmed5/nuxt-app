<script setup lang="ts">
const query = ref();
const sanctumclient = useSanctumClient();
const { asset } = useUtils();
const lessons = ref<SearchResult[]>([]);
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const search = async () => {
  isLoading.value = true;
  const response = await sanctumclient("/api/help/search", {
    params: { search: query.value },
  });
  isLoading.value = false;
  isLoaded.value = true;
  lessons.value = response.data;
};

type SearchResult = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  course_image_url: string;
  course_title: string;
};
</script>
<template>
  <div>
    <div>
      <BackButton class="mb-8" />
    </div>
    <PageHeader sub-title="Help" title="Search Training Materials" />
    <div class="w-full md:max-w-[600px] mx-auto">
      <h3 class="text-gray-400 mb-6 text-center">What I can help you with?</h3>
      <UInput
        v-model="query"
        name="q"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        :loading="isLoading"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        @keydown.enter.prevent="search"
      >
        <template #trailing>
          <UButton
            v-show="query"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="
              query = '';
              lessons = [];
              isLoaded = false;
            "
          />
        </template>
      </UInput>
      <div class="text-center">
        <UButton
          color="primary"
          :loading="isLoading"
          class="mt-4"
          @click="search"
          >Search</UButton
        >
      </div>
    </div>
    <div class="w-full md:max-w-[600px] mx-auto">
      <div
        class="flex flex-col gap-4 mt-8"
        v-if="lessons?.length && !isLoading"
      >
        <UCard v-for="(lesson, index) in lessons">
          <NuxtLink :to="`/lessons/${lesson.slug}`">
            <div class="flex gap-4 items-center">
              <div class="text-primary font-bold p-2 text-3xl">
                {{ index + 1 }}
              </div>
              <img
                :src="asset(lesson.course_image_url)"
                class="h-16 hidden md:block"
              />
              <div>
                <h3 class="mb-1">{{ lesson.title }}</h3>
                <p class="italic text-sm mb-2">{{ lesson.course_title }}</p>
                <p class="text-gray-400">{{ lesson.excerpt }}</p>
              </div>
            </div>
          </NuxtLink>
        </UCard>
      </div>
      <div v-else-if="isLoaded && !lessons?.length" class="mt-8">
        <UAlert
          title="Not found!"
          description="No records found for your search, please try a different search."
        />
      </div>
    </div>
  </div>
</template>
