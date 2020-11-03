import { extend, configure } from 'vee-validate'
import { required, max, oneOf } from 'vee-validate/dist/rules'
import { i18n } from './i18n'

configure({
  defaultMessage: (field, values) => {
    // override vee-validate field name
    values._field_ = i18n.t(`fields.${field}`);

    return i18n.t(`veeValidate.validation.${values._rule_}`, values);
  }
});

extend('required', required);

extend('max', max);

extend('oneOf', {
    ...oneOf,
});