import { useQuery } from "@apollo/react-hooks";

import TGStayProductSectionQuery from "components/features/TravelGuides/queries/TGStayProductSectionQuery.graphql";
import { SupportedLanguages } from "types/enums";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const useTGStaysQuery = ({
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
  } = useQuery<TravelGuideTypes.StaysProductQueryResult>(TGStayProductSectionQuery, {
    skip,
    variables: {
      where,
      locale: normalizeGraphCMSLocale(locale),
    },
  });

  return {
    sectionData: sectionData?.staysProductPages ?? [],
    sectionDataLoading,
    sectionError,
  };
};

export default useTGStaysQuery;
