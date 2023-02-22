import { configure, defineRule } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import { required, max, one_of } from "@vee-validate/rules";
import validation from "./locales/validation";
import fr from "@vee-validate/i18n/dist/locale/fr.json";
import en from "@vee-validate/i18n/dist/locale/en.json";

export const setupValidation = () => {

  defineRule("required", required);
  defineRule("max", max);
  defineRule("one_of", one_of);

  localize({en, fr});

  configure({
    generateMessage: localize(validation),
  })
};
