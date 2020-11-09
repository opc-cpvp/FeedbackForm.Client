import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { i18n } from './i18n'
import './vee-validate'

import FeedbackElement from './components/FeedbackElement.vue'

import VueCustomElement from 'vue-custom-element'
// Older browser support of vue-custom-element
import 'document-register-element/build/document-register-element'

Vue.use(VueAxios, axios)
Vue.use(VueCustomElement)

Vue.customElement('feedback-element', FeedbackElement, {
  beforeCreateVueInstance(RootComponentDefinition) {
    // Set locale globally on the component
    RootComponentDefinition.i18n = i18n;
    return RootComponentDefinition
  },
});

