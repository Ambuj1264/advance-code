import { useQuery } from "@apollo/react-hooks";

import { constructTourStartingLocations } from "./utils/gteTourSearchUtils";

import GTETourSearchStartingLocationsQuery from "components/features/GTETourSearchPage/queries/GTETourSearchStartingLocationsQuery.graphql";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const useGTETourDefaultLocations = ({ shouldSkip = false }: { shouldSkip?: boolean }) => {
  const { marketplace } = useSettings();
  const { data: locationData } = useQuery<{
    toursAndTicketsLocations: GTETourSearchTypes.QueryStartingLocation[];
  }>(GTETourSearchStartingLocationsQuery, {
    variables: {
      query: "",
    },
    skip: marketplace !== Marketplace.GUIDE_TO_EUROPE || shouldSkip,
  });
  return constructTourStartingLocations(locationData?.toursAndTicketsLocations ?? []);
};

export default useGTETourDefaultLocations;
