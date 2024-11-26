import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        title: "Multi-language app",
        label: "Select another language!",
        about: "About",
        home: "Home",
        version: "version 0.1 | web session",
      },
    },
    tr: {
      translation: {
        version: "versiyon 0.1 | web oturumu",
      },
    },
  },
});

export default i18n;
