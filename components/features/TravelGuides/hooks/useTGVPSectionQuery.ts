import { useQuery } from "@apollo/react-hooks";

import TGVPProductSection from "components/features/TravelGuides/queries/TGVPProductSectionQuery.graphql";
import { constructVPSearchLandingQueryVariables } from "components/features/VacationPackages/utils/vacationPackagesUtils";

const useTGVPSectionQuery = ({
  flightId = "europe",
  skip,
}: {
  flightId?: string;
  skip?: boolean;
}) => {
  const {
    data: sectionData,
    loading: sectionDataLoading,
    error: sectionError,
  } = useQuery<TravelGuideTypes.VPProductQueryResult>(TGVPProductSection, {
    skip,
    variables: constructVPSearchLandingQueryVariables(flightId),
  });

  return {
    sectionData,
    sectionDataLoading,
    sectionError,
  };
};

export default useTGVPSectionQuery;
