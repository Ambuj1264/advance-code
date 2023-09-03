/* eslint-disable camelcase */
import React from "react";
import { NextPageContext } from "next";

import { asPathWithoutQueryParams } from "../utils/routerUtils";
import GetRedirectUrlQuery from "../lib/GetRedirectUrlQuery.graphql";

import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import Header from "components/features/Header/MainHeader";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import {
  constructGtiCnRelativeUrl,
  getLanguageFromContext,
  getMarketplaceFromCtx,
  getMarketplaceUrl,
  getQueryParamsViaLayer0,
  isGtiCn,
  urlWithChineseLocale,
} from "utils/apiUtils";
import { Namespaces } from "shared/namespaces";
import CarContainer from "components/features/Car/CarContainer";
import { Direction, Marketplace } from "types/enums";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";
import routes from "shared/routes";
import NoIndex from "components/features/SEO/NoIndex";

const CarPage = ({
  carId,
  title,
  carName,
  cart_item,
  missingRequiredQueryParams,
}: {
  carId: string;
  title: string;
  carName: string;
  // eslint-disable-next-line camelcase
  cart_item?: string;
  missingRequiredQueryParams?: boolean;
}) => {
  if (missingRequiredQueryParams) {
    return (
      <>
        <Header />
        <ErrorComponent
          error={new Error("Car travel details are missing")}
          componentName="CarPage"
          handleSsrRedirect
        />
      </>
    );
  }

  return (
    <QueryParamProvider>
      <Header />
      <NoIndex />
      <CarContainer id={carId} editItem={Number(cart_item)} carName={title || carName} />
    </QueryParamProvider>
  );
};

CarPage.getInitialProps = (ctx: NextPageContext) => {
  const marketplaceUrl = getMarketplaceUrl(ctx);
  const marketplace = getMarketplaceFromCtx(ctx);
  const locale = getLanguageFromContext(ctx);
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const match = routes.match(ctx.asPath, marketplaceUrl);
  const asPath = ctx.asPath ?? "";
  const normalizedAsPath = urlWithChineseLocale(asPath);
  const asPathWithoutQuery = asPathWithoutQueryParams(isGTE ? asPath : normalizedAsPath);
  const clientRouteParams = match?.params;
  const queryParams = getQueryParamsViaLayer0(ctx, clientRouteParams);
  const missingRequiredQueryParams =
    !queryParams.carId || !queryParams.pickup_id || !queryParams.dropoff_id;

  const redirectUrlQueryVariable = isGtiCn(marketplace, locale)
    ? constructGtiCnRelativeUrl(asPathWithoutQuery, locale)
    : asPathWithoutQuery;

  return {
    ...queryParams,
    missingRequiredQueryParams,
    contactUsMobileMargin: ContactUsMobileMargin.RegularFooter,
    contactUsButtonPosition: Direction.Left,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.carNs,
      Namespaces.carnectNs,
      Namespaces.carBookingWidgetNs,
      Namespaces.commonBookingWidgetNs,
      Namespaces.carSearchNs,
      Namespaces.commonCarNs,
      Namespaces.commonSearchNs,
      Namespaces.reviewsNs,
    ],
    queries: [
      ...(missingRequiredQueryParams
        ? [
            {
              query: GetRedirectUrlQuery,
              variables: {
                url: redirectUrlQueryVariable,
              },
            },
          ]
        : []),
    ],
  };
};

export default CarPage;
