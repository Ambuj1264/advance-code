import { useQuery } from "@apollo/react-hooks";
import { head } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { getOrElse } from "fp-ts/lib/Option";

import { normalizeTourAutocompleteResults } from "../utils/searchUtils";

import TourSearchStartingLocationsQuery from "components/features/SearchPage/queries/TourSearchStartingLocationsQuery.graphql";
import { longCacheHeaders } from "utils/apiUtils";

const useTourAutoCompleteQuery = ({
  onCompleted,
}: {
  onCompleted?: (tourSearchLocationsData: SharedTypes.AutocompleteItem[]) => void;
}) => {
  const {
    data: tourAutoCompleteData,
    loading: tourAutoComplete,
    error: tourAutoCompleteError,
    refetch: fetchTourAutoComplete,
  } = useQuery<SharedTypes.QueryTourSearchStartingLocations>(TourSearchStartingLocationsQuery, {
    context: { headers: longCacheHeaders },
    onCompleted: tourAutocompleteItems => {
      onCompleted?.(normalizeTourAutocompleteResults(tourAutocompleteItems));
    },
  });
  const tourStartingLocations = normalizeTourAutocompleteResults(tourAutoCompleteData);

  const { name: defaultLocationName, id: defaultLocationId } = pipe(
    head(tourStartingLocations),
    getOrElse(() => ({} as SharedTypes.AutocompleteItem))
  );

  return {
    tourStartingLocations,
    defaultLocation: {
      id: defaultLocationId,
      name: defaultLocationName,
    },
    tourAutoComplete,
    tourAutoCompleteError,
    fetchTourAutoComplete,
  };
};

export default useTourAutoCompleteQuery;
