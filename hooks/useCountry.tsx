import { useQuery } from "@apollo/react-hooks";

import CountryQuery from "./queries/CountryQuery.graphql";
import useActiveLocale from "./useActiveLocale";

import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { longCacheHeaders } from "utils/apiUtils";
import { useSettings } from "contexts/SettingsContext";

const useCountry = () => {
  const { marketplaceUrl } = useSettings();
  const activeLocale = useActiveLocale();
  const { data } = useQuery<
    {
      marketplaceConfig: {
        countryCode: string;
        marketplaceCountry: { name: LandingPageTypes.ApplicationString };
      };
    },
    { locale: string; url: string }
  >(CountryQuery, {
    variables: {
      locale: normalizeGraphCMSLocale(activeLocale),
      url: marketplaceUrl,
    },
    context: {
      headers: longCacheHeaders,
    },
  });
  return {
    countryCode: data?.marketplaceConfig?.countryCode ?? "",
    country: data?.marketplaceConfig?.marketplaceCountry?.name?.value ?? "",
  };
};

export default useCountry;
