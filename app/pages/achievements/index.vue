<script setup lang="ts">
import { CommonConfirmation } from "#components";
import type { Achievement } from "~/types/achievements";
import type { User } from "@/types/auth";
definePageMeta({
  middleware: ["sanctum:auth"],
});
const { user } = useSanctumAuth<User>();
const dayjs = useDayjs();
const sanctumFetch = useSanctumClient();
const achievements = ref<Achievement[]>([]);
const isModalOpen = ref<boolean>(false);
const isNeedsProfileModalOpen = ref<boolean>(false);
const toast = useToast();
const selectedForClaim = ref<Achievement>();
const { asset } = useUtils();

const fetchAchievements = async () => {
  await sanctumFetch("/api/achievements").then((res) => {
    achievements.value = res.data;
  });
};

const totalAchieved = computed(() => {
  const awarded = achievements.value.filter((item) => {
    return item.is_awarded;
  });
  return awarded.length;
});

const submitClaim = async () => {
  if (selectedForClaim.value) {
    await sanctumFetch("/api/achievements", {
      method: "post",
      body: { id: selectedForClaim.value.id },
    }).then((res) => {
      isModalOpen.value = false;
      fetchAchievements();
      toast.add({
        title: "Success",
        description: "Request submitted successfully  ",
      });
    });
  }
};
onMounted(() => {
  fetchAchievements();
});
</script>

<template>
  <PageHeader sub-title="Achievements" title="My Achievements" />

  <UAlert
    icon="i-heroicons-trophy"
    :description="`You have completed ${totalAchieved} / ${achievements.length} achievements!`"
    color="green"
    variant="soft"
  />
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="" v-for="achievement in achievements">
      <UCard>
        <template #header>
          <span class="font-semibold">{{ achievement.name }}</span>
        </template>
        <div>
          <img
            class="w-36 mx-auto"
            :class="{
              'opacity-25': !achievement.is_awarded,
              'opacity-100': achievement.is_awarded,
            }"
            :src="asset(achievement.badge_url)"
          />
        </div>
        <UDivider class="my-5" />
        <div class="text-sm text-center">{{ achievement.description }}</div>
        <template #footer>
          <div class="text-center" v-if="!achievement.claimable">
            This achievement is awarded automatically when you complete its
            requirements.
          </div>
          <div
            class="text-center"
            v-else-if="
              !achievement.is_awarded &&
              achievement.claimable &&
              achievement.pending_approval_count === 0
            "
          >
            <UButton
              v-if="user?.company_account_name"
              @click="
                isModalOpen = true;
                selectedForClaim = achievement;
              "
              >Claim</UButton
            >
            <UButton v-else @click="isNeedsProfileModalOpen = true"
              >Claim</UButton
            >
          </div>
          <div
            class="flex justify-center gap-2 items-center font-bold py-1"
            v-else-if="
              !achievement.is_approved &&
              achievement.claimable &&
              // achievement.pending_approval_count > 0 &&
              achievement.requires_approval
            "
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-6 h-6 text-orange-400"
            />
            <span>Your award is waiting for approval.</span>
          </div>
          <div class="text-center" v-else-if="achievement.awarded_at">
            <div class="flex gap-3 justify-center">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-8 h-8 text-green-500"
              />
              <div class="text-center font-semibold mt-1">
                Achieved:
                {{ dayjs(achievement.awarded_at).format("MMMM YYYY") }}
              </div>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <CommonConfirmation
      v-model="isModalOpen"
      title="Confirm Badge Achievement"
      text="Yes, I've met all the requirements for this badge"
      :image="selectedForClaim?.badge_url"
      @confirm="submitClaim"
      @cancel="isModalOpen = false"
    />

    <UModal v-model="isNeedsProfileModalOpen" prevent-close>
      <div
        class="p-4 text-center flex flex-col gap-4 max-w-fit mx-auto items-center"
      >
        <h2 class="font-bold text-lg">We need your Nu Skin account name!</h2>
        <p>Please complete your profile to claim this badge.</p>

        <div class="flex justify-between py-4 gap-3">
          <UButton color="gray" @click="isNeedsProfileModalOpen = false"
            >Cancel</UButton
          >
          <UButton color="primary" to="/settings/general"
            >Go to settings</UButton
          >
        </div>
      </div>
    </UModal>
  </div>
</template>
