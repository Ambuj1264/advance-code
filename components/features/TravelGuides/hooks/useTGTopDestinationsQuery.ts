import { useQuery } from "@apollo/react-hooks";

import TGDestinationsSearchQuery from "components/features/TravelGuides/queries/TGDestinationsSearchQuery.graphql";
import { emptyArray } from "utils/constants";

const useTGTopDestinationsQuery = ({
  sectionCondition,
}: {
  sectionCondition?: TravelGuideTypes.TGSectionCondition;
}) => {
  const {
    data: topDestinationData,
    loading: destinationsLoading,
    error: destinationsError,
  } = useQuery<TravelGuideTypes.TGDestinationsSearchQueryResult>(TGDestinationsSearchQuery, {
    skip: !sectionCondition,
    variables: {
      input: sectionCondition?.input,
      where: sectionCondition?.where,
    },
  });
  const nodes = topDestinationData?.travelGuidesDestinations.destinations;

  return {
    topDestinationData: nodes || emptyArray,
    destinationsLoading,
    destinationsError,
  };
};

export default useTGTopDestinationsQuery;
