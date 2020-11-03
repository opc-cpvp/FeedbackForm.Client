<template>
    <div>
        <feedback-helpful v-if="this.feedbackType === 'helpful'" />
        <feedback-problem v-if="this.feedbackType === 'problem'" />
    </div>
</template>

<script>

import FeedbackHelpful from './FeedbackHelpful.vue'
import FeedbackProblem from './FeedbackProblem.vue'

export default {
    components: {
        FeedbackHelpful,
        FeedbackProblem
    },
    props:{
        locale: {
            type: String,
            default: 'en'
        },
        feedbackType: {
            type: String,
            default: '',
            required: true,
            validator: value => {
                return ['helpful', 'problem'].includes(value);
            }
        },
    },
    created: function() {
        this.$i18n.locale = this.locale;
    }
}
</script>