<script setup lang="ts">
const props = defineProps<{
  lessonId: number;
}>();

const sanctumFetch = useSanctumClient();

const isLoading = ref(true);
const length = ref(5);
const over = ref(0);
const rate = ref(0);
const starRating = ref<StarRating>({
  star_rating: 0,
  feedback: "",
});
const showFeedbackTextarea = ref(false);
const feedbackQuestion = ref("");
const feedbackContent = ref("");
const showFeedbackThankYou = ref(false);
const saving = ref(false);

type StarRating = {
  star_rating: number;
  feedback: string;
};

const getStarRating = async () => {
  await sanctumFetch(`/api/lessons/star-ratings/${props.lessonId}`)
    .then((res) => {
      starRating.value = res.data;
      rate.value = starRating.value.star_rating;
      feedbackContent.value = starRating.value.feedback;
      onOut();
      isLoading.value = false;
    })
    .catch((error) => {
      console.error(error);
    });
};

const showFeedbackForm = (rating: number) => {
  showFeedbackTextarea.value = true;
  feedbackQuestion.value = "What would make this five stars for you?";

  nextTick(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  });

  if (rating === 5) {
    feedbackQuestion.value = "Great!  What made this 5 stars for you?";
  }
};

const saveFeedback = async () => {
  saving.value = true;

  await sanctumFetch("/api/lessons/star-ratings/", {
    method: "post",
    body: {
      star_rating: rate.value,
      feedback: feedbackContent.value,
      lesson_id: props.lessonId,
    },
  }).then(() => {
    saving.value = false;
    showFeedbackTextarea.value = false;
    feedbackContent.value = "";
    showFeedbackThankYou.value = true;
  });
};

const saveRating = async () => {
  await sanctumFetch("/api/lessons/star-ratings/", {
    method: "post",
    body: {
      star_rating: rate.value,
      feedback: feedbackContent.value,
      lesson_id: props.lessonId,
    },
  });
};

onMounted(() => {
  getStarRating();
});

const onOver = (index: number) => {
  over.value = index;
};
const onOut = () => {
  over.value = rate.value;
};
const setRating = (index: number) => {
  rate.value = index;
  saveRating();
  showFeedbackForm(index);
  showFeedbackThankYou.value = false;
};
</script>

<template>
  <div v-if="isLoading">
    <USkeleton class="h-4 w-[250px]" :ui="{ base: 'animate-pulse' }" />
  </div>

  <div v-else>
    <div class="flex justify-center">
      <template v-for="n in length" :key="n">
        <button
          type="button"
          class="text-gray-300 py-1 px-3"
          @mouseover="onOver(n)"
          @mouseout="onOut()"
          @click="setRating(n)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="size-6 stroke-2"
            :class="{
              'fill-yellow-500 stroke-yellow-500': n <= over,
              'fill-none': n > over,
              'fill-yellow-500 ': n <= rate,
            }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
      </template>
    </div>

    <div v-if="showFeedbackTextarea" class="mt-3">
      <div class="my-3">{{ feedbackQuestion }}</div>
      <UTextarea
        v-model="feedbackContent"
        :rows="8"
        placeholder="Tell us what you think..."
      />
      <div class="submit-btn-wrap">
        <UButton :loading="saving" @click="saveFeedback" class="mt-3">
          Submit Feedback
        </UButton>
      </div>
    </div>

    <div v-if="showFeedbackThankYou" class="text-center mt-3">
      Thank you for your feedback!
    </div>
  </div>
</template>
