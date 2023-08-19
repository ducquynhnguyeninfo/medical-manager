import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from "./vi/group1.json";

i18next.use(initReactI18next).init({
  lng: 'vi', // if you're using a language detector, do not define the lng option
  debug: false,
  resources: {
    vi: {
      vi
    },
  }
});