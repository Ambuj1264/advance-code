import { useQuery } from "@apollo/react-hooks";

import VacationPackageContentQuery from "components/features/VacationPackageProductPage/queries/VacationPackageContentQuery.graphql";
import VPPreviewContentQuery from "components/features/VacationPackageProductPage/queries/VPPreviewContentQuery.graphql";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";
import { Marketplace, SupportedLanguages } from "types/enums";
import { noCacheHeaders } from "utils/apiUtils";

export const getVPContentQueryVariables = (
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages
) => ({
  where: queryCondition,
  locale: [locale],
  hrefLangLocales: hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE],
});

const useVacationPackageContentQuery = ({
  isPreview,
  queryCondition,
  locale,
}: {
  isPreview: boolean;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  locale: SupportedLanguages;
}) => {
  const {
    data: vpContentQueryResult,
    loading: vpContentQueryLoading,
    error: vpContentQueryError,
  } = useQuery<VacationPackageTypes.QueryVacationPackage>(VacationPackageContentQuery, {
    variables: getVPContentQueryVariables(queryCondition, locale),
    skip: isPreview,
  });
  const {
    data: vpPreviewQueryResult,
    loading: vpPreviewQueryLoading,
    error: vpPreviewQueryError,
  } = useQuery<any>(VPPreviewContentQuery, {
    variables: {
      where: queryCondition,
    },
    context: {
      headers: noCacheHeaders,
    },
    skip: !isPreview,
  });
  const loading = isPreview ? vpPreviewQueryLoading : vpContentQueryLoading;
  const error = isPreview ? vpPreviewQueryError : vpContentQueryError;
  const data = isPreview
    ? vpPreviewQueryResult?.previewVpProductPage?.data?.data?.vacationPackagesProductPages
    : vpContentQueryResult?.vacationPackagesProductPages;
  const isVpDataOk = Boolean(!error && data?.length);
  const cartLink = isPreview ? vpPreviewQueryResult?.cartLink : vpContentQueryResult?.cartLink;
  const hreflangs = isVpDataOk && !isPreview ? data![0].hreflangs : [];
  return {
    vpContent: data,
    vpContentQueryLoading: loading,
    vpContentQueryError: error,
    hreflangs: hreflangs || [],
    isVpDataOk,
    cartLink,
  };
};

export default useVacationPackageContentQuery;
