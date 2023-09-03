import { NextPageContext } from "next";
import { ApolloClient } from "apollo-client";
import { DocumentNode } from "graphql";

import getVPSectionsWhereCondition from "./queryConditions/vpSectionsWhereCondition";
import {
  constructLandingPageSectionsQuery,
  getLandingPageBlockingData,
  getLandingPageCommonNonPrefetchQueries,
} from "./landingPageQueryUtils";

import VacationPackagesSectionSearchQuery from "components/features/VacationPackages/queries/VacationPackagesSectionSearchQuery.graphql";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { GraphCMSPageType, SupportedLanguages } from "types/enums";
import { getMarketplaceFromCtx } from "utils/apiUtils";
import { constructVPSearchLandingQueryVariables } from "components/features/VacationPackages/utils/vacationPackagesUtils";
import VPLandingPageQuery from "components/features/VacationPackages/queries/VPLandingPageQuery.graphql";

const globaPageConditions = {
  isDeleted: false,
};

const getVPIsomorphicSectionQueries = ({
  subtype,
  pageVariation,
  destinationPlaceId,
  destinationCountryCode,
  flightId,
  locale,
  pageType,
  metadataUri,
  continentGroup,
}: LandingPageTypes.LandingPagePrefetchParams & {
  pageType?: GraphCMSPageType;
  locale: SupportedLanguages;
}): LandingPageTypes.SectionQueryWithVars[] => {
  if (!pageVariation || !pageType) return [];

  const sectionConditions = getVPSectionsWhereCondition({
    pageVariation,
    subtype,
    destinationPlaceId,
    destinationCountryCode,
    metadataUri,
  });
  return sectionConditions.map(
    ({ sectionWhere, where, orderBy, domain, useSortedQuery, itemsPerPage }) => {
      if (domain === GraphCMSPageType.VpProductPage) {
        return {
          query: VacationPackagesSectionSearchQuery,
          variables: {
            where,
            locale,
            ...constructVPSearchLandingQueryVariables(flightId, subtype, itemsPerPage),
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

const getVPLandingPageSectionQuery = async (
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
      flightId,
      continentGroup,
    } = prefetchedData;

    return {
      queries: [
        ...getVPIsomorphicSectionQueries({
          pageVariation,
          subtype: sectionSubtype,
          destinationPlaceId,
          destinationCountryCode,
          pageType: queryCondition.pageType,
          flightId,
          locale,
          metadataUri: queryCondition.metadataUri,
          continentGroup,
        }),
      ],
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

export const getVPLandingPageCommonQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
) => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;

  const { queries, errorStatusCode } = await getVPLandingPageSectionQuery(
    apollo,
    queryCondition,
    graphCmsLocale,
    ctx,
    VPLandingPageQuery
  );

  return {
    queries: [
      ...queries,
      ...getLandingPageCommonNonPrefetchQueries(queryCondition, graphCmsLocale, marketplace),
    ],
    errorStatusCode,
  };
};
