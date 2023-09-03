import { useQuery } from "@apollo/react-hooks";

import { normalizeLocationItems } from "../AccommodationSearchPage/utils/accommodationSearchUtils";

import GTEStaysAutocompleteQuery from "./queries/GTEStaysAutocompleteQuery.graphql";

import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const useStayDefaultLocations = ({
  accommodationAddress,
  shouldSkip,
}: {
  accommodationAddress?: string;
  shouldSkip: boolean;
}) => {
  const { marketplace } = useSettings();
  const { data: defaultLocationsData, loading: defaultLocationsLoading } = useQuery<{
    staysLocations: SharedTypes.AutocompleteItem[];
  }>(GTEStaysAutocompleteQuery, {
    variables: {
      request: {
        searchTerm: accommodationAddress || "",
      },
    },
    skip: marketplace !== Marketplace.GUIDE_TO_EUROPE || shouldSkip,
  });
  const defaultLocationsList =
    !defaultLocationsLoading && defaultLocationsData
      ? normalizeLocationItems(defaultLocationsData.staysLocations)
      : undefined;
  return defaultLocationsList;
};

export default useStayDefaultLocations;
