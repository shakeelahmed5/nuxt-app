<script setup lang="ts">
const props = defineProps<{
  placeholder?: string;
  returnValue?: "name" | "value" | "object";
}>();
const modelValue = defineModel();
const sanctumFetch = useSanctumClient();
const country = computed({
  get() {
    if (props.returnValue !== "object") {
      return countries.find((item) => {
        return item[props.returnValue] == modelValue.value;
      });
    }
    return modelValue.value;
  },
  set(value) {
    modelValue.value =
      props.returnValue === "object" ? value : value[props.returnValue];
  },
});
const countries: Country[] | undefined = await sanctumFetch("/api/countries")
  .then((res) => res.data)
  .catch((error) => {
    console.error(error);
  });
</script>
<template>
  <USelectMenu
    v-model="country"
    :options="countries"
    :placeholder="props.placeholder || 'Select country'"
    :required="true"
    :searchable="true"
    name="country"
    by="value"
    option-attribute="name"
  />
</template>
