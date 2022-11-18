<template>
<div>
    <h2 class="h5">{{t('thankYouForFeedback')}}!</h2>
    <p>{{t('contact.noReply')}}. {{t('contact.forEnquiries')}} <a :href="websiteBasePath + t('contact.opcContactLink')">{{t('contact.contactOpc')}}</a>.</p>
</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const websiteBasePath = "https://www.priv.gc.ca";
</script>
