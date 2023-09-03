import { useQuery } from "@apollo/react-hooks";
import { useCallback } from "react";

import { constructPriceGroups, getPriceGroupsMaxAge } from "../Travelers/utils/travelersUtils";
import priceGroupsQuery from "../queries/PriceGroupsQuery.graphql";

import {
  getTravelersFromLocalStorage,
  writeTravelersUrlParamToLocalStorage,
} from "utils/localStorageUtils";

export const useGetTravelersPriceGroups = ({
  onSetDefaultNumberOfTravelers,
  numberOfTravelers,
  id,
  onSetTravelersPriceGroups,
  skipFetchingPriceGroups,
}: {
  id: number;
  onSetDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  onSetTravelersPriceGroups?: (value: TravelersTypes.PriceGroup[]) => void;
  skipFetchingPriceGroups: boolean;
}) => {
  const onCompletedAvailableTimeQuery = useCallback(
    ({ tour }) => {
      if (!tour) return;

      const constructedPriceGroups = constructPriceGroups(tour.priceGroups);

      onSetTravelersPriceGroups?.(constructedPriceGroups);

      if (numberOfTravelers.adults === 0) {
        writeTravelersUrlParamToLocalStorage(tour.priceGroups);
        const constructedPriceGroupsMaxAges = getPriceGroupsMaxAge(tour.priceGroups);
        const { adults, teenagers, children } = getTravelersFromLocalStorage(
          constructedPriceGroupsMaxAges
        );
        onSetDefaultNumberOfTravelers({
          adults: adults !== 0 ? adults : 1,
          children,
          teenagers,
        });
      }
    },
    [numberOfTravelers.adults, onSetDefaultNumberOfTravelers, onSetTravelersPriceGroups]
  );

  const {
    error,
    loading: isPriceGroupLoading,
    data,
  } = useQuery<TravelersTypes.QueryPriceGroupsTour>(priceGroupsQuery, {
    variables: { id },
    onCompleted: onCompletedAvailableTimeQuery,
    notifyOnNetworkStatusChange: true,
    skip: skipFetchingPriceGroups,
  });
  const priceGroupsTourData = data?.tour;

  return {
    isPriceGroupLoading,
    priceGroupsMaxAge: priceGroupsTourData
      ? getPriceGroupsMaxAge(priceGroupsTourData.priceGroups)
      : undefined,
    priceGroups: priceGroupsTourData ? constructPriceGroups(priceGroupsTourData.priceGroups) : [],
    error,
  };
};
