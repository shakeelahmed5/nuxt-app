<script setup lang="ts">
import type { User } from "~/types/auth";
import type { Country } from "~/types/common";
import UploadAvatar from "@/components/UploadAvatar.vue";

const sanctumFetch = useSanctumClient();
const user = useSanctumUser<User>();
const { save, schema, isLoading, croppedImageCanvas, form } = useProfile();
const { asset } = useUtils();

const countries: Country[] | undefined = await sanctumFetch("/api/countries")
  .then((res) => res.data)
  .catch((error) => {
    console.error(error);
  });

const state = reactive<User>({
  first_name: user?.value?.first_name,
  last_name: user?.value?.last_name,
  email: user?.value?.email,
  avatar: user?.value?.avatar,
  my_why: user?.value?.my_why || "",
  city: user?.value?.city || "",
  country: countries
    ? countries.find((c) => c.value === user?.value?.country_id)
    : {},
  country_id: user?.value?.country_id,
  postal_code: user?.value?.postal_code || "",
  company_account_name: user?.value?.company_account_name || "",
});

const isModalOpen = ref<boolean>(false);

const getCroppedImageData = (croppedImageData: HTMLCanvasElement) => {
  state.avatar = croppedImageData.toDataURL();
  croppedImageCanvas.value = croppedImageData;
};
</script>

<template>
  <div>
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="save"
    >
      <div class="flex gap-3 items-center">
        <UAvatar :src="asset(state.avatar)" alt="Avatar" size="3xl" />
        <div>
          <UButton label="Upload Avatar" @click="isModalOpen = true" />
        </div>
      </div>
      <UFormGroup label="First Name" name="first_name">
        <UInput v-model="state.first_name" />
      </UFormGroup>
      <UFormGroup label="Last Name" name="last_name">
        <UInput v-model="state.last_name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Countries" name="country">
        <CommonCountryDropdown
          v-model="state.country_id"
          return-value="value"
        />
      </UFormGroup>

      <UFormGroup label="City" name="city">
        <UInput v-model="state.city" />
      </UFormGroup>

      <UFormGroup label="Potal code" name="postal_code">
        <UInput v-model="state.postal_code" />
      </UFormGroup>

      <UFormGroup
        label="My Why"
        name="my_why"
        description="Why did you start Nu Skin? What are you hoping to accomplish?"
      >
        <UTextarea v-model="state.my_why" />
      </UFormGroup>

      <UFormGroup
        label="Name on your Nu Skin account"
        name="company_account_name"
      >
        <UInput v-model="state.company_account_name" />
      </UFormGroup>

      <UButton type="submit" :loading="isLoading"> Submit </UButton>
    </UForm>

    <!-- UploadAvatar component with v-model binding -->
    <UploadAvatar
      v-model:isOpen="isModalOpen"
      :userAvatar="state.avatar"
      @image-url="getCroppedImageData"
    />
  </div>
</template>
