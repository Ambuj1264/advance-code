import { useQuery } from "@apollo/react-hooks";

import TGTopServicesQuery from "components/features/TravelGuides/queries/TGSectionsQuery.graphql";
import { SupportedLanguages } from "types/enums";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const useTGSectionQuery = ({
  where,
  first,
  locale,
  skip,
}: {
  where?: LandingPageTypes.SectionWhere;
  first?: number;
  locale: SupportedLanguages;
  skip?: boolean;
}) => {
  const {
    data: sectionData,
    loading: sectionDataLoading,
    error: sectionError,
  } = useQuery<TravelGuideTypes.SectionQueryResult>(TGTopServicesQuery, {
    skip,
    variables: {
      where,
      first: first ?? 16,
      locale: normalizeGraphCMSLocale(locale),
    },
  });

  return {
    sectionData,
    sectionDataLoading,
    sectionError,
  };
};

export default useTGSectionQuery;
