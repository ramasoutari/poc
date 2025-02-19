import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// utils
//
import { defaultLang } from "./config-lang";
//
import translationEn from "./langs/en.json";
import translationAr from "./langs/ar.json";
import { localStorageGetItem } from "../utils/storage-available";

// ----------------------------------------------------------------------

const lng = localStorageGetItem("i18nextLng", defaultLang.value);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEn },
      ar: { translation: translationAr },
    },
    lng: lng,
    fallbackLng: "ar",
    debug: false,
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
