// ----------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from "react";
import { TranslationContext } from "./translation-context";
import { loadTranslations } from "./server-side";
import useLocales from "../locales/use-locales";

export function TranslationProvider({ children, defaultSettings }) {
  const [translation, setTranslation] = useState(defaultSettings);
  const { currentLang } = useLocales();

  const handleGetLangs = async (currentLang) => {
    const serverTs = await loadTranslations(currentLang);

    setTranslation(serverTs);
  };

  const translateApi = useCallback(
    (key, params = {}) => {
      const targetTranslation = translation[key];

      if (!targetTranslation) {
        return key;
      }

      if (!params) {
        return targetTranslation;
      }
      let replacedTranslation = targetTranslation;

      const keys = Object.keys(params);
      keys.forEach((key) => {
        replacedTranslation = replacedTranslation.replace(
          `{{${key}}}`,
          params[key]
        );
      });

      return replacedTranslation;
    },
    [translation]
  );

  useEffect(() => {
    handleGetLangs(currentLang?.value);
  }, [currentLang?.value]);

  const memoizedValue = useMemo(() => {
    return {
      ...translation,
      translateValue: (key, params) => translateApi(key, params),
    };
  }, [translation, translateApi]);

  // const memoizedValue = useMemo(
  //   () => ({
  //     ...translation
  //   }),
  //   [
  //     translation
  //   ]
  // );

  return (
    <TranslationContext.Provider value={memoizedValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// TranslationProvider.propTypes = {
//   children: PropTypes.node,
//   defaultSettings: PropTypes.object,
// };
