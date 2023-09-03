import React from "react";
import { NextPageContext } from "next";

import { normalizeGraphCMSLocale } from "../utils/helperUtils";
import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";

import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import LandingPageMetadataQuery from "components/ui/LandingPages/queries/LandingPageMetadataQuery.graphql";
import LandingPageBreadcrumbsQuery from "components/ui/LandingPages/queries/LandingPageBreadcrumbsQuery.graphql";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import FlightLocationsQuery from "components/ui/FlightSearchWidget/queries/FlightLocations.graphql";
import { VacationSearchQueryParamsType } from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import {
  doesVpHasAllRequiredSearchQueryParams,
  getVacationPackagesSearchPageQueryCondition,
} from "components/features/VacationPackages/utils/vacationPackagesUtils";
import VacationPackagesSearchLanding from "components/features/VacationPackages/VacationPackagesSearchLanding";
import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import {
  getLanguageFromContext,
  getMarketplaceFromCtx,
  getQueryParamsViaLayer0,
  getSlugFromContext,
} from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import { getVPLandingPageCommonQueries } from "components/ui/LandingPages/utils/vpLandingPageQueryUtils";
import {
  Direction,
  FlightFunnelType,
  Marketplace,
  PageType,
  SupportedLanguages,
} from "types/enums";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";

const VacationPackagesLandingPage = ({
  queryCondition,
  slug,
}: {
  slug?: string;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(
    queryCondition,
    hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE]
  );
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <VacationPackagesSearchLanding queryCondition={queryCondition} slug={slug} />
      </QueryParamProvider>
    </>
  );
};

VacationPackagesLandingPage.getInitialProps = getInitialPropsWithApollo(
  PageType.VACATION_PACKAGES_LANDING,
  async (ctx: NextPageContext, apollo) => {
    const { asPath, query } = ctx;
    const slug = getSlugFromContext(ctx);
    const locale = getLanguageFromContext(ctx);
    const normalizedAsPath = cleanAsPathWithLocale(asPath);
    const { country = "" } = getQueryParamsViaLayer0(ctx);
    const queryCondition = getVacationPackagesSearchPageQueryCondition(normalizedAsPath);
    const marketplace = getMarketplaceFromCtx(ctx);
    const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;
    const hasSearchQueryParams = doesVpHasAllRequiredSearchQueryParams(
      query as VacationSearchQueryParamsType
    );
    const namespacesRequired = [
      Namespaces.commonNs,
      Namespaces.commonSearchNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.vacationPackagesSearchN,
      Namespaces.vacationPackageNs,
      Namespaces.accommodationNs,
    ];
    const commonQueries = !hasSearchQueryParams
      ? await getVPLandingPageCommonQueries(apollo, queryCondition, locale, ctx)
      : undefined;

    return {
      slug,
      country,
      namespacesRequired,
      queries: [
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: "",
              type: "From",
              funnel: FlightFunnelType.VACATION_PACKAGE,
            },
          },
        },
        {
          query: FlightLocationsQuery,
          variables: {
            input: {
              searchQuery: country,
              type: "To",
              funnel: FlightFunnelType.VACATION_PACKAGE,
            },
          },
        },
        ...(!hasSearchQueryParams
          ? commonQueries!.queries
          : [
              {
                query: LandingPageBreadcrumbsQuery,
                variables: {
                  where: queryCondition,
                  locale: graphCmsLocale,
                },
              },
              {
                query: LandingPageMetadataQuery,
                variables: {
                  where: queryCondition,
                  locale: graphCmsLocale,
                  hrefLandLocales: hreflangLocalesByMarketplace[marketplace],
                },
                isRequiredForPageRendering: true,
              },
            ]),
      ],
      queryCondition,
      contactUsButtonPosition: Direction.Right,
      contactUsMobileMargin: ContactUsMobileMargin.WithoutFooter,
      isMobileFooterShown: false,
      errorStatusCode: commonQueries?.errorStatusCode,
    };
  }
);

export default VacationPackagesLandingPage;
