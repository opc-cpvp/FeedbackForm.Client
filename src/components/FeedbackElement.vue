<template>
  <div>
    <feedback-helpful
      v-if="this.feedbackType === 'helpful'"
      :feedbackApi="this.feedbackApi"
    />
    <feedback-problem
      v-if="this.feedbackType === 'problem'"
      :feedbackApi="this.feedbackApi"
    />
  </div>
</template>

<script>
import FeedbackHelpful from "./FeedbackHelpful.vue";
import FeedbackProblem from "./FeedbackProblem.vue";

export default {
  components: {
    FeedbackHelpful,
    FeedbackProblem,
  },
  props: {
    feedbackApi: {
      type: String,
      default: null,
      required: false,
    },
    feedbackType: {
      type: String,
      default: "",
      required: true,
      validator: (value) => {
        return ["helpful", "problem"].includes(value);
      },
    },
    locale: {
      type: String,
      default: "en",
    },
  },
  created: function () {
    this.$i18n.locale = this.locale;
  },
};
</script>