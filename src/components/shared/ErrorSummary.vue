<template>
    <section class="alert alert-danger" tabindex="-1">
        <h4><slot></slot></h4>
    </section>
</template>

<script>
export default {
  name: "ErrorSummary",
};
</script>
