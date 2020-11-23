<template>
  <div>
    <feedback-helpful
      v-if="this.feedbackType === 'helpful'"
      :feedbackApi="this.feedbackApi"
      :contentId="this.contentId"
      :versionId="this.versionId"
    />
    <feedback-problem
      v-if="this.feedbackType === 'problem'"
      :feedbackApi="this.feedbackApi"
      :contentId="this.contentId"
      :versionId="this.versionId"
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
  data: function(){
    return {
      contentId: null,
      versionId: null
    }
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
    this.contentId = this.getMeta('pageContentId');
    this.versionId = this.getMeta('pageVersionId');

  },
  methods:{
    getMeta: function(metaName){
      const metaTag = document.querySelector('meta[name="' + metaName + '"]');
      if(metaTag){
        return metaTag.content;
      }
      return null;     
    },
  }   
};
</script>