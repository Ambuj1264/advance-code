import { useQuery } from "@apollo/react-hooks";
import { useMemo } from "react";

import CountryListQuery from "./queries/CountryListQuery.graphql";
import useActiveLocale from "./useActiveLocale";

import { longCacheHeaders } from "utils/apiUtils";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

type QueryCountry = {
  name: LandingPageTypes.ApplicationString;
  countryCode: string;
  flag: {
    handle: string;
  };
};

const constructCountries = (queryCountries: QueryCountry[], onlyTranslated: boolean) =>
  queryCountries
    .reduce((acc, country) => {
      // The ZZ country code's name is marked as Unknown Region
      if ((onlyTranslated && !country.name?.value) || country.countryCode === "ZZ") return acc;
      return [
        ...acc,
        {
          name: country.name?.value,
          flagSvgUrl: `https://media.graphassets.com/output=format:png/resize=w:24,h:16,fit:crop/quality=value:75/auto_image/compress/${
            country.flag?.handle || ""
          }`,
          countryCode: country.countryCode,
        },
      ];
    }, [] as unknown as { name: string; flagSvgUrl: string; countryCode: string }[])
    .sort((first, second) => (first && second && first.name < second.name ? -1 : 1));

const useCountryList = (countryCode?: string, shouldSkip = false, onlyTranslated = false) => {
  const locale = useActiveLocale();
  const activeLocaleAdjusted = normalizeGraphCMSLocale(locale);
  const { data, loading, error } = useQuery<{
    getCountryList: QueryCountry[];
  }>(CountryListQuery, {
    skip: shouldSkip,
    variables: { locale: activeLocaleAdjusted },
    context: {
      headers: longCacheHeaders,
    },
  });
  const countries = useMemo(
    () => constructCountries(data?.getCountryList ?? [], onlyTranslated),
    [data?.getCountryList, onlyTranslated]
  );

  const defaultCountry = countries.find(country => country?.countryCode === countryCode);
  return {
    countries,
    defaultCountry,
    countryListLoading: loading,
    countryListError: error,
  };
};

export default useCountryList;
