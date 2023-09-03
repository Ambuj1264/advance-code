import { useQuery } from "@apollo/react-hooks";

import { noCacheHeaders } from "utils/apiUtils";
import currentCartQuery from "components/features/TourBookingWidget/queries/CurrentCart.graphql";

const useSetInitialTransportLocation = (id: number, cartItem: number) => {
  const { data } = useQuery<TourCartTypes.QueryCart>(currentCartQuery, {
    fetchPolicy: "no-cache",
    skip: !cartItem,
    context: {
      headers: noCacheHeaders,
    },
    variables: {
      id,
    },
  });
  const selectedTour =
    data?.currentCart?.items?.filter(tour => tour?.itemId === cartItem)?.[0] || null;

  if (!selectedTour) {
    return {};
  }

  const selectedTransportLocation: PickupLocation = {
    id: selectedTour?.tourDetails?.placeId || 0,
    name: selectedTour?.tourDetails?.placeName || "",
  };
  return {
    selectedTransportLocation,
  };
};

export default useSetInitialTransportLocation;
