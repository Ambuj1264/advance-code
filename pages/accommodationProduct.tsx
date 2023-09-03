import React from "react";
import { NextPageContext } from "next";

import { getPrefetchedData } from "../lib/apollo/getPrefetchedData";

import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import Header from "components/features/Header/MainHeader";
import {
  getLanguageFromContext,
  getSlugFromContext,
  getQueryParamsViaLayer0,
  longCacheHeaders,
  shouldSkipBreadcrumbsQuery,
} from "utils/apiUtils";
import breadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import AccommodationQuery from "components/features/Accommodation/queries/AccommodationQuery.graphql";
import GetAccommodationNearByPoints from "components/features/Accommodation/queries/AccommodationNearbyQuery.graphql";
import AccommodationContainer from "components/features/Accommodation/AccommodationContainer";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import { getInitialPropsWithApollo } from "lib/apollo/initApollo";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";

const AccommodationPage = ({ title, slug }: { title: string; slug: string }) => {
  return (
    <>
      <Header />
      <AccommodationContainer slug={slug} title={title} />
    </>
  );
};

const getAccommodationQueries = ({
  slug,
  path,
  latitude,
  longitude,
  skipNearbyPoints,
}: {
  slug: string;
  path: string;
  latitude?: number;
  longitude?: number;
  skipNearbyPoints: boolean;
}) => [
  {
    query: breadcrumbsQuery,
    variables: {
      slug,
      type: "ACCOMMODATION",
    },
    skip: shouldSkipBreadcrumbsQuery({ slug, type: "ACCOMMODATION" }),
    context: { headers: longCacheHeaders },
  },
  {
    query: GetAccommodationNearByPoints,
    variables: {
      latitude,
      longitude,
    },
    skip: skipNearbyPoints,
  },
  {
    query: PageMetadataQuery,
    context: { headers: longCacheHeaders },
    variables: {
      path,
    },
  },
];

AccommodationPage.getInitialProps = getInitialPropsWithApollo(
  PageType.ACCOMMODATION,
  async (ctx: NextPageContext, apollo) => {
    const slug = getSlugFromContext(ctx);
    const locale = getLanguageFromContext(ctx);
    const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
    const { title } = getQueryParamsViaLayer0(ctx);

    const { result: prefetchedData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
      query: AccommodationQuery,
      variables: {
        slug,
        locale,
      },
    });

    const accommodation = prefetchedData?.data?.accommodation;
    return {
      title,
      slug,
      namespacesRequired: [
        Namespaces.commonNs,
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.accommodationNs,
        Namespaces.accommodationBookingWidgetNs,
        Namespaces.commonBookingWidgetNs,
        Namespaces.reviewsNs,
      ],
      queries: getAccommodationQueries({
        slug,
        path,
        longitude: accommodation?.longitude,
        latitude: accommodation?.latitude,
        skipNearbyPoints: !accommodation,
      }),
      contactUsButtonPosition: Direction.Left,
      errorStatusCode,
    };
  }
);

export default AccommodationPage;
