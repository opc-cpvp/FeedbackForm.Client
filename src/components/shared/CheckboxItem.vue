<template>
<div class="checkbox">
    <label :for="labelFor">
        <input :id="id" :value="checkedValue" type="checkbox" :checked="verifyIfChecked" @change="updateInput">
        <slot></slot>
    </label>
    </div>
</template>

<script>
export default {
    name: 'CheckboxItem',
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        labelFor: {
            type: String,
            default: ''
        },
        checkedValue: {
            type: String,
            default: ''
        },
        modelValue: {
            default: false
        }
    },
    computed: {
        verifyIfChecked() {
            return this.modelValue.includes(this.checkedValue);               
        }
    },
    methods: {
        updateInput: function(event) {
            let isChecked = event.target.checked;
            let newValue = [...this.modelValue];
            if (isChecked) {
                newValue.push(this.checkedValue);
            } else {
                newValue.splice(newValue.indexOf(this.checkedValue), 1);
            }
            this.$emit('change', newValue);
        }
    }
}
</script>