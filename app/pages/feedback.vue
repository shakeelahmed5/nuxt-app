<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";

const isLoading = ref<boolean>(false);
const submitted = ref<boolean>(false);
const sanctumFetch = useSanctumClient();
// const { handle } = useErrorHandler();
const schema = z.object({
  positive: z.string(),
  negative: z.string(),
});
type Schema = z.output<typeof schema>;
const form = ref<Form<Schema>>();

const state = reactive({
  positive: "",
  negative: "",
});

const submit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  await sanctumFetch("api/feedbacks", {
    method: 'post',
    body: event.data,
  })
    .then((res) => {
      submitted.value = true;
    })
    .catch((err) => {
        // handle(form, err);
    })
    .finally(() => (isLoading.value = false));
};
</script>

<template>
  <PageHeader title="How are we doing?" sub-title="Feedback"> </PageHeader>

  <div class="w-full md:max-w-[600px] mx-auto">
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      @submit="submit"
      class="flex flex-col gap-4"
      v-if="!submitted"
    >
      <UFormGroup label="What are we doing right?" name="positive">
        <UTextarea v-model="state.positive" required />
      </UFormGroup>
      <UFormGroup label="How can we improve?" name="negative">
        <UTextarea v-model="state.negative" />
      </UFormGroup>
      <div class="text-center">
        <UButton type="submit" :loading="isLoading"> Submit </UButton>
      </div>
    </UForm>
    <div v-else>
        <Transition>
            <UAlert
              title="Success!"
              description="Thank you for your feedback! We are working hard to make things better and this helps!"
              color="green"
              variant="subtle"
            ></UAlert>
        </Transition>
    </div>
  </div>
</template>
