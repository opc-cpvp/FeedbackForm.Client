<script>
import { defineComponent, provide, watchEffect } from 'vue'
import { I18nInjectionKey } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import fr from '../locales/fr.json'
import en from '../locales/en.json'

/**
 * create an i18n instance to host for other web components
 */

export default defineComponent({
  props: {
    locale: {
      type: String,
      default: 'en'
    }
  },
  setup(props) {
    const i18n = createI18n({
      locale: 'en',
      legacy: false,
      messages: {
        en,
        fr
      }
    });
    /**
     * provide i18n instance with `I18nInjectionKey` for other web components
     */
    provide(I18nInjectionKey, i18n)

    watchEffect(() => {
      i18n.global.locale.value = props.locale;
    });

    return {}
  }
})
</script>

<!-- template to slot the content -->
<template>
    <slot />
</template>