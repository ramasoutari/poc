import merge from "lodash/merge";
import { enUS as enUSAdapter, arSA as arSAAdapter } from "date-fns/locale";
// core
import { enUS as enUSCore, arSA as arSACore } from "@mui/material/locale";
// date-pickers
// data-grid

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: "العربية",
    value: "ar",
    direction: "rtl",
    systemValue: merge(arSACore),
    adapterLocale: arSAAdapter,
    icon: "/assets/icons/navbar/ic_lang.svg",
  },
  {
    label: "English",
    value: "en",
    direction: "ltr",
    systemValue: merge(enUSCore),
    adapterLocale: enUSAdapter,
    icon: "/assets/icons/navbar/ic_lang.svg",
  },
];

export const defaultLang = allLangs[0]; // English
