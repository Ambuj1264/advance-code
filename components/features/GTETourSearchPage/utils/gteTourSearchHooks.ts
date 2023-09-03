import { useContext, useCallback, ChangeEvent } from "react";
import { useLazyQuery } from "@apollo/react-hooks";

import GTETourSearchStartingLocationsQuery from "../queries/GTETourSearchStartingLocationsQuery.graphql";

import { constructTourStartingLocations } from "./gteTourSearchUtils";

import SearchPageStateContext from "components/features/SearchPage/SearchPageStateContext";
import useToggle from "hooks/useToggle";

export const useOnGTETourLocationInputChange = () => {
  const { setContextState, startingLocationItems } = useContext(SearchPageStateContext);
  const [hasSelectedLocation, toggleHasSelectedLocation] = useToggle(false);
  const [fetchGTETourSearchLocations] = useLazyQuery<{
    toursAndTicketsLocations: GTETourSearchTypes.QueryStartingLocation[];
  }>(GTETourSearchStartingLocationsQuery, {
    onCompleted: ({ toursAndTicketsLocations }) => {
      setContextState({
        startingLocationItems: constructTourStartingLocations(toursAndTicketsLocations),
      });
    },
  });

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value || "";
      if (
        (inputValue === "" && hasSelectedLocation) ||
        (inputValue !== "" && !hasSelectedLocation)
      ) {
        toggleHasSelectedLocation();
      }
      if (!inputValue) {
        setContextState({
          selectedLocationId: undefined,
          selectedLocationName: undefined,
          startingLocationItems,
        });
      } else {
        fetchGTETourSearchLocations({
          variables: {
            query: hasSelectedLocation ? inputValue : "",
          },
        });
      }
    },
    [
      hasSelectedLocation,
      toggleHasSelectedLocation,
      startingLocationItems,
      setContextState,
      fetchGTETourSearchLocations,
    ]
  );
};
