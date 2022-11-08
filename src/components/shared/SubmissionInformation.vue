<template>
    <div>
        <div class="alert alert-info">
            <h2 class="h5">{{ t('note')}}</h2>
            <ul>
                <!-- <li><small><strong>{{ $t('contact.noReply')}}.</strong> {{ $t('contact.forEnquiries')}} <a :href="websiteBasePath + $t('contact.opcContactLink')">{{ $t('contact.contactOpc')}}</a>.</small></li> -->
                <li><small><strong>{{ t('noPersonalInfo')}},</strong> {{ t('personalInfoItems')}}.</small></li>
                <li>
                    <small>
                        <strong>{{ t('forMoreInfo')}}</strong>, {{ t('referTo')}} <a :href="`${websiteBasePath}${t('termsOfUseLink')}`">{{ t('termsOfUse')}}</a>.
                    </small>
                </li>
            </ul>
        </div>
        <div>
            <button class="btn btn-primary">Submit
            <!-- {{$t('form.submit')}} -->
        </button>
        </div>
    </div> 
</template>

<script setup>
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();
    const websiteBasePath = "https://www.priv.gc.ca";
</script>
