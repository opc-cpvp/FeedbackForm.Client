<template>
  <div class="radio">
    <label :for="labelFor">
      <input
        :id="id"
        :name="name"
        type="radio"
        @change="updateSelected"
        :value="optionValue"
      />
    <slot></slot>
    </label>
  </div>
</template>

<script>

export default {
  name: 'RadioItem',
  props: {
    optionValue: {
      type: [String, Number],
      default: ''
    },
    labelFor: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateSelected: function() {
        this.$emit('input', this.optionValue);
    }
  }
}
</script>