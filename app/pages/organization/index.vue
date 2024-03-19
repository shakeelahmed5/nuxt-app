<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import type { User } from "~/types/auth";
import type { OrgUser } from "@/types/organization.js";

definePageMeta({
  middleware: ["sanctum:auth"],
});

const dayjs = useDayjs();
const sanctumFetch = useSanctumClient();
const { user } = useSanctumAuth<User>();

const organizaiton = ref<OrgUser[]>([]);
const currentOrganizationUserId = ref(user.value?.id);

const isLoading = ref(true);

const getOrganization = async () => {
  await sanctumFetch("/api/organization").then((res) => {
    organizaiton.value = res.data;

    organizaiton.value.forEach((org) => {
      isOpen.set(org.uuid, false);
    });
    isLoading.value = false;
  });
};

const changeOrganization = (id: number | undefined) => {
  searchQuery.value = "";

  currentOrganizationUserId.value = id;

  window.scrollTo(0, 0);
};

// Activity Badge
const calcLastActiveDays = (date: string) => {
  const countDaysAgo = dayjs().diff(dayjs(date), "days");

  if (countDaysAgo === 0) return "Last active today";

  if (countDaysAgo === 1) return "Last active yesterday";

  return `Last active ${countDaysAgo} days ago`;
};

const calcLastActiveColor = (date: string) => {
  const countDaysAgo = dayjs().diff(dayjs(date), "days");

  if (countDaysAgo <= 3) return "bg-green-500";

  if (countDaysAgo > 3 && countDaysAgo <= 5) return "bg-yellow-500";

  if (countDaysAgo > 5 && countDaysAgo <= 7) return "bg-orange-500";

  return "bg-red-500";
};

// current user
const currentUser = computed(() => {
  const filteredArray = organizaiton.value.filter((user) => {
    return user.id === currentOrganizationUserId.value;
  });
  return filteredArray[0];
});

// Search
const searchQuery = ref("");
const debouncedSearchTerm = ref("");

const debouncedSearch = useDebounceFn(() => {
  debouncedSearchTerm.value = searchQuery.value;
}, 300);

watch(searchQuery, () => {
  debouncedSearch();
});

// change org and filter
const currentOrganiztion = computed(() => {
  if (debouncedSearchTerm.value.length > 0) {
    return organizaiton.value
      .filter((user) => {
        return user.full_name
          .toLowerCase()
          .includes(debouncedSearchTerm.value.toLowerCase());
      })
      .map((user) => {
        if (organizaiton.value.some((u) => u.parent_id === user.id)) {
          return { ...user, hasDecendants: true };
        } else {
          return { ...user, hasDecendants: false };
        }
      });
  }

  return organizaiton.value
    .filter((user) => {
      return user.parent_id === currentOrganizationUserId.value;
    })
    .map((user) => {
      if (organizaiton.value.some((u) => u.parent_id === user.id)) {
        return { ...user, hasDecendants: true };
      } else {
        return { ...user, hasDecendants: false };
      }
    });
});

// show user details
const isOpen = reactive(new Map<string, boolean>());

const showUserDetails = (uuid: string) => {
  const openState = isOpen.get(uuid);
  isOpen.set(uuid, !openState);
};

onMounted(() => {
  getOrganization();
});
</script>

<template>
  <div class="w-full md:max-w-[600px] mx-auto">
    <div v-if="isLoading">
      <UCard>
        <div class="flex items-center space-x-4">
          <USkeleton class="h-20 w-20" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </UCard>
      <UCard class="mt-8">
        <div class="flex items-center space-x-4">
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </UCard>
    </div>
    <div v-else>
      <!-- back button -->
      <UButton
        v-show="currentUser?.parent_id"
        icon="i-heroicons-arrow-left"
        size="sm"
        @click="changeOrganization(currentUser?.parent_id)"
        class="mb-3"
        >Back</UButton
      >
      <!-- seach bar -->
      <UInput placeholder="Search..." class="mb-5" v-model="searchQuery" />

      <!-- organization header -->
      <UCard>
        <div class="flex flex-row">
          <UAvatar
            size="3xl"
            class="mx-3"
            :src="currentUser?.avatar"
            :alt="currentUser?.full_name"
          />
          <div class="content-center">
            <div class="font-semibold text-lg">
              {{ currentUser?.full_name }}'s Organization
            </div>
            <div v-show="!currentUser?.parent_id">
              Total Team Members:
              {{ organizaiton.length - 1 }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- organization cards -->
      <UCard class="mt-8" :ui="{ body: { padding: 'sm:px-4 sm:py-3' } }">
        Count:
        {{ currentOrganiztion.length }}
      </UCard>

      <!-- Org Loop -->
      <div>
        <UCard v-for="item in currentOrganiztion" :key="item.id" class="mt-8">
          <div class="flex flex-row">
            <div class="text-center content-center">
              LVL<br />{{ item.level }}
            </div>
            <UAvatar
              size="lg"
              class="mx-3 content-center"
              :src="item.avatar"
              :alt="item.full_name"
            />

            <div class="grow">
              <div class="font-semibold">{{ item.full_name }}</div>
              <div>
                <div class="flex flex-row text-xs">
                  <span
                    :class="calcLastActiveColor(item.last_activity_at)"
                    class="flex rounded-full h-3 w-3 mt-1"
                  ></span>
                  <div class="ml-1">
                    {{ calcLastActiveDays(item.last_activity_at) }}
                  </div>
                </div>
              </div>
            </div>

            <UButton
              icon="i-heroicons-arrow-down"
              size="xl"
              color="primary"
              square
              variant="link"
              class="font-extrabold"
              @click="showUserDetails(item.uuid)"
            />

            <UButton
              v-if="item.hasDecendants"
              icon="i-heroicons-arrow-right"
              size="xl"
              color="primary"
              square
              variant="link"
              @click="changeOrganization(item.id)"
              class="font-extrabold"
            />
          </div>

          <OrganizationUserDetails
            :uuid="item.uuid"
            v-show="isOpen.get(item.uuid)"
          />
        </UCard>
      </div>
    </div>
  </div>
</template>
