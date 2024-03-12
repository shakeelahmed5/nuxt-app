<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:auth"],
});

const sanctumFetch = useSanctumClient();

const route = useRoute();

interface Action {
  order: number;
  slug: string;
  title: string;
  completed: boolean;
  loading: boolean;
}

interface Lesson {
  id: number;
  order: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  time: number;
  points: number;
  completed: boolean;
  actions: Action[];
}

const { data: response } = await sanctumFetch(
  `/api/lessons/${route.params.slug}`
);
const lesson = reactive<Lesson>(response);

onUpdated(() => {
  window._paq.push(["MediaAnalytics::scanForMedia"]);
});

const isEnabledCompleteLessonButton = computed(() => {
  return (
    lesson.actions.filter((action: Action) => !action.completed).length === 0
  );
});

async function toggleAction(action: Action) {
  if (action.loading) return;

  action.loading = true;

  await sanctumFetch("/api/complete-lesson-action", {
    method: !action.completed ? "post" : "delete",
    body: { slug: action.slug },
  })
    .then(() => {
      action.loading = false;
      action.completed = !action.completed;
    })
    .catch(() => {
      action.loading = false;
    });
}

let request = false;
async function completeLesson() {
  console.log("Complete Lesson");

  if (request) return;

  request = true;

  await sanctumFetch(`/api/lessons/${lesson.slug}`, {
    method: "PUT",
  })
    .then(() => {
      lesson.completed = true;
      request = false;
    })
    .catch((error) => {
      console.error(error);
      request = false;
    });
}
</script>

<template>
  <div class="w-full aspect-video">
    <BackButton />

    <!-- Header -->
    <div class="relative border-b border-gray-200 dark:border-gray-800 py-8">
      <div
        class="mb-3 text-sm/6 font-semibold text-primary flex items-center gap-1.5"
      >
        My Training
      </div>
      <h1
        class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        {{ lesson.title }}
      </h1>
      <p class="text-sm mt-4">
        {{ lesson.time }} min / {{ lesson.points }} pts
      </p>
    </div>

    <UCard class="mt-8">
      <div v-html="lesson.body"></div>
    </UCard>

    <!-- Lesson Actions Card -->
    <UCard v-show="lesson.actions.length" class="mt-8">
      <template #header> <span class="font-semibold">Actions</span> </template>

      <div v-for="(action, index) in lesson.actions" :key="action.order">
        <div class="flex gap-3 justify-between">
          <div class="flex gap-3">
            <UIcon
              v-if="action.completed"
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-green-500"
            />
            <UIcon
              v-else="action.completed"
              name="i-heroicons-stop"
              class="w-5 h-5"
            />
            <div>{{ action.title }}</div>
          </div>
          <div>
            <UButton
              :color="action.completed ? 'green' : 'primary'"
              :loading="action.loading"
              size="xs"
              @click="toggleAction(action)"
            >
              {{ action.completed ? "Completed" : "Complete" }}
            </UButton>
          </div>
        </div>

        <hr v-if="index + 1 !== lesson.actions.length" class="my-3" />
      </div>
    </UCard>

    <!-- Mark Lesson Complete Card -->
    <div class="mt-8">
      <UCard
        v-if="lesson.completed"
        class="flex flex-col items-center align-top"
      >
        <div class="flex">
          <UIcon
            name="i-heroicons-check-circle"
            class="w-7 h-7 text-green-500"
          />
          <span class="ml-2 font-semibold text-green-500"
            >Lesson Completed</span
          >
        </div>
      </UCard>

      <UCard v-else="lesson.completed" class="mt-8 flex flex-col items-center">
        <UButton
          v-if="isEnabledCompleteLessonButton"
          :disabled="false"
          @click="completeLesson"
          >Mark Lesson as Complete</UButton
        >
        <UButton v-else="isEnabledCompleteLessonButton" :disabled="true"
          >Complete All Actions to Complete This Lesson</UButton
        >
      </UCard>
    </div>

    <!-- Rate Lesson -->
    <UCard class="mt-8">
      <template #header>
        <span class="font-semibold">Rate This Lesson</span>
      </template>
      <StarRating :lesson-id="lesson.id" />
    </UCard>
  </div>
</template>

<style scoped>
.youtube-video {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>
