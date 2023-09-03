import { useState } from "react";

import { i18next, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { SupportedLanguages } from "types/enums";

const useDynamicTranslation = ({
  locale,
  namespace,
}: {
  locale: SupportedLanguages;
  namespace: Namespaces;
}) => {
  const [instance] = useState(() => {
    const i18n = i18next.cloneInstance();
    i18n.changeLanguage(locale);
    return i18n;
  });

  return useTranslation(namespace, { i18n: instance });
};

export default useDynamicTranslation;
