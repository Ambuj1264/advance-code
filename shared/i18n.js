import i18n from "i18next";
import ICU from "i18next-icu";
import { initReactI18next, useTranslation, Trans } from "react-i18next";

import da from "./locale-data/da";
import de from "./locale-data/de";
import en from "./locale-data/en";
import es from "./locale-data/es";
import fr from "./locale-data/fr";
import it from "./locale-data/it";
import ja from "./locale-data/ja";
import ko from "./locale-data/ko";
import pl from "./locale-data/pl";
import ru from "./locale-data/ru";
import th from "./locale-data/th";
import zh from "./locale-data/zh";
import sv from "./locale-data/sv";
import no from "./locale-data/no";
import nl from "./locale-data/nl";
import is from "./locale-data/is";

const options = {
  fallbackLng: "en",
  keySeparator: false,
  nsSeparator: "~^~",
  saveMissing: false,
  detection: undefined,
  browserLanguageDetection: false,
  defaultNS: "common",
  preload: [],
  initImmediate: false,
  lng:
    typeof window !== "undefined"
      ? window &&
        window.__NEXT_DATA__ &&
        window.__NEXT_DATA__.props &&
        window.__NEXT_DATA__.props.initialLanguage
      : undefined,
  supportedLngs: [
    "en",
    "da",
    "de",
    "es",
    "fr",
    "it",
    "ja",
    "ko",
    "pl",
    "ru",
    "th",
    "zh",
    "sv",
    "no",
    "nl",
    "is",
    "zh_CN",
  ],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
    wait: true,
  },
};

i18n.use(initReactI18next).use(
  new ICU({
    localeData: [da, de, en, es, fr, it, ja, ko, pl, ru, th, zh, sv, no, nl, is],
    parseErrorHandler: (err, key, res) => {
      return res;
    },
  })
);

if (!i18n.isInitialized) {
  i18n.init(options);
}

export const i18next = i18n;
export { useTranslation, Trans };
