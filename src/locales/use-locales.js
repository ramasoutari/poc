import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
// utils
// components
//
import { allLangs, defaultLang } from "./config-lang";
import { useSettingsContext } from "../components/settings/context";
import { localStorageGetItem } from "../utils/storage-available";

// ----------------------------------------------------------------------

export default function useLocales() {
  const { i18n, t } = useTranslation();

  const settings = useSettingsContext();

  const langStorage = localStorageGetItem("i18nextLng") || "ar";

  const currentLang =
    allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  const onChangeLang = useCallback(
    (newlang) => {
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
    },
    [i18n, settings]
  );

  return {
    allLangs,
    t,
    currentLang,
    onChangeLang,
  };
}
