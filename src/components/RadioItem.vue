<template>
  <div class="radio">
    <label :for="id">
      <input :id="id" :name="name" type="radio" @change="handleChange(value)" :value="value" />
      <slot></slot>
    </label>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { toRefs } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  rules: {
    type: Object,
    default: undefined
  }
});

// Must use `toRef` to make the radio inputs names reactive
const { name } = toRefs(props);

const { handleChange } = useField(name, props.rules, {
  type: "radio"
});

</script>
