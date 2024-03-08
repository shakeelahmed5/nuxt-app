<script setup lang="ts">
import type { orgUserDetails } from "@/types/organizationDetail.js";

interface Props {
  uuid: string;
}
const props = defineProps<Props>();
const sanctumFetch = useSanctumClient();
const loadData = ref(false);
const isLoading = ref(false);
const userData = ref<orgUserDetails>();

const loadingButtonText = computed(() =>
  isLoading.value ? "Loading" : "Load User Data"
);

const emailVerified = computed(() => {
  return !!userData.value?.email_verified_at;
});

const getUserData = async () => {
  isLoading.value = true;
  await sanctumFetch(`/api/organization/${props.uuid}`)
    .then((res) => {
      userData.value = res.data;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isLoading.value = false;
      loadData.value = !loadData.value;
    });
};
</script>

<template>
  <div>
    <div v-if="!loadData">
      <UDivider class="my-6" />
      <div class="flex justify-center">
        <UButton :loading="isLoading" @click="getUserData">{{
          loadingButtonText
        }}</UButton>
      </div>
    </div>
    <div v-else>
      <!-- User Details -->
      <UDivider
        label="User Details"
        class="mt-8 mb-5"
        :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
      />
      <UAlert
        v-if="userData?.has_bounced_email"
        icon="i-heroicons-exclamation-circle"
        title="Invalid user email - email is undeliverable"
        color="red"
        class="my-6"
      />

      <div class="flex justify-between">
        <div>Joined Date:</div>
        <div>{{ $dayjs(userData?.created_at).format("MMMM DD, YYYY") }}</div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>Last Active:</div>
        <div>
          {{ $dayjs(userData?.last_activity_at).format("MMMM DD, YYYY") }}
        </div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>Email Verified:</div>
        <div>
          <UIcon
            v-if="emailVerified"
            name="i-heroicons-check-circle"
            class="w-6 h-6 text-green-500"
          />
          <UIcon
            v-else
            name="i-heroicons-x-circle"
            class="w-6 h-6 text-red-500"
          />
        </div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>Lifetime Stars:</div>
        <div>{{ userData?.lifetime_points }}</div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>This Week's Stars:</div>
        <div>{{ userData?.weekly_points }}</div>
      </div>

      <!-- Contact Details -->
      <UDivider
        label="Contact Details"
        class="my-5"
        :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
      />
      <div class="flex justify-between">
        <div>Facebook:</div>
        <div>{{ userData?.user_contact_details.facebook_url ?? "-" }}</div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>Instagram:</div>
        <div>{{ userData?.user_contact_details.instagram_url ?? "-" }}</div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>Email:</div>
        <div>{{ userData?.user_contact_details.email_address ?? "-" }}</div>
      </div>
      <UDivider class="my-5" />
      <div class="flex justify-between">
        <div>SMS:</div>
        <div>{{ userData?.user_contact_details.sms ?? "-" }}</div>
      </div>

      <!-- Earned Badges - TODO-->
      <!-- <UDivider
        label="Earned Badges"
        class="my-5"
        :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
      /> -->

      <!-- Daily Dozen -->
      <UDivider
        label="Daily Dozen"
        class="my-5"
        :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
      />
      <div class="grid grid-cols-4 gap-3">
        <div class="col-span-2 flex items-center justify-center font-semibold">
          Name
        </div>
        <div class="flex items-center justify-center font-semibold">
          This Month Qty
        </div>
        <div class="flex items-center justify-center font-semibold">
          Last Month Qty
        </div>
      </div>
      <div
        v-for="tracker in userData?.trackers"
        :key="tracker.title"
        class="grid grid-cols-4 gap-3 py-3 border-t-2"
      >
        <div class="col-span-2">
          <div class="font-semibold">{{ tracker.title }}</div>
          <div class="ml-4"># {{ tracker.count_sub_title_plural }}</div>
        </div>
        <div class="flex items-center justify-center">
          {{ tracker.this_month_qty }}
        </div>
        <div class="flex items-center justify-center">
          {{ tracker.last_month_qty }}
        </div>
      </div>

      <!-- Courses -->
      <UDivider
        label="Courses & Lessons"
        class="my-5"
        :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
      />

      <div
        v-for="course in userData?.courses"
        :key="course.order"
        class="max-w-[600px] mx-auto"
      >
        <details>
          <summary>
            <div class="font-semibold">{{ course.title }}</div>

            <div>
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
            </div>
          </summary>
          <div v-for="(lesson, index) in course.lessons" :key="lesson.order">
            <div class="flex py-2">
              <div class="text-primary font-bold p-2 text-2xl">
                {{ index + 1 }}
              </div>
              <div class="ml-3 font-semibold my-3 grow">
                {{ lesson.title }}
              </div>

              <div class="my-3">
                <UIcon
                  v-if="lesson.completed"
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-500"
                />
                <UIcon
                  v-else="lesson.completed"
                  name="i-heroicons-x-circle"
                  class="w-6 h-6 text-red-700"
                />
              </div>
            </div>
            <hr v-if="index + 1 !== course.lessons.length" />
          </div>
        </details>
        <UDivider class="my-4" />
      </div>
      <!-- end courses -->
    </div>
  </div>
</template>
