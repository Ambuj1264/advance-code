import React from "react";
import { NextPageContext } from "next";
import { Direction } from "@travelshift/ui/types/enums";

import { getTotalNumberOfGTIVpTravelers } from "../components/features/TourBookingWidget/Travelers/utils/travelersUtils";
import { getPrefetchedData } from "../lib/apollo/getPrefetchedData";
import { getInitialPropsWithApollo } from "../lib/apollo/initApollo";
import { PageType } from "../types/enums";
import { cleanAsPath, removeEnCnLocaleCode } from "../utils/routerUtils";

import {
  getQueryParamsViaLayer0,
  getLanguageFromContext,
  getSlugFromContext,
  longCacheHeaders,
  noCacheHeaders,
  shouldSkipBreadcrumbsQuery,
} from "utils/apiUtils";
import Header from "components/features/Header/MainHeader";
import breadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import TourContainer from "components/features/Tour/TourContainer";
import TourQuery from "components/features/Tour/queries/TourQuery.graphql";
import ReviewsQuery from "components/features/Reviews/queries/ReviewsQuery.graphql";
import GTIVpCachedPriceQuery from "components/features/TourBookingWidget/queries/GTIVpCachedPriceQuery.graphql";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import { Namespaces } from "shared/namespaces";

const TourPage = ({
  currentRequestAuth,
  title,
  slug,
  adults,
  childrenAges,
  preview,
  forceLivePricing,
  cartItem,
}: {
  currentRequestAuth?: string;
  title: string;
  slug: string;
  adults: number;
  childrenAges: number[];
  preview?: boolean;
  forceLivePricing: boolean;
  cartItem: number;
}) => {
  return (
    <>
      <Header />
      <TourContainer
        key={slug}
        slug={slug}
        currentRequestAuth={currentRequestAuth}
        title={title}
        isPreview={preview}
        forceLivePricing={forceLivePricing}
        adults={adults}
        childrenAges={childrenAges}
        cartItem={cartItem}
      />
    </>
  );
};

const getTourQueries = ({
  slug,
  path,
  locale,
  adults,
  childrenAges,
  dateFrom,
  isLivePricing,
}: {
  slug: string;
  path: string;
  locale: string;
  adults: number;
  childrenAges: number[];
  dateFrom?: string;
  isLivePricing?: boolean;
}) => [
  ...(isLivePricing
    ? [
        {
          query: GTIVpCachedPriceQuery,
          variables: {
            slug,
            travelers: getTotalNumberOfGTIVpTravelers({ adults, childrenAges }),
            childrenAges,
            startDate: dateFrom || undefined,
            isCachedPrice: true,
          },
          context: { headers: noCacheHeaders },
        },
      ]
    : []),
  {
    query: breadcrumbsQuery,
    variables: {
      slug,
      type: "TOUR",
    },
    skip: shouldSkipBreadcrumbsQuery({ slug, type: "TOUR" }),
    context: { headers: longCacheHeaders },
  },
  {
    query: ReviewsQuery,
    variables: {
      page: 1,
      localeFilter: locale,
      slug,
      type: "tour",
      scoreFilter: null,
    },
  },
  {
    query: PageMetadataQuery,
    variables: {
      path,
    },
    context: { headers: longCacheHeaders },
  },
];

TourPage.getInitialProps = getInitialPropsWithApollo(
  PageType.TOUR,
  async (ctx: NextPageContext, apollo) => {
    const slug = getSlugFromContext(ctx);
    const path = ctx.asPath;
    const preview = path?.includes("?preview=1");
    const locale = getLanguageFromContext(ctx);
    const {
      title,
      forceLivePricing: forceLivePricingQueryParam,
      adults,
      childrenAges,
      dateFrom,
      cart_item: cartItem,
    } = getQueryParamsViaLayer0(ctx);
    const forceLivePricing = Boolean(forceLivePricingQueryParam);
    const normalizedAdults = adults ? parseInt(adults, 10) : 1;
    const normalizeChildrenAges = childrenAges ? childrenAges.split(",").map(Number) : [];
    const pathWithoutLocale = removeEnCnLocaleCode(cleanAsPath(path, locale), locale);

    const { result: prefetchedTourData, errorStatusCode } = await getPrefetchedData(apollo, ctx, {
      query: TourQuery,
      variables: {
        slug,
        locale,
        preview,
        forceLivePricing,
      },
    });

    const namespacesRequired = [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonBookingWidgetNs,
      Namespaces.tourBookingWidgetNs,
      Namespaces.tourNs,
      Namespaces.reviewsNs,
    ];
    return {
      title,
      slug,
      adults: normalizedAdults,
      childrenAges: normalizeChildrenAges,
      namespacesRequired,
      preview,
      forceLivePricing,
      cartItem: parseInt(cartItem || "0", 10),
      getLanguageFromContext,
      queries: getTourQueries({
        slug,
        path: pathWithoutLocale,
        locale,
        adults: normalizedAdults,
        childrenAges: normalizeChildrenAges,
        dateFrom,
        isLivePricing: prefetchedTourData?.data?.tour?.isLivePricing,
      }),
      currentRequestAuth: ctx.req?.headers?.Authorization,
      contactUsButtonPosition: Direction.Left,
      errorStatusCode,
    };
  }
);

export default TourPage;
