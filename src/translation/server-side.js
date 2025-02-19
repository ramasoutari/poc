import { HOST_API } from "../config-global";
import axiosInstance from "../utils/axios";

let translations = {};
export async function loadTranslations(lang) {
  try {
    const response = await axiosInstance.get(
      `${HOST_API}/GetPortalTranslation?lang=${lang}`
    );
    translations = response?.data?.data;

    return translations;
  } catch {
    console.log("Error");
  }
}

const translateApi = (translations, key, params = {}) => {
  const targetTranslation = translations[key];

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
};

export { translations, translateApi };
