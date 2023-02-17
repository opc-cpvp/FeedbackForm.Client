<template>
	<div>
		<label :for="id">
			<slot></slot>
		</label>
		<textarea :id="id" :name="name" :cols="cols" :rows="rows" :value="inputValue" :maxLength="maxLength"
			class="form-control" @input="handleChange" />
	</div>
</template>

<script setup>
import { useField } from "vee-validate";
import { toRefs, watch, onMounted } from "vue";

const props = defineProps({
	id: {
		type: String,
		default: '',
	},
	name: {
		type: String,
		default: ''
	},
	cols: {
		type: Number,
		default: 20
	},
	rows: {
		type: Number,
		default: 2
	},
	value: {
		type: String,
		default: ''
	},
	maxLength: {
		type: Number,
		default: 750
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

// Must use `toRef` to make the textarea inputs names reactive
const { name, isReset } = toRefs(props);
const { value: inputValue, handleChange, resetField } = useField(name, props.rules);

watch(isReset, () => {
	onReset();
});

onMounted(() => {
	onReset();
});

const onReset = () => {
	if (isReset.value) {
		resetField();
		emit("resetCompleted");
	}
};
</script>