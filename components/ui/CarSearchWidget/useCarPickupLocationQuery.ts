import { useQuery } from "@apollo/react-hooks";

import CarPickupLocationsQuery from "./LocationPicker/queries/CarPickupLocationsQuery.graphql";

import { Marketplace, SupportedLanguages } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";

type CarPickupInput = {
  searchQuery?: string | null;
  type: "To" | "From";
  countryCode?: string;
};

export const getCarPickupCNLangContext = (
  marketplace: Marketplace,
  activeLocale: SupportedLanguages
) => {
  const isGTICn =
    marketplace === Marketplace.GUIDE_TO_ICELAND &&
    (activeLocale === SupportedLanguages.Chinese ||
      activeLocale === SupportedLanguages.LegacyChinese);

  const maybeCNLangContext = isGTICn
    ? {
        headers: {
          "x-travelshift-language": SupportedLanguages.LegacyChinese,
        },
      }
    : undefined;

  return maybeCNLangContext;
};

const useCarPickupLocationQuery = ({ searchQuery, type, countryCode }: CarPickupInput) => {
  const search = searchQuery === "Europe" ? "" : (searchQuery ?? "").toLowerCase();
  const { marketplace } = useSettings();
  const activeLocale = useActiveLocale();

  const maybeCNLangContext = getCarPickupCNLangContext(marketplace, activeLocale);

  const { error, data, loading } = useQuery<
    CarPickupLocationTypes.QueryCarPickupLocationsData,
    { input: CarPickupInput & { limit: number } }
  >(CarPickupLocationsQuery, {
    variables: {
      input: { searchQuery: search, type, countryCode, limit: 10 },
    },
    context: maybeCNLangContext,
  });
  return { error, data, loading };
};

export default useCarPickupLocationQuery;
