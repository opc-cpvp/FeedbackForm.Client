<template>
	<div>
	<label :for="labelFor">
		<slot></slot>
	</label>
	<textarea
		:id="id"
		:name="name"
		cols="20"
		rows="2"
		:value="inputValue"
		:maxLength="maxLength"
		class="form-control"
		@input="handleChange"
	/>
	</div>
</template>

<script setup>

import { toRefs, watch, onMounted } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
	id: {
		type: String,
		default: '',
	},
  labelFor: {
    type: String,
    default: '',
  },
	maxLength:{
		type: Number,
		default: 5000
	},
  value: {
    type: String,
		default: ''
  },
  name: {
    type: String,
    default: ''
  },
  isReset: {
		type: Boolean,
		default: false
  },
  rules: {
		type: Object,
		default: undefined
  }
});

const emit = defineEmits(["resetCompleted"]);

const { name, isReset } = toRefs(props);
const { value:inputValue, handleChange, resetField } = useField(name, props.rules);

watch(isReset, () => {
	onReset();
});

onMounted(() => {
	onReset();
});

const onReset = () => {
	if(isReset.value){
		resetField();
		emit("resetCompleted");
	}
};
</script>