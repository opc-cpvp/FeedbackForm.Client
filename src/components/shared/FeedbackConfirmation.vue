<template>
<div>
    <h2 class="h5">{{$t('thankYouForFeedback')}}!</h2>
    <p>{{$t('contact.noReply')}}. {{$t('contact.forEnquiries')}} <a :href="websiteBasePath + $t('contact.opcContactLink')">{{$t('contact.contactOpc')}}</a>.</p>
</div>
</template>

<script>
export default {
    data() {
      return {
          websiteBasePath: "https://www.priv.gc.ca"
      }
  }
}
</script>

<i18n>
{
  "en": {
    "thankYouForFeedback": "Thank you for your feedback"
  },
  "fr": {
    "thankYouForFeedback": "Merci de votre rétroaction"
  }
}
</i18n>