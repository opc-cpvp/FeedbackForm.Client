<template>
  <aside aria-labelledby="reportAProblem">
    <details class="brdr-0">
      <summary id="reportAProblem" class="btn btn-default">
        {{ t("reportProblem") }}
      </summary>
      <div class="well row">
        <!-- v-if show form -->
        <form @submit="onSubmit" v-if="showForm">
          <fieldset id="reportAProblemInputs">
            <legend class="required">
              <span class="field-name">{{ t("form.selectOptions") }}</span>
              <strong class="required">({{ t("form.required") }})</strong>:
            </legend>
            <!-- vee-validate parameters only have to be set on one element with the same name -->
            <checkbox-item name="reasons" id="pageHasBrokenLinks" value="brokenLinks" @change="handleReasonsChanged"
              :rules="{ required: true }">
              {{ t("brokenLinks") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="pageHasSpellingOrGrammarMistakes" value="spellingOrGrammarMistakes"
              @change="handleReasonsChanged">
              {{ t("spellingOrGrammarMistakes") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="problemInfoOutdated" value="infoOutdated" @change="handleReasonsChanged">
              {{ t("infoWrongOrOutdated") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="problemOtherReason" value="other" @change="handleReasonOtherChanged">
              {{ t("form.other") }}
            </checkbox-item>
            <span class="label label-danger">{{ errors.reasons }}</span>
            <div v-if="isReasonOtherSelected" class="form-group">
              <textarea-input name="comment" id="commentHelpful" maxLength.number="750"
                :rules="{ required: true, max: 750 }" :is-reset="isResetComment"
                @reset-completed="handleResetCommentCompleted">{{ t("form.specify") }} ({{
    t("form.max750characters")
}})
              </textarea-input>
              <span class="label label-danger">{{ errors.comment }}</span>
            </div>
          </fieldset>

          <!-- Limitation: Can't pass i18n from a custom component to a vue component -->
          <div>
            <div class="alert alert-info">
              <h2 class="h5">{{ t('submissionInformation.note') }}</h2>
              <ul>
                <li><small><strong>{{ t('contact.noReply') }}.</strong> {{ t('contact.forEnquiries') }} <a
                      :href="`${websiteBasePath}${t('contact.opcContactLink')}`">{{
    t('contact.contactOpc')
}}</a>.</small></li>
                <li><small><strong>{{ t('submissionInformation.noPersonalInfo') }},</strong> {{
    t('submissionInformation.personalInfoItems')
}}.</small></li>
                <li>
                  <small>
                    <strong>{{ t('submissionInformation.forMoreInfo') }}</strong>, {{
    t('submissionInformation.referTo')
}} <a :href="`${websiteBasePath}${t('submissionInformation.termsOfUseLink')}`">{{
    t('submissionInformation.termsOfUse')
}}</a>.
                  </small>
                </li>
              </ul>
            </div>
            <div>
              <button class="btn btn-primary">{{ t('form.submit') }}</button>
            </div>
          </div>
        </form>
        <div v-if="submitSuccessful" id="feedbackSuccess">
          <div>
            <h2 class="h5">{{ t('confirmation.thankYouForFeedback') }}!</h2>
            <p>{{ t('contact.noReply') }}. {{ t('contact.forEnquiries') }} <a
                :href="`${websiteBasePath}${t('contact.opcContactLink')}`">{{ t('contact.contactOpc') }}</a>.</p>
          </div>
        </div>
        <div v-if="hasError">
          <error-summary>{{ submitError }}</error-summary>
        </div>
      </div>
    </details>
  </aside>
</template>

<script setup>
import CheckboxItem from "./components/CheckboxItem.vue";
import TextareaInput from "./components/TextareaInput.vue";
import ErrorSummary from "./components/ErrorSummary.vue";
import { Reasons, Answer } from "./constants/responses";
import { setupValidation } from "./validation";
import axios from "axios";
import { setLocale } from "@vee-validate/i18n";
import { useForm, useFormValues } from 'vee-validate';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
setupValidation();
setLocale(locale.value);

const props = defineProps({
  contentId: {
    type: Number,
    default: null,
  },
  versionId: {
    type: String,
    default: null,
  },
  feedbackApi: {
    type: String,
    default: null,
  }
});

const websiteBasePath = import.meta.env.VITE_APP_BASE_URL;

// Initialize the form values in v-form
const formValues = {
  comment: "",
  reasons: []
};

const { setFieldValue, handleSubmit, errors } = useForm({
  initialValues: formValues,
});

const isResetComment = ref(false);

// Computed ref to the form values
const currentFormValues = useFormValues();

const submitSuccessful = ref(false);
const showForm = ref(true);
const submitError = ref("");

const onSubmit = handleSubmit(values => {
  const feedback = {
    nodeId: props.contentId,
    versionId: props.versionId,
    comment: values.comment,
    reasons: values.reasons,
    isHelpful: Answer.NO,
    isReportingAProblem: true,
    url: window.location.href
  };

  const apiUrl = props.feedbackApi || import.meta.env.VITE_APP_FEEDBACK_API;

  axios.post(apiUrl, feedback)
    .then(() => {
      showForm.value = false;
      submitSuccessful.value = true;
      submitError.value = "";
    }).catch((err) => {
      if (err.response?.status === 500) {
        submitError.value = t('errors.invalidRequest');
      } else {
        submitError.value = t('errors.serverError');
        showForm.value = false;
      }
    });
});

const isReasonOtherSelected = computed(() => currentFormValues.value.reasons.includes(Reasons.OTHER));
const hasError = computed(() => submitError.value !== "");

// When the user selects "Other" as a reason, unselect all other reasons
const handleReasonOtherChanged = () => isReasonOtherSelected.value ? setFieldValue("reasons", [Reasons.OTHER]) : unselectOther();

// When the user selects a value that isn't "Other" as a reason, unselect "Other"
const handleReasonsChanged = () => {
  isResetComment.value = true;
  if (isReasonOtherSelected.value) {
    unselectOther();
  }
}

const unselectOther = () => setFieldValue("reasons", currentFormValues.value.reasons.filter(reason => reason !== Reasons.OTHER));
const handleResetCommentCompleted = () => isResetComment.value = false;

</script>

<style scoped>
@import url("https://www.priv.gc.ca/wet/gcweb-opc/css/theme.min.css");
@import url("https://www.priv.gc.ca/css/opc-style.css");

details summary {
  text-align: left;
}

details #validationSummary span.label {
  font-size: 100% !important;
  white-space: normal !important;
}

form fieldset {
  border: none;
}

form legend {
  font-size: inherit !important;
  margin-bottom: 5px !important;
}

div#reportAProblem details summary {
  text-align: left;
}

div#reportAProblem details div#otherReasonComments3,
div#reportAProblem details #validationSummary2 {
  display: none;
  /*default - will be displayed by javascript code */
}

aside#feedbackSection details #validationSummary1 span.label,
div#reportAProblem details #validationSummary2 span.label {
  font-size: 100% !important;
  white-space: normal !important;
}

span.redspan {
  color: #d3080c;
}

div#reportAProblem form fieldset {
  border: none;
}

div#reportAProblem form legend {
  font-size: inherit !important;
  margin-bottom: 5px !important;
}
</style>
