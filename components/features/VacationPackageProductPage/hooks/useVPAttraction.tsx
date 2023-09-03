import { useLazyQuery } from "@apollo/react-hooks";

import VPAttractionQuery from "../queries/VPAttractionQuery.graphql";

// TODO: use lazyQuery onError/onComplete callbacks
// when https://app.asana.com/0/1118345689058923/1201623819222373/f is done
const useVPAttraction = () => {
  const [fetchAttraction, { error: fetchAttractionError, data: fetchAttractionData }] =
    useLazyQuery<{
      attractionLandingPage: TravelStopTypes.QueryGraphCMSAttraction;
    }>(VPAttractionQuery);
  return {
    fetchAttraction,
    fetchAttractionData,
    fetchAttractionError,
  };
};

export default useVPAttraction;
