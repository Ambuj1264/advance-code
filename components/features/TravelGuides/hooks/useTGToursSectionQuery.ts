import { useQuery } from "@apollo/react-hooks";

import TGTourProductSection from "components/features/TravelGuides/queries/TGTourProductSectionQuery.graphql";
import { SupportedLanguages } from "types/enums";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const useTGToursSectionQuery = ({
  where,
  locale,
  skip,
}: {
  where?: LandingPageTypes.SectionWhere;
  locale: SupportedLanguages;
  skip?: boolean;
}) => {
  const {
    data: sectionData,
    loading: sectionDataLoading,
    error: sectionError,
  } = useQuery<TravelGuideTypes.TourProductQueryResult>(TGTourProductSection, {
    skip,
    variables: {
      where,
      locale: normalizeGraphCMSLocale(locale),
    },
  });

  return {
    sectionData: sectionData?.tourProductPages ?? [],
    sectionDataLoading,
    sectionError,
  };
};

export default useTGToursSectionQuery;
