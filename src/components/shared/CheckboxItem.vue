<template>
	<div class="checkbox">
		<label :for="labelFor">
			<input 
				:id="labelFor"
				:name="name"
				type="checkbox"
				:checked="checked" 
				@change="handleChange(value)"
			>
			<slot></slot>
		</label>
	</div>
</template>
    
<script setup>
import { useField } from "vee-validate";
import { onMounted, toRefs, watch } from "vue";

const props = defineProps({
	labelFor: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: ''
	},
	value: {
		type: String,
		required: true,
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
  
const emit = defineEmits(["resetCompleted", "hasError"]);

// Must use `toRef` to make the checkboxes names reactive
const { name, isReset } = toRefs(props);

const { checked, handleChange, resetField } = useField(name, props.rules, {
	type: 'checkbox',
	checkedValue: props.value,
});

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