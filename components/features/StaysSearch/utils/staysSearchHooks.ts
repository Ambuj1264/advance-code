import { useLazyQuery } from "@apollo/react-hooks";
import React, { Dispatch, useCallback } from "react";

import GTEStaysAutocompleteQuery from "../queries/GTEStaysAutocompleteQuery.graphql";

import { setAccommodationLocation } from "utils/localStorageUtils";
import { normalizeLocationItems } from "components/features/AccommodationSearchPage/utils/accommodationSearchUtils";
import {
  ActionType,
  ActionTypes,
} from "components/features/AccommodationSearchPage/AccommodationSearchPageStateContext";

export const useOnStaysSearchLocationInputChange = (dispatch: Dispatch<ActionTypes>) => {
  const [fetchAutocompletePlaces] = useLazyQuery<{
    staysLocations: SharedTypes.AutocompleteItem[];
  }>(GTEStaysAutocompleteQuery, {
    onCompleted: ({ staysLocations }) =>
      dispatch({
        type: ActionType.OnLocationInputChange,
        locationItems: normalizeLocationItems(staysLocations),
      }),
  });

  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value;

      dispatch({
        type: ActionType.OnLocationInputChange,
        name: searchValue,
      });
      fetchAutocompletePlaces({
        variables: {
          request: {
            searchTerm: searchValue,
          },
        },
      });

      if (!searchValue) {
        setAccommodationLocation(undefined);
      }
    },
    [dispatch, fetchAutocompletePlaces]
  );
};
