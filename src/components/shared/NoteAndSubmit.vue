<template>
    <div>
          <div class="alert alert-info">
              <h2 class="h5">{{ $t('note')}}</h2>
              <ul>
                  <li><small><strong>{{ $t('contact.noReply')}}.</strong> {{ $t('contact.forEnquiries')}} <a :href="websiteBasePath + $t('contact.opcContactLink')">{{ $t('contact.contactOpc')}}</a>.</small></li>
                  <li><small><strong>{{ $t('noPersonalInfo')}},</strong> {{ $t('personalInfoItems')}}.</small></li>
                  <li>
                      <small>
                          <strong>{{ $t('forMoreInfo')}}</strong>, {{ $t('referTo')}} <a :href="websiteBasePath + $t('termsOfUseLink')">{{ $t('termsOfUse')}}</a>.
                      </small>
                  </li>
              </ul>
          </div>
          <div>
              <button class="btn btn-primary">{{$t('form.submit')}}</button>
          </div>
        </div> 
</template>

<script>
export default {
  data() {
      return {
          websiteBasePath: "https://www.priv.gc.ca"
      }
  },
}
</script>

<i18n>
{
    "en":{
        "note": "Note",
        "noPersonalInfo": "Do not include any personal information",
        "personalInfoItems": "such as your name, social insurance number (SIN), home or business address or any case or files numbers",
        "forMoreInfo": "For more information about this tool",
        "referTo": "please refer to our",
        "termsOfUseLink": "/en/privacy-and-transparency-at-the-opc/terms-and-conditions-of-use/",
        "termsOfUse": "terms and conditions of use"
    },
    "fr":{
        "note": "Remarque",
        "noPersonalInfo": "N'inscrivez aucun renseignement personnel",
        "personalInfoItems": "comme votre nom, numéro d'assurances sociale (NAS), votre adresse au domicile ou au travail, ou encore les numéros de cas ou de dossiers",
        "forMoreInfo": "Pour plus d'information au sujet de cette fonctionnalité",
        "referTo": "veuillez consulter nos",
        "termsOfUseLink": "/fr/protection-de-la-vie-privee-et-transparence-au-commissariat/conditions-d-utilisation/",
        "termsOfUse": "conditions d'utilisation"
    }
}
</i18n>