<script lang="ts" setup>
import type { User } from "~~/models/user";

const { user } = useSanctumAuth<User>();
const { logout } = useSanctumAuth();
const { asset } = useUtils();

const logoutItem = [
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-end-on-rectangle",
      click: async () => {
        await logout();
        window._paq.push(["setCustomUrl", "/logout"]);
        window._paq.push(["trackPageView"]);
        window._paq.push(["resetUserId"]);
      },
    },
  ],
];

const links = [
  [
    {
      label: "Dashboard",
      icon: "i-heroicons-home",
      to: "/dashboard",
      click: () => closeSlideOver(),
    },
    {
      label: "My Training",
      icon: "i-heroicons-book-open",
      to: "/courses",
      click: () => closeSlideOver(),
    },
  ],
  [
    {
      label: "Invite a New Team Member",
      icon: "i-heroicons-envelope",
      to: "/team/invites",
      click: () => closeSlideOver(),
    },
    {
      label: "View My Team",
      icon: "i-heroicons-users",
      to: "/organization",
      click: () => closeSlideOver(),
    },
  ],
  [
    {
      label: "Log Daily Dozen",
      icon: "i-heroicons-check",
      to: "/tracker/log/today",
      click: () => closeSlideOver(),
    },
    // {
    //   label: "View Daily Dozen",
    //   icon: "i-heroicons-chart-bar",
    //   to: "/tracker/view",
    //   click: () => closeSlideOver(),
    // },
  ],
  [
    {
      label: "Leaderboard",
      icon: "i-heroicons-star",
      to: "/leaderboard/this-week",
      click: () => closeSlideOver(),
    },
    {
      label: "Achievements",
      icon: "i-heroicons-trophy",
      to: "/achievements",
      click: () => closeSlideOver(),
    },
  ],
  // [
  //   {
  //     label: "Events",
  //     icon: "i-heroicons-calendar",
  //     to: "",
  //     click: () => closeSlideOver(),
  //   },
  // ],
  [
    {
      label: "Help",
      icon: "i-heroicons-lifebuoy",
      to: "/help",
      click: () => closeSlideOver(),
    },
    {
      label: "Feedback",
      icon: "i-heroicons-chat-bubble-left",
      to: "/feedback",
      click: () => closeSlideOver(),
    },
  ],
  [
    {
      label: "My Profile",
      icon: "i-heroicons-user-circle",
      to: "/settings/general",
      click: () => closeSlideOver(),
    },
  ],
];

const isSlideoverActive = ref(false);

function toggleSlideover() {
  isSlideoverActive.value = !isSlideoverActive.value;
}

function closeSlideOver() {
  isSlideoverActive.value = false;
}

// Light or Dark Mode
const mode = useNuxtApp().$colorMode;
</script>

<template>
  <div class="flex md:flex-col m-5 md:w-56">
    <UButton
      icon="i-heroicons-bars-3"
      variant="ghost"
      color="gray"
      class="md:hidden"
      @click="toggleSlideover"
    />

    <div class="mx-auto justify-center md:mb-4">
      <LogoLight
        v-if="mode.value === 'light'"
        class="w-[50px] h-[50px] md:w-[125px] md:h-[125px]"
      />
      <LogoDark v-else class="w-[50px] h-[50px] md:w-[125px] md:h-[125px]" />
    </div>

    <UVerticalNavigation
      :links="links"
      class="hidden md:block"
      :ui="{
        icon: {
          active: 'text-primary dark:text-gray-200',
          inactive:
            'text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-200',
        },
        active:
          'text-primary-500 dark:text-white before:bg-primary-100 dark:before:bg-gray-800',
      }"
    >
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UVerticalNavigation>

    <div class="mt-auto md:fixed md:bottom-0 md:w-56 md:p-4 md:mb-4">
      <div class="md:mx-auto flex justify-center">
        <UDropdown
          :items="logoutItem"
          mode="hover"
          :popper="{ placement: 'bottom-start' }"
        >
          <UAvatar
            size="lg"
            :src="asset(user?.avatar)"
            :alt="`${user?.first_name} ${user?.last_name}`"
            class="shadow-lg"
          />
        </UDropdown>
      </div>
    </div>

    <USlideover v-model="isSlideoverActive" side="left">
      <UCard
        class="flex flex-col flex-1"
        :ui="{ rounded: '', body: { base: 'h-full' } }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold"> Menu </span>

            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="toggleSlideover"
            />
          </div>
        </template>

        <UVerticalNavigation
          :links="links"
          :ui="{
            icon: {
              active: 'text-primary dark:text-gray-200',
              inactive:
                'text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-200',
            },
            active:
              'text-primary-500 dark:text-white before:bg-primary-100 dark:before:bg-gray-800',
          }"
        />

        <template #footer>
          <UVerticalNavigation
            :links="logoutItem"
            :ui="{
              icon: {
                active: 'text-primary dark:text-gray-200',
                inactive:
                  'text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-gray-200',
              },
              active:
                'text-primary-500 dark:text-white before:bg-primary-100 dark:before:bg-gray-800',
            }"
          />
        </template>
      </UCard>
    </USlideover>
  </div>
</template>
