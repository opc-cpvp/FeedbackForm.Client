import { defineCustomElement } from 'vue';
import FeedbackHelpful from './components/FeedbackHelpful.ce.vue';
import FeedbackProblem from './components/FeedbackProblem.ce.vue';
import I18nHost from './components/I18nHost.ce.vue';

const FeedbackHelpfulElement = defineCustomElement(FeedbackHelpful);
const FeedbackProblemElement = defineCustomElement(FeedbackProblem);
const I18nHostElement = defineCustomElement(I18nHost);

customElements.define("i18n-host", I18nHostElement);
customElements.define("feedback-helpful", FeedbackHelpfulElement);
customElements.define("feedback-problem", FeedbackProblemElement);
