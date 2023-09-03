import { useLazyQuery } from "@apollo/react-hooks";

import VPDestinationQuery from "../queries/VPDestinationQuery.graphql";

// TODO: use lazyQuery onError/onComplete callbacks
// when https://app.asana.com/0/1118345689058923/1201623819222373/f is done
const useVPDestination = () => {
  const [fetchDestination, { data: fetchDestinationData, error: fetchDestinationError }] =
    useLazyQuery<{
      destinationLandingPage: TravelStopTypes.QueryGraphCMSDestination;
    }>(VPDestinationQuery);

  return { fetchDestination, fetchDestinationData, fetchDestinationError };
};

export default useVPDestination;
