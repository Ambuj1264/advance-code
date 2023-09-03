import { useLazyQuery } from "@apollo/react-hooks";

import AutocompletePlacesQuery from "hooks/queries/AutocompletePlacesQuery.graphql";

const useAutocompletePlaces = (callback: (places: SharedTypes.AutocompleteItem[]) => void) => {
  const [fetchAutocompletePlaces] = useLazyQuery<{
    getAutoCompletePlaces: {
      places: SharedTypes.AutocompleteItem[];
    };
  }>(AutocompletePlacesQuery, {
    onCompleted: ({ getAutoCompletePlaces: { places: autoCompletePlaces } }) => {
      callback(autoCompletePlaces);
    },
  });

  return fetchAutocompletePlaces;
};

export default useAutocompletePlaces;
