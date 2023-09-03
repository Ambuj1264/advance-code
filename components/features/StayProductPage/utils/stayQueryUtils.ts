import { ApolloClient } from "apollo-client";
import { NextPageContext } from "next";

import StayContentQuery from "../queries/StayContentQuery.graphql";
import StayMetadataQuery from "../queries/StayMetadataQuery.graphql";
import StayQuery from "../queries/StayQuery.graphql";
import StaticRoomsQuery from "../queries/StaticRoomsQuery.graphql";

import { getStayProductPageQueryCondition } from "./stayUtils";

import { getHrefLangLocales } from "components/ui/LandingPages/utils/landingPageUtils";
import { SupportedLanguages } from "types/enums";
import { getPrefetchedData } from "lib/apollo/getPrefetchedData";
import { getMarketplaceFromCtx } from "utils/apiUtils";

const getIsomorphicContentQuery = ({
  location,
  locale,
  metadataUri,
  productId,
}: StayTypes.StayPagePrefetchParams & {
  locale: SupportedLanguages;
}) => {
  const attractionsConditions = {
    latitude: location.latitude,
    longitude: location.longitude,
  };
  return [
    {
      query: StayContentQuery,
      variables: {
        where: getStayProductPageQueryCondition(metadataUri),
        attractionsConditions,
        locale,
      },
      skip: !attractionsConditions,
      isRequiredForPageRendering: true,
    },
    {
      query: StaticRoomsQuery,
      variables: {
        input: {
          productId,
        },
      },
    },
  ];
};

const getStayContentQuery = async (
  apollo: ApolloClient<unknown>,
  queryCondition: StayTypes.QueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
) => {
  if (typeof window !== "undefined") {
    return { queries: [] };
  }
  const { result: prefetchedData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
    query: StayQuery,
    variables: {
      where: queryCondition,
      locale,
    },
  });
  const page = prefetchedData?.data?.staysProductPages?.[0];
  if (page) {
    const { location, productId } = page;
    return {
      queries: getIsomorphicContentQuery({
        location,
        locale,
        metadataUri: queryCondition.metadataUri,
        productId,
      }),
      errorStatusCode,
    };
  }

  return { queries: [], errorStatusCode };
};

export const getStayProductPageQueries = async (
  apollo: ApolloClient<unknown>,
  queryCondition: StayTypes.QueryCondition,
  locale: SupportedLanguages,
  ctx: NextPageContext
) => {
  const { queries: stayContentQuery, errorStatusCode } = await getStayContentQuery(
    apollo,
    queryCondition,
    locale,
    ctx
  );
  const marketplace = getMarketplaceFromCtx(ctx);
  return {
    queries: [
      ...stayContentQuery,
      {
        query: StayQuery,
        variables: {
          where: queryCondition,
          locale,
          isDisabled: false,
        },
        isRequiredForPageRendering: true,
      },
      {
        query: StayMetadataQuery,
        variables: {
          where: queryCondition,
          locale,
          hrefLangLocales: getHrefLangLocales(marketplace),
        },
        isRequiredForPageRendering: true,
      },
    ],
    errorStatusCode,
  };
};
