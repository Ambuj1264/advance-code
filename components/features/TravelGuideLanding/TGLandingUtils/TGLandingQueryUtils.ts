import ApolloClient from "apollo-client";
import { NextPageContext } from "next";

import destinationLandingWhereConditions from "./TGLandingWhereConditions";

import { getPrefetchedData } from "lib/apollo/getPrefetchedData";
import { SupportedLanguages } from "types/enums";
import TGLandingContentQuery from "components/features/TravelGuides/queries/TGLandingPageQuery.graphql";
import TGDestinationsSearchQuery from "components/features/TravelGuides/queries/TGDestinationsSearchQuery.graphql";
import TGLandingSectionQuery from "components/features/TravelGuides/queries/TGLandingSectionQuery.graphql";

const getTGLandingPrefetchedData = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  ctx: NextPageContext
) => {
  const { result: prefetchedData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
    query: TGLandingContentQuery,
    variables: {
      where: {
        metadataUri: queryCondition.metadataUri,
      },
    },
  });
  const page = prefetchedData?.data?.bestPlacesCategoryPages?.[0];
  if (page) {
    return {
      result: page,
      errorStatusCode,
    };
  }
  return { errorStatusCode };
};

export const getTGLandingSectionQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: LandingPageTypes.LandingPageQueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext,
  page: number
): Promise<{
  queries: {
    query: any;
    variables: any;
    isRequiredForPageRendering?: boolean;
  }[];
  errorStatusCode?: number;
  countryCode?: string;
  pageInfo?: TravelGuideTypes.TGLandingContentQueryRes;
}> => {
  if (typeof window !== "undefined") {
    return { queries: [] };
  }
  const { result, errorStatusCode } = await getTGLandingPrefetchedData(apollo, queryCondition, ctx);

  if (result) {
    const countryCode = result.place.alpha2Code;
    const conditions = destinationLandingWhereConditions({ queryCondition });
    const sectionCondition = conditions[0];
    const queries = [
      {
        query: TGDestinationsSearchQuery,
        variables: {
          input: {
            cityId: 0,
            countryCode,
            order: "MOST_POPLUAR",
            page,
          },
        },
        isRequiredForPageRendering: true,
      },
      {
        query: TGLandingSectionQuery,
        variables: {
          where: sectionCondition?.where,
          sectionWhere: sectionCondition?.sectionWhere,
          locale: [locale],
          first: sectionCondition?.itemsPerPage,
        },
        isRequiredForPageRendering: false,
      },
    ];

    return {
      queries,
      errorStatusCode,
      pageInfo: result,
    };
  }

  return {
    queries: [],
    errorStatusCode,
    pageInfo: undefined,
  };
};
