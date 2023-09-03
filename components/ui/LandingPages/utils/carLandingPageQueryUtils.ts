import { NextPageContext } from "next";
import { ApolloClient } from "apollo-client";
import { DocumentNode } from "graphql";

import getCarSectionsWhereCondition from "./queryConditions/carSectionsWhereCondition";
import {
  getLandingPageBlockingData,
  getLandingPageCommonNonPrefetchQueries,
  getCarPickupLocationsQueries,
  constructLandingPageSectionsQuery,
} from "./landingPageQueryUtils";

import { isBrowser, normalizeGraphCMSLocale } from "utils/helperUtils";
import DefaultDriverCountryQuery from "components/ui/CarSearchWidget/DriverInformation/queries/DefaultDriverCountryQuery.graphql";
import TranslateDriverCountryName from "components/ui/CarSearchWidget/DriverInformation/queries/TranslateDriverCountryName.graphql";
import { SupportedLanguages } from "types/enums";
import { getMarketplaceFromCtx, getMarketplaceUrl } from "utils/apiUtils";
import { getPrefetchedData } from "lib/apollo/getPrefetchedData";
import CarLandingPageQuery from "components/features/GTECarSearchPage/queries/CarLandingPageQuery.graphql";

const globaPageConditions = {
  isDeleted: false,
};

const getCarIsomorphicSectionQueries = ({
  subtype,
  pageVariation,
  destinationPlaceId,
  destinationCountryCode,
  locale,
  metadataUri,
  continentGroup,
}: LandingPageTypes.LandingPagePrefetchParams & {
  locale: SupportedLanguages;
}): LandingPageTypes.SectionQueryWithVars[] => {
  if (!pageVariation) return [];

  const sectionConditions = getCarSectionsWhereCondition({
    pageVariation,
    subtype,
    destinationPlaceId,
    metadataUri,
    destinationCountryCode,
  });
  return sectionConditions.map(({ sectionWhere, where, orderBy, itemsPerPage, useSortedQuery }) => {
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
  });
};

const getCarLandingPageSectionQuery = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  query: DocumentNode
) => {
  if (isBrowser) {
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
    } = prefetchedData;
    const isCountryPage = pageVariation.includes("Country");
    const marketplace = getMarketplaceFromCtx(ctx);

    return {
      queries: [
        ...getCarIsomorphicSectionQueries({
          pageVariation,
          subtype: sectionSubtype,
          destinationPlaceId,
          locale,
          metadataUri: queryCondition.metadataUri,
          continentGroup,
          destinationCountryCode,
        }),
        ...getCarPickupLocationsQueries({
          destinationCountryCode,
          isCountryPage,
          pageVariation,
          marketplace,
          locale,
        }),
      ],
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

export const getCarLandingPageCommonQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  hasFilters?: boolean
) => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;

  const result = !hasFilters
    ? await getCarLandingPageSectionQuery(
        apollo,
        queryCondition,
        graphCmsLocale,
        ctx,
        CarLandingPageQuery
      )
    : undefined;

  return {
    queries: [
      ...(!hasFilters ? result!.queries : []),
      ...getLandingPageCommonNonPrefetchQueries(queryCondition, graphCmsLocale, marketplace),
    ],
    errorStatusCode: result?.errorStatusCode,
  };
};

export const getCarPrefetchedLandingPageDriverQueries = async (
  apollo: ApolloClient<unknown>,
  ctx: NextPageContext,
  locale: SupportedLanguages
) => {
  if (isBrowser) return { queries: [] };

  const marketplaceUrl = getMarketplaceUrl(ctx);
  const activeLocaleAdjusted = normalizeGraphCMSLocale(locale);

  const { result: prefetchedDefaultDriverCountryData, errorStatusCode } = await getPrefetchedData(
    apollo,
    ctx,
    {
      query: DefaultDriverCountryQuery,
      variables: {
        url: marketplaceUrl,
        locale: activeLocaleAdjusted as SupportedLanguages,
      },
    }
  );

  const driverIsoCode = prefetchedDefaultDriverCountryData?.data?.values?.defaultCountry?.isoCode;

  return {
    queries: [
      {
        query: DefaultDriverCountryQuery,
        variables: {
          url: marketplaceUrl,
          locale: activeLocaleAdjusted as SupportedLanguages,
        },
      },
      {
        query: TranslateDriverCountryName,
        variables: {
          countryCode: driverIsoCode,
          locale: activeLocaleAdjusted,
        },
      },
    ],
    errorStatusCode,
  };
};
