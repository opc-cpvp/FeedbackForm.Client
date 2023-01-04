<template>
  <aside id="feedbackSection" aria-labelledby="feedbackDetails">
    <details>
      <summary id="feedbackDetails" class="btn btn-default">{{ t('pageHelpful') }}</summary>
      <form @submit="onSubmit" v-if="showForm">
        <fieldset id="feedbackInputs">
          <legend class="required">
            <span class="field-name">{{ t('selectOne') }}</span>
            <strong class="required"> ({{ t('form.required') }})</strong>:
          </legend>
          <!-- vee-validate parameters only have to be set on one element with the same name -->
          <radio-item id="helpfulPageYes" :value="Answer.YES" name="isHelpful" @input="handleIsHelpfulInput"
            :rules="{ one_of: [1, 2] }">
            {{ t("yes") }}
          </radio-item>
          <div class="form-group" v-if="getIsHelpful == Answer.YES">
            <textarea-input name="comment" id="commentHelpful" maxLength.number="750"
              :rules="{ required: true, max: 750 }" :is-reset="isResetComment"
              @reset-completed="handleResetCommentCompleted">
              {{ t("why") }}? {{ t("provideDetails") }} ({{ t("form.max750characters") }})
            </textarea-input>
            <span class="label label-danger">{{ errors.comment }}</span>
          </div>
          <radio-item id="helpfulPageNo" :value="Answer.NO" name="isHelpful" @input="handleIsHelpfulInput()"
            :rules="{ one_of: [1, 2] }">
            {{ t('no') }}
          </radio-item>
          <span class="label label-danger">{{ errors.isHelpful }}</span>
          <fieldset id="feedbackNoFieldset" v-if="getIsHelpful == Answer.NO">
            <legend class="required">
              <span class="field-name">{{ t("form.selectOptions") }}</span><strong class="required"> ({{
    t("form.required")
}})</strong>:
            </legend>
            <!-- vee-validate parameters only have to be set on one element with the same name -->
            <checkbox-item name="reasons" id="infoHardToUnderstand" :value="Reasons.INFO_HARD_TO_UNDERSTAND"
              :is-reset="isResetReasons" @reset-completed="handleResetReasonsCompleted" @change="handleReasonsChanged()"
              :rules="{ required: true }">
              {{ t("infoHardToUnderstand") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="infoWrong" :value="Reasons.INFO_WRONG" @change="handleReasonsChanged()">
              {{ t("infoWrong") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="helpfulInfoOutdated" :value="Reasons.INFO_OUTDATED"
              @change="handleReasonsChanged()">
              {{ t("infoOutdated") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="infoNotFound" :value="Reasons.INFO_NOT_FOUND"
              @change="handleReasonsChanged()">
              {{ t("infoNotFound") }}
            </checkbox-item>
            <checkbox-item name="reasons" id="helpfulOther" :value="Reasons.OTHER" @change="handleReasonOtherChanged()">
              {{ t("form.other") }}
              <div class="form-group" v-if="isReasonOtherSelected">
                <textarea-input name="comment" id="commentOtherNotHelpful" maxLength.number="5"
                  :rules="{ required: true, max: 750 }">
                  {{ t("why") }}? {{ t("provideDetails") }} ({{ t("form.max750characters") }})
                </textarea-input>
                <span class="label label-danger">{{ errors.comment }}</span>
              </div>
            </checkbox-item>
            <span class="label label-danger">{{ errors.reasons }}</span>
          </fieldset>
        </fieldset>
        <!-- Limitation: Can't pass i18n from a custom component to a vue component -->
        <div>
          <div class="alert alert-info">
            <h2 class="h5">{{ t('submissionInformation.note') }}</h2>
            <ul>
              <li><small><strong>{{ t('contact.noReply') }}.</strong> {{ t('contact.forEnquiries') }} <a
                    :href="`${websiteBasePath}${t('contact.opcContactLink')}`">{{ t('contact.contactOpc')
}}</a>.</small>
              </li>
              <li><small><strong>{{ t('submissionInformation.noPersonalInfo') }},</strong> {{
    t('submissionInformation.personalInfoItems')
}}.</small></li>
              <li><small><strong>{{ t('submissionInformation.forMoreInfo') }}</strong>, {{
    t('submissionInformation.referTo')
}} <a :href="`${websiteBasePath}${t('submissionInformation.termsOfUseLink')}`">{{
    t('submissionInformation.termsOfUse')
}}</a>.</small></li>
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
    </details>
  </aside>
</template>

<script setup>
import CheckboxItem from "./components/CheckboxItem.vue";
import ErrorSummary from "./components/ErrorSummary.vue";
import RadioItem from "./components/RadioItem.vue";
import TextareaInput from "./components/TextareaInput.vue";
import { Answer, Reasons } from "./constants/responses";
import { setupValidation } from "./validation";
import axios from "axios";
import { setLocale } from "@vee-validate/i18n";
import { useForm, useFormValues } from "vee-validate";
import { computed, ref } from "vue";
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
  isHelpful: Answer.NOT_ANSWERED,
  comment: "",
  reasons: []
};

const { setFieldValue, handleSubmit, errors } = useForm({
  initialValues: formValues
});

const isResetComment = ref(false);
const isResetReasons = ref(false);

// Computed ref to the form values
const currentFormValues = useFormValues();

const submitSuccessful = ref(false);
const showForm = ref(true);
const submitError = ref("");

const onSubmit = handleSubmit(values => {
  const feedback = {
    nodeId: props.contentId,
    versionId: props.versionId,
    isHelpful: parseInt(values.isHelpful),
    comment: values.comment,
    reasons: values.reasons,
    url: window.location.href
  };

  const apiUrl = props.feedbackApi || import.meta.env.VITE_APP_FEEDBACK_API;

  axios.post(apiUrl, feedback)
    .then(() => {
      showForm.value = false;
      submitSuccessful.value = true;
      submitError.value = "";
    }).catch((error) => {
      if (error.response?.status === 400) {
        submitError.value = t('errors.invalidRequest');
      } else {
        submitError.value = t('errors.serverError');
        showForm.value = false;
      }
    });
});

const getIsHelpful = computed(() => currentFormValues.value.isHelpful);
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

const handleIsHelpfulInput = () => {
  isResetReasons.value = true;
  isResetComment.value = true;
}

const unselectOther = () => setFieldValue("reasons", currentFormValues.value.reasons.filter(reason => reason !== Reasons.OTHER));
const handleResetCommentCompleted = () => isResetComment.value = false;
const handleResetReasonsCompleted = () => isResetReasons.value = false;

</script>

<style>
@import url("https://www.priv.gc.ca/wet/gcweb-opc/css/theme.min.css");
@import url("https://www.priv.gc.ca/css/opc-style.css");

details {
  border-color: #b31885;
}

details summary,
details summary:hover,
details summary:focus {
  background-color: #b31885;
  border-color: #b31885;
  color: white;
  font-weight: bold;
  text-align: left;
}

form fieldset {
  border: none;
}

form fieldset fieldset {
  margin-left: 30px;
  padding-top: 0px;
}

form fieldset>div.form-group {
  margin-left: 20px;
}

form fieldset>div.form-group>label {
  font-weight: inherit;
}

form legend {
  font-size: inherit !important;
  margin-bottom: 5px !important;
}

aside#feedbackSection details {
  border-color: #b31885;
}

aside#feedbackSection details summary {
  background-color: #b31885;
  border-color: #b31885;
  color: white;
  font-weight: bold;
  text-align: left;
}

aside#feedbackSection form fieldset {
  border: none;
}

aside#feedbackSection form fieldset fieldset {
  margin-left: 30px;
  padding-top: 0px;
}
aside#feedbackSection form fieldset>div.form-group {
  margin-left: 20px;
}

aside#feedbackSection form fieldset>div.form-group div>label {
  font-weight: inherit;
}

aside#feedbackSection form legend {
  font-size: inherit !important;
  margin-bottom: 5px !important;
}

.h5 {
  color: #b31885;
  font-weight: 500;
}
</style>
