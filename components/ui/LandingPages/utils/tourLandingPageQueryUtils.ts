import { NextPageContext } from "next";
import { ApolloClient } from "apollo-client";
import { DocumentNode } from "graphql";

import getTourSectionsWhereCondition from "./queryConditions/tourSectionsWhereCondition";
import {
  constructLandingPageSectionsQuery,
  getLandingPageBlockingData,
  getLandingPageCommonNonPrefetchQueries,
  getTourStartingLocationsQuery,
} from "./landingPageQueryUtils";

import TourLandingPageQuery from "components/features/GTETourSearchPage/queries/TourLandingPageQuery.graphql";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { GraphCMSPageType, SupportedLanguages } from "types/enums";
import { getMarketplaceFromCtx } from "utils/apiUtils";
import LandingPageTourSectionsQuery from "components/ui/LandingPages/queries/LandingPageTourSectionsQuery.graphql";

const globaPageConditions = {
  isDeleted: false,
};

const getTourIsomorphicSectionQueries = ({
  subtype,
  tagId,
  pageVariation,
  destinationPlaceId,
  locale,
  pageType,
  metadataUri,
  parentSubType,
  continentGroup,
  destinationCountryCode,
}: LandingPageTypes.LandingPagePrefetchParams & {
  pageType?: GraphCMSPageType;
  locale: SupportedLanguages;
  tagId?: number;
  parentSubType?: string;
}): LandingPageTypes.SectionQueryWithVars[] => {
  if (!pageVariation || !pageType) return [];

  const sectionConditions = getTourSectionsWhereCondition({
    pageVariation,
    subtype,
    tagId,
    destinationPlaceId,
    metadataUri,
    parentSubType,
    destinationCountryCode,
  });
  return sectionConditions.map(
    ({ sectionWhere, where, orderBy, domain, useSortedQuery, itemsPerPage }) => {
      if (domain === GraphCMSPageType.TourProductPage) {
        return {
          query: LandingPageTourSectionsQuery,
          variables: {
            where,
            sectionWhere,
            locale,
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

const getTourLandingPageSectionQuery = async (
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
      sectionSubTypeTag,
      destinationCountryCode,
      sectionParentSubType,
      continentGroup,
    } = prefetchedData;
    return {
      queries: [
        ...getTourIsomorphicSectionQueries({
          pageVariation,
          subtype: sectionSubtype,
          tagId: sectionSubTypeTag,
          destinationPlaceId,
          pageType: queryCondition.pageType,
          locale,
          metadataUri: queryCondition.metadataUri,
          parentSubType: sectionParentSubType,
          continentGroup,
          destinationCountryCode,
        }),
        ...getTourStartingLocationsQuery({ pageVariation }),
      ],
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

export const getTourLandingPageCommonQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
) => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;

  const { queries, errorStatusCode } = await getTourLandingPageSectionQuery(
    apollo,
    queryCondition,
    graphCmsLocale,
    ctx,
    TourLandingPageQuery
  );

  return {
    queries: [
      ...queries,
      ...getLandingPageCommonNonPrefetchQueries(queryCondition, graphCmsLocale, marketplace),
    ],
    errorStatusCode,
  };
};
