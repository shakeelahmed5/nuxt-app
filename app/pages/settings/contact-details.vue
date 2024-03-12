<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";
import type { User } from "~/types/auth";

const sanctumFetch = useSanctumClient();
const user = useSanctumUser<User>();
const toast = useToast();
const { handle } = useErrorHandler();

const schema = z.object({
  facebook_url: z.any(),
  instagram_url: z.any(),
  email_address: z.any(),
  sms: z.any(),
});

type Schema = z.output<typeof schema>;
const form = ref<Form<Schema>>();
const isLoading = ref<boolean>(false);

const state = reactive({
  facebook_url: user.value?.user_contact_details?.facebook_url,
  instagram_url: user.value?.user_contact_details?.instagram_url,
  email_address: user.value?.user_contact_details?.email_address,
  sms: user.value?.user_contact_details?.sms,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true;
    await sanctumFetch(`/api/update-user-contact-details`, {
      method: "POST",
      body: {
        facebook_url: event.data.facebook_url,
        instagram_url: event.data.instagram_url,
        email_address: event.data.email_address,
        sms: event.data.sms,
      },
    })
      .then((res) => {
        isLoading.value = false;
        toast.add({
          title: "Success",
          description: "Contact details updated successfully.",
          color: "green",
        });
      })
      .catch((err) => {
        isLoading.value = false;
        handle(err, form);
      });
  } catch (error) {
    const err = useSanctumError(error);

    if (err.isValidationError) {
      form.value?.setErrors(err.bag);
    }
  }
}
</script>

<template>
  <div>
    <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="header-subtitle my-4">
        The following information will be shown to your team as a way to contact
        you.
      </div>

      <UFormGroup label="Facebook Url" name="facebook_url">
        <UInput
          v-model="state.facebook_url"
          placeholder="https://facebook.com/my-username"
        />
      </UFormGroup>

      <UFormGroup label="Instagram Url" name="instagram_url">
        <UInput
          v-model="state.instagram_url"
          placeholder="https://instagram.com/my-username"
        />
      </UFormGroup>

      <UFormGroup label="Email Address" name="email_address">
        <UInput v-model="state.email_address" placeholder="Email Address" />
      </UFormGroup>

      <UFormGroup label="SMS" name="sms">
        <UInput v-model="state.sms" placeholder="SMS" />
      </UFormGroup>

      <UButton type="submit" :loading="isLoading"> Update </UButton>
    </UForm>
  </div>
</template>
