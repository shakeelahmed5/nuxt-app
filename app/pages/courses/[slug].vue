<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:auth"],
});

const config = useRuntimeConfig();
const serverBaseUrl = config.public.serverBaseUrl;

const sanctumFetch = useSanctumClient();

const route = useRoute();

interface Lesson {
  order: number;
  slug: string;
  title: string;
  time: number;
  points: number;
  completed: boolean;
}

interface CourseDetail {
  order: number;
  slug: string;
  title: string;
  image_url: string;
  lessons_count: number;
  completed_lessons_count: number;
  excerpt: string;
  lessons: Lesson[];
}

const { data: response } = await sanctumFetch(
  `/api/courses/${route.params.slug}`
);
const course = reactive<CourseDetail>(response);

// const course: CourseLessons = await sanctumFetch(
//   `/api/courses/${route.params.slug}`
// )
//   .then((res) => res.data)
//   .catch((err) => {
//     console.error(err);
//   });
</script>

<template>
  <div class="max-w-[600px] mx-auto">
    <UCard :ui="{ header: { padding: 'px-0 py-0 sm:p-0' } }">
      <template #header>
        <img :src="serverBaseUrl + course.image_url" class="rounded-t-lg" />
      </template>
      <div>
        <p class="font-semibold mb-1.5">{{ course.title }}</p>
        <p class="text-sm font-light">{{ course.lessons_count }} Lessons</p>
        <hr class="my-2" />
        <p>
          {{ course.excerpt }}
        </p>
      </div>

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

    <UCard class="mt-8">
      <template #header>
        <span class="font-semibold">Lessons</span>
      </template>

      <div
        v-for="(lesson, index) in course.lessons"
        :key="lesson.order"
        class="relative"
      >
        <ULink :to="{ name: 'lessons-slug', params: { slug: lesson.slug } }">
          <div class="flex py-2">
            <span class="text-primary font-bold p-2 text-3xl">{{
              index + 1
            }}</span>
            <div class="ml-3">
              <p class="font-semibold">{{ lesson.title }}</p>
              <p class="font-light text-sm">
                {{ lesson.time }} min / {{ lesson.points }} pts
              </p>
            </div>

            <div class="my-3">
              <UIcon
                v-if="lesson.completed"
                name="i-heroicons-check-circle"
                class="w-6 h-6 text-green-500 absolute right-0"
              />
              <UIcon
                v-else="lesson.completed"
                name="i-heroicons-chevron-right"
                class="w-5 h-5 absolute right-0"
              />
            </div>
          </div>
        </ULink>
        <hr v-if="index + 1 !== course.lessons.length" />
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
