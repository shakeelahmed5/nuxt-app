<script lang="ts" setup>
import type { User } from "@/types/auth";
import { CalendarHeatmap } from "vue3-calendar-heatmap";
import { useWindowSize } from "@vueuse/core";
import type { Dashboard } from "@/types/dashboard";

definePageMeta({
  middleware: ["sanctum:auth"],
});

const { asset } = useUtils();
const { user } = useSanctumAuth<User>();

// Window Size
const { width } = useWindowSize();
const heatmapVertical = computed(() => {
  return width.value < 600 ? true : false;
});

// Date
const dayjs = useDayjs();
const date = dayjs().format("YYYY-MM-DD");

// Data
const sanctumFetch = useSanctumClient();

const dashboard = ref<Dashboard>();

const getDashboard = async () => {
  await sanctumFetch("/api/dashboard", {
    method: "POST",
    body: { date },
  }).then((res) => {
    dashboard.value = res.data;
  });
};

onMounted(() => {
  getDashboard();
});
</script>

<template>
  <div v-if="dashboard">
    <PageHeader sub-title="Overview" title="Dashboard" />

    <!-- Welcome card -->
    <!-- show until they've completed a few lessons -->
    <UCard v-if="dashboard.welcome_message">
      <div class="flex flex-row">
        <UAvatar
          :src="dashboard.sponsor?.avatar"
          :alt="`${dashboard.sponsor?.first_name} ${dashboard.sponsor?.last_name}`"
          size="2xl"
        />
        <div class="ml-5">
          <div class="font-semibold">
            Welcome to the team, {{ user?.first_name }}!
          </div>
          <div class="mt-3 text-sm">
            We are excited to have you start this incredible journey. Now that
            you're registered, the best place to begin is by completing courses.
            These courses will teach you everything you need to know to be
            successful.
          </div>
          <div class="my-3 text-sm">- {{ dashboard.sponsor?.first_name }}</div>
          <UButton size="xs" to="/courses">Start Learning</UButton>
        </div>
      </div>
    </UCard>

    <!-- Verify email -->
    <!-- shown if email not verified -->
    <UAlert
      v-if="dashboard.email_verified_at === null"
      icon="i-heroicons-exclamation-triangle"
      color="yellow"
      title="Verify Your Email!"
      class="mt-6"
    >
      <template #description>
        <p class="mt-2">
          We sent you a welcome email. Please click the link in the email to
          verify your email address.
        </p>
        <p class="my-3">
          If you did't receive the email, we will gladly send you another.
        </p>
        <VerifyEmailResendNotificationButton /> </template
    ></UAlert>

    <!-- Email Undeliverable - Bounced -->
    <!-- shown if email bounced -->
    <UAlert
      v-if="dashboard.has_bounced_email === true"
      icon="i-heroicons-exclamation-circle"
      color="red"
      title="Your Email Was Rejected!"
      class="mt-6"
    >
      <template #description>
        <div class="mt-2">
          Oops! There was a problem getting your welcome emailed delivered. You
          won't be able to recieve any emails from us.
        </div>
        <div class="mt-3">Is your email address correct?</div>
        <div class="my-3 font-semibold">{{ user?.email }}</div>
        <UButton color="white" size="xs" to="/settings/general"
          >Update your email here</UButton
        >
        <div class="text-sm mt-3">
          If you are still having trouble, email us support@pacificallstars.com
        </div>
      </template></UAlert
    >

    <!-- Next Achievement -->
    <UCard class="mt-6">
      <template #header>Your Next Achievement Badge To Earn</template>

      <div class="text-center mb-4">
        <span class="font-semibold">{{ dashboard.next_achievement.name }}</span>
      </div>

      <div>
        <img
          class="w-36 mx-auto opacity-100"
          :src="asset(dashboard.next_achievement.badge_url)"
        />
      </div>
      <UDivider class="my-5" />
      <div class="text-sm text-center">
        {{ dashboard.next_achievement.description }}
      </div>
    </UCard>

    <!-- Learning Streak -->
    <UCard class="mt-6">
      <template #header>Your Activity Streak</template>
      <div class="text-sm">
        Consistency leads to greatness. Stay active everyday with completing
        lessons and logging Daily Dozen activities to extend your activity
        streak.
      </div>
      <div
        class="grid grid-cols-2 text-center mt-3 text-sm font-semibold border-b-2 pb-2"
      >
        <div>Current Day Streak</div>
        <div>Longest Day Streak</div>
      </div>
      <div class="grid grid-cols-2 text-center py-3 mt-3">
        <div class="border-r-2 text-5xl text-primary">
          {{ dashboard.current_learning_streak }}
        </div>
        <div class="text-5xl text-primary">
          {{ dashboard.longest_learning_streak }}
        </div>
      </div>
    </UCard>

    <!-- Stars -->
    <UCard class="mt-6">
      <template #header>Your Stars</template>
      <div class="text-sm">
        Earn stars by completing lessons and Daily Dozen activites. Your total
        stars allows you to be on the team leaderboard.
      </div>

      <div
        class="grid grid-cols-2 text-center mt-3 text-sm font-semibold border-b-2 pb-2"
      >
        <div>This Week Stars</div>
        <div>Lifetime Stars</div>
      </div>
      <div class="grid grid-cols-2 text-center py-3 mt-3">
        <div class="border-r-2 text-5xl text-primary">
          {{ dashboard?.weekly_points }}
        </div>
        <div class="text-5xl text-primary">
          {{ dashboard?.lifetime_points }}
        </div>
      </div>
    </UCard>

    <!-- HeatMap -->
    <UCard class="mt-6">
      <template #header> Your Daily Stars Over The Last Year </template>
      <div class="p-5 text-[8px]">
        <calendar-heatmap
          :vertical="heatmapVertical"
          :values="dashboard.heatmap"
          :end-date="$dayjs()"
          :round="2"
          :max="100"
          tooltip-unit="stars"
          :range-color="[
            '#EBEDF0',
            '#EBEDF0',
            '#D3C9F2',
            '#BBA5F3',
            '#A380F5',
            '#8B5CF6',
          ]"
        />
      </div>
    </UCard>
  </div>
</template>
