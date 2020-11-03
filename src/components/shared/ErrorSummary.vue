<template>
    <section class="alert alert-danger" tabindex="-1">
        <h4>{{ error }}</h4>
    </section>
</template>

<script>
export default {
  name: "ErrorSummary",
  props: {
    error: String
  },
};
</script>
