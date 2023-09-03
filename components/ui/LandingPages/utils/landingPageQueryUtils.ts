import { NextPageContext } from "next";
import { ApolloClient } from "apollo-client";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DocumentNode } from "graphql";

import LandingPageSectionsQuery from "../queries/LandingPageSectionsQuery.graphql";
import LandingPageSectionsSortedQuery from "../queries/LandingPageSectionsSortedQuery.graphql";
import { getCarPickupCNLangContext } from "../../CarSearchWidget/useCarPickupLocationQuery";

import getCountryPageSectionsWhereConditions from "./queryConditions/countryPageSectionsWhereConditions";
import getFrontPageSectionsWhereConditions from "./queryConditions/frontPageSectionsWhereCondition";
import {
  getContinentGroup,
  getCountry,
  getDestinationCountryCode,
  getHrefLangLocales,
} from "./landingPageUtils";

import LandingPageTourSectionsQuery from "components/ui/LandingPages/queries/LandingPageTourSectionsQuery.graphql";
import VacationPackagesSectionSearchQuery from "components/features/VacationPackages/queries/VacationPackagesSectionSearchQuery.graphql";
import LandingPageStaySectionsQuery from "components/ui/LandingPages/queries/LandingPageStaySectionsQuery.graphql";
import CarPickupLocationsQuery from "components/ui/CarSearchWidget/LocationPicker/queries/CarPickupLocationsQuery.graphql";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import LandingPageFAQQuery from "components/ui/LandingPages/queries/LandingPageFAQQuery.graphql";
import LandingPageMetadataQuery from "components/ui/LandingPages/queries/LandingPageMetadataQuery.graphql";
import LandingPageBreadcrumbsQuery from "components/ui/LandingPages/queries/LandingPageBreadcrumbsQuery.graphql";
import LandingPageValuePropsQuery from "components/ui/LandingPages/queries/LandingPageValuePropsQuery.graphql";
import { GraphCMSPageType, Marketplace, SupportedLanguages } from "types/enums";
import { getMarketplaceFromCtx } from "utils/apiUtils";
import GTETourSearchStartingLocationsQuery from "components/features/GTETourSearchPage/queries/GTETourSearchStartingLocationsQuery.graphql";
import { constructVPSearchLandingQueryVariables } from "components/features/VacationPackages/utils/vacationPackagesUtils";
import { getPrefetchedData } from "lib/apollo/getPrefetchedData";

const globalPageConditions = {
  isDeleted: false,
};

export const constructQuery = (query: DocumentNode, variables: any) => {
  return { query, variables };
};

export const constructLandingPageSectionsQuery = (
  variables: {
    isDeleted?: boolean;
    where: LandingPageTypes.Where;
    sectionWhere: LandingPageTypes.SectionWhere;
    locale: SupportedLanguages;
    orderBy?: string;
    metadataUri?: string;
    continentGroup?: number[];
    first: number;
  },
  isSorted?: boolean
) => {
  const { continentGroup, metadataUri, ...nonSortedVars } = variables;
  return isSorted
    ? constructQuery(LandingPageSectionsSortedQuery, {
        ...nonSortedVars,
        continentGroup,
        metadataUri,
      })
    : constructQuery(LandingPageSectionsQuery, nonSortedVars);
};

export const getSectionsPagesWhereCondition = ({
  subtype,
  destinationPlaceId,
  destinationCountryCode,
  domain,
  metadataUri,
  locale,
  ssrQueries,
}: LandingPageTypes.LandingPagePrefetchParams & {
  domain: GraphCMSPageType;
  locale: SupportedLanguages;
}): LandingPageTypes.SectionWhereCondition[] => {
  switch (domain) {
    case GraphCMSPageType.CountryPage:
      return getCountryPageSectionsWhereConditions({
        subtype,
        domain,
        destinationPlaceId,
        destinationCountryCode,
        metadataUri,
        locale,
        ssrQueries,
      });
    case GraphCMSPageType.FrontPage:
      return getFrontPageSectionsWhereConditions(locale, ssrQueries);
    default:
      return [];
  }
};

const getIsomorphicSectionQueries = ({
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

  const sectionConditions = getSectionsPagesWhereCondition({
    domain: pageType,
    destinationPlaceId,
    destinationCountryCode,
    subtype,
    metadataUri,
    locale,
    ssrQueries: true,
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
      if (domain === GraphCMSPageType.StaysProductPage) {
        return {
          query: LandingPageStaySectionsQuery,
          variables: {
            where,
            sectionWhere,
            locale,
            first: itemsPerPage,
          },
        };
      }
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
          sectionWhere: { ...sectionWhere, ...globalPageConditions },
          locale,
          orderBy,
          first: itemsPerPage,
          metadataUri,
          continentGroup,
        },
        useSortedQuery
      );
    }
  );
};

export const getLandingPageBlockingData = async ({
  apollo,
  ctx,
  queryCondition,
  locale,
  query,
}: {
  apollo: ApolloClient<unknown>;
  ctx: NextPageContext;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  locale: SupportedLanguages;
  query: DocumentNode;
}) => {
  const { result: prefetchedData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
    query,
    variables: {
      stage: "DRAFT",
      where: {
        pageType: queryCondition.pageType,
        metadataUri: queryCondition.metadataUri,
        isDeleted: false,
      },
      locale,
    },
  });

  const page = prefetchedData?.data?.landingPages?.[0];
  if (page) {
    const { pageVariation, destination, origin } = page;
    const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
    const originCountryCode = getDestinationCountryCode(origin, pageVariation);
    const destinationCountry = getCountry(page.destination?.countries);
    const originCountry = getCountry(page.origin?.countries);
    return {
      result: {
        sectionSubtype: page.subType?.subtype,
        sectionSubTypeTag: page.subType?.tagId,
        sectionParentSubType: page.subType?.parentSubType?.subtype,
        pageVariation,
        destinationPlaceId: page.destination?.id,
        destinationCountryPlaceId: destinationCountry?.id,
        originPlaceId: page.origin?.id,
        originCountryPlaceId: originCountry?.id,
        flightId: page.destination?.flightId,
        destinationCountryCode,
        originCountryCode,
        originName: page.origin?.name?.value,
        destinationName: page.destination?.name?.value,
        continentGroup: getContinentGroup(page.origin, page.destination),
      },
      errorStatusCode,
    };
  }
  return { errorStatusCode };
};

export const getCarPickupLocationsQueries = ({
  destinationCountryCode,
  isCountryPage,
  pageVariation,
  marketplace,
  locale,
}: LandingPageTypes.LandingPagePrefetchParams & {
  isCountryPage: boolean;
  marketplace: Marketplace;
  locale: SupportedLanguages;
}) => {
  if (!pageVariation) return [];
  const maybeCNLangContext = getCarPickupCNLangContext(marketplace, locale);

  return [
    {
      query: CarPickupLocationsQuery,
      variables: {
        input: {
          searchQuery: "",
          type: "From",
          countryCode: isCountryPage ? destinationCountryCode : undefined,
          limit: 10,
        },
      },
      context: maybeCNLangContext,
    },
    {
      query: CarPickupLocationsQuery,
      variables: {
        input: {
          searchQuery: "",
          type: "To",
          countryCode: isCountryPage ? destinationCountryCode : undefined,
          limit: 10,
        },
      },
      context: maybeCNLangContext,
    },
  ];
};

export const getTourStartingLocationsQuery = ({
  pageVariation,
}: LandingPageTypes.LandingPagePrefetchParams) => {
  if (!pageVariation) return [];
  return [
    {
      query: GTETourSearchStartingLocationsQuery,
      variables: {
        query: "",
      },
    },
  ];
};

const getLandingPageSectionQuery = async (
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
    const isCountryPage = pageVariation.includes("guide");
    const marketplace = getMarketplaceFromCtx(ctx);

    return {
      queries: [
        ...getIsomorphicSectionQueries({
          pageVariation,
          subtype: sectionSubtype,
          destinationPlaceId,
          destinationCountryCode,
          flightId,
          pageType: queryCondition.pageType,
          locale,
          metadataUri: queryCondition.metadataUri,
          continentGroup,
        }),
        ...getCarPickupLocationsQueries({
          destinationCountryCode,
          isCountryPage,
          pageVariation,
          marketplace,
          locale,
        }),
        ...getTourStartingLocationsQuery({ pageVariation }),
      ],
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

// https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/d6d6e9c731d74027b67d969951769e09/view/5b477d12417845c79801429eab979ce4
const supportedValuePropsPageTypes = [
  GraphCMSPageType.FrontPage,
  GraphCMSPageType.Stays,
  GraphCMSPageType.VacationPackages,
  GraphCMSPageType.Tours,
  GraphCMSPageType.TravelGuides,
  GraphCMSPageType.TravelGuidesLanding,
  GraphCMSPageType.GTTPFlights,
];

export const getMaybeValuePropsPageType = (pageType?: GraphCMSPageType) =>
  pageType && supportedValuePropsPageTypes.includes(pageType) ? pageType : undefined;

export const getLandingPageCommonNonPrefetchQueries = (
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
        pageType: getMaybeValuePropsPageType(queryCondition.pageType),
      },
    },
  ];
};

export const getFrontCountryLandingPageCommonQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  query: DocumentNode
): Promise<{
  queries: {
    query: any;
    variables: any;
    isRequiredForPageRendering?: boolean;
  }[];
  errorStatusCode?: number;
}> => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const graphCmsLocale = normalizeGraphCMSLocale(locale) as SupportedLanguages;
  const { queries, errorStatusCode } = await getLandingPageSectionQuery(
    apollo,
    queryCondition,
    graphCmsLocale,
    ctx,
    query
  );

  return {
    queries: [
      ...queries,
      ...getLandingPageCommonNonPrefetchQueries(queryCondition, graphCmsLocale, marketplace),
    ],
    errorStatusCode,
  };
};
