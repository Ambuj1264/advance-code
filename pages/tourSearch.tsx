import React from "react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { parseUrl } from "use-query-params";
import { useQuery } from "@apollo/react-hooks";

import Header from "components/features/Header/MainHeader";
import LandingPageQuery from "components/features/SearchPage/queries/LandingPageQuery.graphql";
import SearchContainer from "components/features/SearchPage/SearchContainer";
import { Namespaces } from "shared/namespaces";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { PageType, LandingPageType, Direction, Product } from "types/enums";
import { getTourSearchAndCategoryQueries } from "components/features/SearchPage/utils/searchUtils";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import {
  getLanguageFromContext,
  getMarketplaceFromCtx,
  getQueryParamsViaLayer0,
} from "utils/apiUtils";
import { useServerSideRedirect } from "hooks/useRedirect";
import { getClientSideUrl, isBrowser } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import TourQueryUrl from "components/features/Tour/queries/TourQueryUrl.graphql";

const useRedirectFromLegacyTourPage = () => {
  const locale = useActiveLocale();
  const { marketplace } = useSettings();
  const { asPath } = useRouter();
  const url = getClientSideUrl(PageType.TOURSEARCH_LEGACY, locale, marketplace);

  const isTourLegacyPage = asPath.indexOf("process/tours/search") !== -1;
  const { query } = parseUrl(asPath);

  const { data: tourData } = useQuery<QueryTourData>(TourQueryUrl, {
    variables: {
      id: Number(query.tour_category_id),
      marketplace,
    },
    skip: isBrowser || !(isTourLegacyPage && query.tour_category_id),
  });

  useServerSideRedirect({
    to: tourData?.tour.url ?? `/${url}`,
    status: 301,
    condition: !isBrowser && isTourLegacyPage,
  });
};

const SearchPage = () => {
  useRedirectFromLegacyTourPage();

  return (
    <>
      <Header />
      <QueryParamProvider>
        <SearchContainer />
      </QueryParamProvider>
    </>
  );
};

const geTourQueryUrlFromCtx = (ctx: NextPageContext) => {
  const isTourLegacyPage = ctx.asPath?.indexOf("process/tours/search") !== -1;

  const { tour_category_id: tourCategoryId } = getQueryParamsViaLayer0(ctx);

  const marketplace = getMarketplaceFromCtx(ctx);

  return isTourLegacyPage && tourCategoryId
    ? [
        {
          query: TourQueryUrl,
          variables: {
            id: Number(tourCategoryId),
            marketplace,
          },
        },
      ]
    : [];
};

SearchPage.getInitialProps = async (ctx: NextPageContext) => {
  const locale = getLanguageFromContext(ctx);
  const slug = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);

  const queries: SharedTypes.Query[] = [
    {
      query: LandingPageQuery,
      isRequiredForPageRendering: true,
    },
    ...getTourSearchAndCategoryQueries({
      path: slug === "process/tours/search" ? undefined : slug,
      pageType: PageType.TOUR,
      landingPageType: LandingPageType.TOURS,
      frontValuePropsProductType: Product.TOUR,
    }),
    ...geTourQueryUrlFromCtx(ctx),
  ];

  return {
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.tourSearchNs,
      Namespaces.commonSearchNs,
    ],
    queries,
    isMobileFooterShown: false,
    isTopServicesHidden: true,
    contactUsButtonPosition: Direction.Right,
  };
};

export default SearchPage;
