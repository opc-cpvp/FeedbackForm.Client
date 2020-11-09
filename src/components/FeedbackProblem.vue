<template>
  <aside aria-labelledby="reportAProblem">
    <details class="brdr-0">
      <summary id="reportAProblem" class="btn btn-default">
        {{ $t("reportProblem") }}
      </summary>
      <div class="well row">
        <validation-observer v-slot="{ handleSubmit }" v-if="showForm">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <fieldset id="reportAProblemInputs">
              <legend class="required">
                <span class="field-name">{{ $t("form.selectOptions") }} </span>
                <strong class="required">({{ $t("form.required") }})</strong>:
              </legend>
              <validation-provider
                name="selectAllThatApply"
                rules="required"
                v-slot="{ errors }"
              >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="pageHasBrokenLinks"
                  id="pageHasBrokenLinks"
                  checked-value="brokenLinks"
                  @change="removeOtherIfChecked"
                  >{{ $t("brokenLinks") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="pageHasSpellingOrGrammarMistakes"
                  id="pageHasSpellingOrGrammarMistakes"
                  checked-value="spellingOrGrammarMistakes"
                  @change="removeOtherIfChecked"
                  >{{ $t("spellingOrGrammarMistakes") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="problemInfoOutdated"
                  id="problemInfoOutdated"
                  checked-value="infoOutdated"
                  @change="removeOtherIfChecked"
                  >{{ $t("infoWrongOrOutdated") }}</checkbox-item
                >
                <checkbox-item
                  v-model="feedback.reasons"
                  label-for="problemOtherReason"
                  id="problemOtherReason"
                  checked-value="other"
                  @change="onOtherChanged"
                  >{{ $t("form.other") }}</checkbox-item
                >
                <span class="label label-danger">{{ errors[0] }}</span>
              </validation-provider>
              <validation-provider
                name="comment"
                rules="max:750"
                v-slot="{ errors }"
              >
                <div v-if="isOtherChecked" class="form-group">
                  <label for="commentOtherProblem"
                    >{{ $t("form.specify") }} ({{
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
                </div>
              </validation-provider>
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
      </div>
    </details>
  </aside>
</template>

<script>
import FeedbackConfirmation from "./shared/FeedbackConfirmation.vue";
import NoteAndSubmit from "./shared/NoteAndSubmit.vue";
import CheckboxItem from "./shared/CheckboxItem.vue";
import ErrorSummary from "./shared/ErrorSummary.vue";
import { FeedbackFields, Answer } from "../const";
import axios from "axios";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "FeedbackProblem",
  components: {
    NoteAndSubmit,
    FeedbackConfirmation,
    CheckboxItem,
    ErrorSummary,
    ValidationProvider,
    ValidationObserver,
  },
  data: function () {
    return {
      feedback: {
        answer: Answer.NO,
        comment: "",
        reasons: [],
        nodeId: null,
        versionId: null,
        url: "",
        isReportingAProblem: true,
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
        this.feedback.comment = "";
      }
    },
  },
};
</script>

<style scoped>
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
</style>

<i18n>
{
  "en": {
    "reportProblem": "Report a problem or mistake on this page",
    "brokenLinks": "There are broken links",
    "spellingOrGrammarMistakes": "The page has spelling or grammar mistakes",
    "infoWrongOrOutdated": "The information is wrong or outdated"
  },
  "fr": {
    "reportProblem": "Signaler un problème ou une erreur sur cette page",
    "brokenLinks": "Il y a des hyperliens brisés",
    "spellingOrGrammarMistakes": "Il y a des erreurs d'orthographe ou de grammaire",
    "infoWrongOrOutdated": "L'information est erronée ou n'est plus à jour"
  }
}
</i18n>