import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './translations.js'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages: messages
});

export { i18n };