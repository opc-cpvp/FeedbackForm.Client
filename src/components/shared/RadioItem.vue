<template>
  <div class="radio">
    <label :for="labelFor">
      <input
        :id="labelFor"
        :name="name"
        type="radio"
        @change="handleChange(value)"
        :value="value"
      />
    <slot></slot>
    </label>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  labelFor: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  rules:{
    type: Object,
    default: undefined
  }
});

const { name } = toRefs(props);

const { handleChange } = useField(name, props.rules, {
  type: "radio"
});

</script>
