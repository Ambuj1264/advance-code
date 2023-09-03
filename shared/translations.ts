import zh from "./LocaleRouter/locale/zh.json";
import de from "./LocaleRouter/locale/de.json";
import en from "./LocaleRouter/locale/en.json";
import es from "./LocaleRouter/locale/es.json";
import fr from "./LocaleRouter/locale/fr.json";
import it from "./LocaleRouter/locale/it.json";
import ja from "./LocaleRouter/locale/ja.json";
import ko from "./LocaleRouter/locale/ko.json";
import pl from "./LocaleRouter/locale/pl.json";
import ru from "./LocaleRouter/locale/ru.json";
import th from "./LocaleRouter/locale/th.json";
import da from "./LocaleRouter/locale/da.json";
import sv from "./LocaleRouter/locale/sv.json";
import no from "./LocaleRouter/locale/no.json";
import nl from "./LocaleRouter/locale/nl.json";
import is from "./LocaleRouter/locale/is.json";
import fi from "./LocaleRouter/locale/fi.json";

import { SupportedLanguages } from "types/enums";

type SupportedLanguagesKeys = keyof typeof SupportedLanguages;
export type SupportedLanguagesValues = typeof SupportedLanguages[SupportedLanguagesKeys];
type LocaleType = { [key: string]: string };

const translations: {
  [key in SupportedLanguagesValues]: LocaleType;
} = {
  zh,
  de,
  en,
  es,
  fr,
  it,
  ja,
  ko,
  pl,
  ru,
  th,
  zh_CN: zh,
  da,
  sv,
  no,
  nl,
  is,
  fi,
};

export default translations;
