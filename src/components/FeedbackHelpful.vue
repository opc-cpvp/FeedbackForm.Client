<template>
  <aside aria-labelledby="feedbackDetails">
    <details>
      <summary id="feedbackDetails" class="btn btn-default">
        {{ $t("pageHelpful") }}
      </summary>
      <validation-observer v-slot="{ handleSubmit }" v-if="showForm">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <fieldset id="feedbackInputs">
            <legend class="required">
              <span class="field-name">{{ $t("selectOne") }}</span>
              <strong class="required">({{ $t("form.required") }})</strong>:
            </legend>
            <validation-provider
              name="selectOption"
              rules="required|oneOf:1,2"
              v-slot="{ errors }"
            >
              <radio-item
                v-model.number="feedback.answer"
                id="helpfulPageYes"
                name="helpfulAnswer"
                label-for="helpfulPageYes"
                option-value="1"
                @input="clearValues"
                >{{ $t("yes") }}</radio-item
              >
              <radio-item
                v-model.number="feedback.answer"
                id="helpfulPageNo"
                name="helpfulAnswer"
                label-for="helpfulPageNo"
                option-value="2"
                @input="clearValues"
                >{{ $t("no") }}</radio-item
              >
              <span class="label label-danger">{{ errors[0] }}</span>
            </validation-provider>
            <validation-provider
              name="comment"
              rules="max:750"
              v-slot="{ errors }"
            >
              <div v-if="feedback.answer == 1" class="form-group">
                <label for="commentHelpful"
                  >{{ $t("why") }}? {{ $t("provideDetails") }} ({{
                    $t("form.max750characters")
                  }})</label
                >
                <textarea
                  v-model="feedback.comment"
                  id="commentHelpful"
                  cols="20"
                  rows="2"
                  maxlength="750"
                  class="form-control"
                />
                <span class="label label-danger">{{ errors[0] }}</span>
              </div>
            </validation-provider>
            <fieldset id="feedbackNoFieldset" v-if="feedback.answer == 2">
              <legend class="required">
                <span class="field-name">{{ $t("form.selectOptions") }}</span>
                <strong class="required">({{ $t("form.required") }})</strong>:
              </legend>
              <validation-provider
                name="selectAllThatApply"
                rules="required"
                v-slot="{ errors }"
              >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="infoHardToUnderstand"
                  id="infoHardToUnderstand"
                  checked-value="infoHardToUnderstand"
                  @change="removeOtherIfChecked"
                  >{{ $t("infoHardToUnderstand") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="infoWrong"
                  id="infoWrong"
                  checked-value="infoWrong"
                  @change="removeOtherIfChecked"
                  >{{ $t("infoWrong") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="helpfulInfoOutdated"
                  id="helpfulInfoOutdated"
                  checked-value="infoOutdated"
                  @change="removeOtherIfChecked"
                  >{{ $t("infoOutdated") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="infoNotFound"
                  id="infoNotFound"
                  checked-value="infoNotFound"
                  @change="removeOtherIfChecked"
                  >{{ $t("infoNotFound") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="forHelpfulOther"
                  id="forHelpfulOther"
                  checked-value="other"
                  @change="onOtherChanged"
                  >{{ $t("form.other") }}</checkbox-item
                >
                <span class="label label-danger">{{ errors[0] }}</span>
              </validation-provider>
              <div v-if="isOtherChecked" class="form-group">
                <validation-provider
                  name="comment"
                  rules="max:750"
                  v-slot="{ errors }"
                >
                  <label for="commentOtherNotHelpful"
                    >{{ $t("why") }}? {{ $t("form.specify") }} ({{
                      $t("form.max750characters")
                    }})</label
                  >
                  <textarea
                    v-model="feedback.comment"
                    id="commentOtherNotHelpful"
                    cols="20"
                    rows="2"
                    maxlength="750"
                    class="form-control"
                  />
                  <span class="label label-danger">{{ errors[0] }}</span>
                </validation-provider>
              </div>
            </fieldset>
          </fieldset>
          <note-and-submit />
        </form>
      </validation-observer>
      <div v-if="submitSuccessful" id="feedbackSuccess">
        <feedback-confirmation />
      </div>
      <div v-if="hasError">
        <error-summary :error="error" />
      </div>
    </details>
  </aside>
</template>

<script>
import FeedbackConfirmation from "./shared/FeedbackConfirmation.vue";
import NoteAndSubmit from "./shared/NoteAndSubmit.vue";
import RadioItem from "./shared/RadioItem.vue";
import CheckboxItem from "./shared/CheckboxItem.vue";
import ErrorSummary from "./shared/ErrorSummary.vue";
import { FeedbackFields, Answer } from "../const";
import axios from "axios";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "FeedbackHelpful",
  components: {
    NoteAndSubmit,
    FeedbackConfirmation,
    RadioItem,
    CheckboxItem,
    ErrorSummary,
    ValidationProvider,
    ValidationObserver,
  },
  data: function () {
    return {
      feedback: {
        answer: Answer.NOT_ANSWERED,
        comment: "",
        reasons: [],
        nodeId: null,
        versionId: null,
        url: "",
      },
      submitSuccessful: false,
      showForm: true,
      error: "",
    };
  },
  props: {
    contentId: {
      type: Number,
      default: null,
    },
    feedbackApi: {
      type: String,
      default: null,
      required: false,
    },
    versionId: {
      type: String,
      default: null,
    },
  },
  computed: {
    isOtherChecked: function () {
      return this.feedback.reasons.indexOf(FeedbackFields.OTHER) > -1;
    },
    hasError: function () {
      return this.error.length > 0;
    },
  },
  methods: {
    onSubmit: function () {
      const axios = require("axios");

      this.feedback.nodeId = this.contentId;
      this.feedback.versionId = this.versionId;
      this.feedback.url = window.location.href;

      const apiUrl = this.feedbackApi || process.env.VUE_APP_FEEDBACK_API;

      axios
        .post(apiUrl, this.feedback)
        .then((response) => {
          this.showForm = false;
          this.submitSuccessful = true;
          this.error = "";
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              this.error = this.$i18n.t("errors.invalidRequest");
            }
          } else {
            this.error = this.$i18n.t("errors.somethingWentWrong");
            this.showForm = false;
          }
        });
    },
    onOtherChanged: function () {
      this.isOtherChecked
        ? this.unselectAllExceptOther()
        : this.unselectOther();
    },
    clearValues: function () {
      this.feedback.comment = "";
      this.feedback.reasons = [];
    },
    unselectAllExceptOther: function () {
      this.feedback.reasons = [FeedbackFields.OTHER];
    },
    unselectOther: function () {
      this.feedback.comment = "";
    },
    removeOtherIfChecked: function () {
      if (this.isOtherChecked) {
        this.feedback.reasons.splice(
          this.feedback.reasons.indexOf(FeedbackFields.OTHER),
          1
        );
      }
    },
  },
};
</script>

<style scoped>
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
form fieldset > div.form-group {
  margin-left: 20px;
}
form fieldset > div.form-group > label {
  font-weight: inherit;
}
form legend {
  font-size: inherit !important;
  margin-bottom: 5px !important;
}
details #validationSummary span.label {
  font-size: 100% !important;
  white-space: normal !important;
}
</style>

<i18n>
{
  "en": {
    "pageHelpful": "Was this page helpful?",
    "selectOne": "Please select one",
    "yes": "Yes",
    "no": "No",
    "why": "Why",
    "provideDetails": "Please provide details",
    "infoHardToUnderstand": "The information is hard to understand",
    "infoWrong": "The information is wrong",
    "infoOutdated": "The information is outdated",
    "infoNotFound": "I can't find the information I'm looking for"
  },
  "fr": {
    "pageHelpful": "Est-ce que cette information vous a été utile?",
    "selectOne": "Veuillez sélectionner une option",
    "yes": "Oui",
    "no": "Non",
    "why": "Pourquoi",
    "provideDetails": "Veuillez préciser",
    "infoHardToUnderstand": "L'information est difficile à comprendre",
    "infoWrong": "L'information est erronée",
    "infoOutdated": "L'information n'est plus à jour",
    "infoNotFound": "Je ne trouve pas l'information que je cherche"
  }
}
</i18n>