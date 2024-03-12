<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";
import type { User } from "~/types/auth";

const sanctumFetch = useSanctumClient();
const user = useSanctumUser<User>();
const isLoading = ref<boolean>(false);
  const { refreshIdentity } = useSanctumAuth();
const toast = useToast();
const { handle } = useErrorHandler();

const schema = z
  .object({
    current_password: z.string().min(1),
    new_password: z
      .string()
      .min(8, "password should have atleast 8 characters!"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type Schema = z.output<typeof schema>;
const form = ref<Form<Schema>>();

const state = reactive({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const onSubmit = async(event: FormSubmitEvent<Schema>) => {
  form.value?.clear();

  try {
    isLoading.value = true;
    await sanctumFetch(`/api/change-password`, {
      method: "POST",
      body: event.data,
    })
      .then(async(res) => {
        isLoading.value = false;
        toast.add({
          title: "Success",
          description: "Password updated sucessfully. Please login again",
          color: "green",
        });
        state.current_password = '';
        state.new_password = '';
        state.confirm_password = '';
      })
      .catch(err => {
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
        Please choose a strong password that contains letters and numbers.
      </div>

      <UFormGroup label="Current Password" name="current_password" required>
        <UInput
          type="password"
          v-model="state.current_password"
          placeholder="Current Password"
        />
      </UFormGroup>

      <UFormGroup label="New Password" name="new_password" required>
        <UInput
          type="password"
          v-model="state.new_password"
          placeholder="New Password"
        />
      </UFormGroup>

      <UFormGroup label="Confirm Password" name="confirm_password" required>
        <UInput
          type="password"
          v-model="state.confirm_password"
          placeholder="Confirm Password"
        />
      </UFormGroup>

      <UButton type="submit" :loading="isLoading"> Change Password </UButton>
    </UForm>
  </div>
</template>
