import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import Locale from "./Locale";
import { filterReviewLocales } from "./utils/reviewUtils";

import HeaderQueryGraphCms from "components/features/Header/Header/graphql/HeaderQueryGraphCms.graphql";
import BaseDropdown from "components/ui/Inputs/Dropdown/BaseDropdown";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { SupportedLanguages } from "types/enums";
import { longCacheHeaders } from "utils/apiUtils";

const constructLocaleOptions = (
  defaultString: string,
  locales: QueryLocale[],
  localeOptions: string[]
) => {
  return [
    {
      value: "",
      label: defaultString,
      nativeLabel: defaultString,
    },
    ...filterReviewLocales(locales, localeOptions).map(({ code, name }) => ({
      value: code,
      nativeLabel: name,
      label: <Locale localeCode={code} name={name} />,
    })),
  ];
};

const LocalesDropdown = ({
  selectedValue,
  onChange,
  localeOptions,
}: {
  selectedValue: string;
  onChange: (reviewsLocaleFilter: string) => void;
  localeOptions: SupportedLanguages[];
}) => {
  const { marketplaceUrl } = useSettings();
  const activeLocale = useActiveLocale();
  const { data } = useQuery(HeaderQueryGraphCms, {
    variables: {
      url: marketplaceUrl,
      locale: normalizeGraphCMSLocale(activeLocale),
    },
    context: {
      headers: longCacheHeaders,
    },
  });

  const { t } = useTranslation(Namespaces.reviewsNs);
  const localesData = useMemo(() => data?.marketplaceConfig?.headerConfig?.locales ?? [], [data]);
  const containsLocale = Boolean(
    localesData.find((locale: QueryLocale) => locale.code === selectedValue)
  );
  const options = useMemo(() => {
    return constructLocaleOptions(t("All languages"), localesData, localeOptions);
  }, [localesData, localeOptions, t]);

  const selectedLabel = containsLocale
    ? options.find(option => option.value === selectedValue)?.nativeLabel ?? options[0].nativeLabel
    : options[0].nativeLabel;

  return (
    <BaseDropdown
      id="languageFilterDropdown"
      onChange={onChange}
      options={options}
      selectedValue={selectedValue}
      selectedLabel={selectedLabel}
      defaultValue={options[0]}
      maxHeight="180px"
    />
  );
};

export default LocalesDropdown;
