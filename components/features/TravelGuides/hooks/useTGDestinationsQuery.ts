import { useQuery } from "@apollo/react-hooks";

import TGDestinationsContentQuery from "components/features/TravelGuides/queries/TGDestinationsContentQuery.graphql";
import { SupportedLanguages } from "types/enums";

const useTGDestinationsQuery = ({
  queryCondition,
  locale,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  locale: SupportedLanguages;
}) => {
  const { data, loading, error } = useQuery<TravelGuideTypes.DestinationContentResult>(
    TGDestinationsContentQuery,
    {
      variables: {
        where: queryCondition,
        locale: [locale],
      },
    }
  );

  const destinationData = data?.destinationLandingPages?.[0];

  return {
    destinationData,
    loading,
    error,
  };
};

export default useTGDestinationsQuery;
