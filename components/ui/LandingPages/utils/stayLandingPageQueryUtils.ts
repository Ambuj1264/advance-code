import { ApolloClient } from "apollo-client";
import { NextPageContext } from "next";
import { DocumentNode } from "graphql";

import LandingPageMetadataQuery from "../queries/LandingPageMetadataQuery.graphql";
import LandingPageFAQQuery from "../queries/LandingPageFAQQuery.graphql";
import LandingPageBreadcrumbsQuery from "../queries/LandingPageBreadcrumbsQuery.graphql";
import LandingPageValuePropsQuery from "../queries/LandingPageValuePropsQuery.graphql";

import getStaySectionsWhereCondition from "./queryConditions/staySectionsWhereCondition";
import {
  constructLandingPageSectionsQuery,
  getLandingPageBlockingData,
} from "./landingPageQueryUtils";
import { getHrefLangLocales } from "./landingPageUtils";

import GTEStaysAutocompleteQuery from "components/features/StaysSearch/queries/GTEStaysAutocompleteQuery.graphql";
import StayLandingPageQuery from "components/features/StaysSearch/queries/StayLandingPageQuery.graphql";
import LandingPageStaySectionsQuery from "components/ui/LandingPages/queries/LandingPageStaySectionsQuery.graphql";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { GraphCMSPageType, Marketplace, SupportedLanguages } from "types/enums";
import { getMarketplaceFromCtx } from "utils/apiUtils";

const globaPageConditions = {
  isDeleted: false,
};

const getStayIsomorphicSectionQueries = ({
  subtype,
  pageVariation,
  destinationPlaceId,
  destinationCountryCode,
  locale,
  pageType,
  metadataUri,
  continentGroup,
}: LandingPageTypes.LandingPagePrefetchParams & {
  pageType?: GraphCMSPageType;
  locale: SupportedLanguages;
}): LandingPageTypes.SectionQueryWithVars[] => {
  if (!pageVariation || !pageType) return [];

  const sectionConditions = getStaySectionsWhereCondition({
    pageVariation,
    subtype,
    domain: pageType,
    destinationPlaceId,
    destinationCountryCode,
    metadataUri,
  });
  return sectionConditions.map(
    ({ sectionWhere, where, orderBy, domain, itemsPerPage, useSortedQuery }) => {
      if (domain === GraphCMSPageType.StaysProductPage) {
        return {
          query: LandingPageStaySectionsQuery,
          variables: {
            where,
            sectionWhere,
            locale,
            isDisabled: false,
            first: itemsPerPage,
          },
        };
      }
      return constructLandingPageSectionsQuery(
        {
          where,
          sectionWhere: { ...sectionWhere, ...globaPageConditions },
          locale,
          orderBy,
          metadataUri,
          continentGroup,
          first: itemsPerPage,
        },
        useSortedQuery
      );
    }
  );
};

const getStayLandingPageSectionQuery = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  query: DocumentNode
) => {
  if (typeof window !== "undefined") {
    return { queries: [] };
  }

  const { result: prefetchedData, errorStatusCode } = await getLandingPageBlockingData({
    apollo,
    queryCondition,
    locale,
    ctx,
    query,
  });

  if (prefetchedData) {
    const {
      sectionSubtype,
      pageVariation,
      destinationPlaceId,
      destinationCountryCode,
      continentGroup,
      destinationName,
    } = prefetchedData;
    const searchTerm = destinationCountryCode ? destinationName || "" : "";
    return {
      queries: [
        ...getStayIsomorphicSectionQueries({
          pageVariation,
          subtype: sectionSubtype,
          destinationPlaceId,
          destinationCountryCode,
          pageType: queryCondition.pageType,
          locale,
          metadataUri: queryCondition.metadataUri,
          continentGroup,
        }),
        {
          query: GTEStaysAutocompleteQuery,
          variables: {
            request: {
              searchTerm,
            },
          },
        },
      ],
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

export const getStayLandingPageNonPrefetchQueries = (
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  graphCmsLocale: SupportedLanguages,
  marketplace: Marketplace
) => {
  return [
    {
      query: LandingPageMetadataQuery,
      variables: {
        where: queryCondition,
        locale: graphCmsLocale,
        hrefLandLocales: getHrefLangLocales(marketplace),
      },
      isRequiredForPageRendering: true,
    },
    {
      query: LandingPageFAQQuery,
      variables: {
        where: queryCondition,
        locale: graphCmsLocale,
      },
    },
    {
      query: LandingPageBreadcrumbsQuery,
      variables: {
        where: queryCondition,
        locale: graphCmsLocale,
      },
    },
    {
      query: LandingPageValuePropsQuery,
      variables: {
        locale: graphCmsLocale,
      },
    },
  ];
};

export const getStayLandingPageCommonQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
) => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;

  const { queries, errorStatusCode } = await getStayLandingPageSectionQuery(
    apollo,
    queryCondition,
    graphCmsLocale,
    ctx,
    StayLandingPageQuery
  );

  return {
    queries: [
      ...queries,
      ...getStayLandingPageNonPrefetchQueries(queryCondition, graphCmsLocale, marketplace),
    ],
    errorStatusCode,
  };
};
