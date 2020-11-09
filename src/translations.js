import en from 'vee-validate/dist/locale/en.json'
import fr from 'vee-validate/dist/locale/fr.json'

const messages = {
  en: {
    fields: {
      selectOption: "Select an option",
      selectAllThatApply: "Select all that apply",
      comment: "Please specify"
    },
    veeValidate: {
      validation: en.messages,
    },
    validation: {
      optionRequired: "An option is required",
      max750characters: "Comments can be at most 750 characters"
    },
    form: {
      required: "required",
      max750characters: "maximum 750 characters",
      selectOptions: "Please select all that apply",
      other: "Other",
      specify: "Please specify",
      submit: "Submit"
    },
    contact: {
      forEnquiries: "For enquiries, please",
      opcContactLink: "/en/contact-the-opc/",
      contactOpc: "contact the Office of the Privacy Commissioner",
      noReply: "You will not receive a reply"
    },
    errors: {
      invalidRequest: "An invalid request was made, please try again.",
      somethingWentWrong: "Something went wrong, please try again later."
    }
  },
  fr: {
    fields: {
      selectOption: "Sélectionner une option",
      selectAllThatApply: "Sélectionner les réponses pertinentes",
      comment: "Veuillez préciser"
    },
    veeValidate: {
      validation: fr.messages,
    },
    validation: {
      optionRequired: "La sélection d'une option est obligatoire",
      max750characters: "Les commentaires ont un maximum de 750 charactères"
    },
    form: {
      required: "obligatoire",
      provideDetails: "Pourquoi? Veuillez préciser",
      max750characters: "maximum de 750 caractères",
      selectOptions: "Veuillez cocher toutes les réponses pertinentes",
      other: "Autre",
      specify: "Veuillez préciser",
      submit: "Soumettre"
    },
    contact: {
      forEnquiries: "Pour toute question, veuillez",
      opcContactLink: "/fr/communiquer-avec-le-commissariat/",
      contactOpc: "communiquer avec le Commissariat à la protection de la vie privée",
      noReply: "Vous ne recevrez pas de réponse"
    },
    errors: {
      invalidRequest: "Une requête invalide a été effectuée. Veuillez essayer de nouveau.",
      somethingWentWrong: "Une erreur est survenue, s'il vous plait réessayer de nouveau plus tard."
    }
  }
}

export default messages;