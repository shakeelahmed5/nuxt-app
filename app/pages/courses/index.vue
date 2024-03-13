<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:auth"],
});

interface Course {
  order: number;
  slug: string;
  title: string;
  image_url: string;
  lessons_count: number;
  completed_lessons_count: number;
}

const config = useRuntimeConfig();
const serverBaseUrl = config.public.serverBaseUrl;

const sanctumFetch = useSanctumClient();

const courses: Course[] = await sanctumFetch("/api/courses")
  .then((res) => res.data)
  .catch((err) => {
    console.error(err);
  });
</script>

<template>
  <div>
    <PageHeader sub-title="My Training" title="Courses" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Courses Loop -->
      <div
        v-for="course in courses"
        :key="course.order"
        class="mt-5 max-w-[600px] mx-auto w-full"
      >
        <UCard :ui="{ header: { padding: 'px-0 py-0 sm:p-0' } }">
          <template #header>
            <ULink
              :to="{ name: 'courses-slug', params: { slug: course.slug } }"
            >
              <img
                :src="serverBaseUrl + course.image_url"
                class="rounded-t-lg"
              />
            </ULink>
          </template>
          <ULink :to="{ name: 'courses-slug', params: { slug: course.slug } }"
            ><p class="font-semibold mb-1.5">{{ course.title }}</p></ULink
          >
          <p class="text-sm font-light">{{ course.lessons_count }} Lessons</p>

          <template #footer>
            <UMeter
              color="primary"
              :value="course.completed_lessons_count"
              :max="course.lessons_count"
              indicator
            >
              <template #label="">
                <p class="text-sm">
                  {{ course.completed_lessons_count }} of
                  {{ course.lessons_count }} Completed
                </p>
              </template>
            </UMeter>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
