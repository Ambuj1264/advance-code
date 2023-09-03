import React from "react";
import { NextPageContext } from "next";

import { Direction } from "../types/enums";

import Header from "components/features/Header/MainHeader";
import FlightContainer from "components/features/Flight/FlightContainer";
import { Namespaces } from "shared/namespaces";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { cleanAsPathWithLocale, getPathWithoutSlugAndQueryParams } from "utils/routerUtils";
import { useServerSideRedirect } from "hooks/useRedirect";
import { getQueryParamsViaLayer0 } from "utils/apiUtils";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import NoIndex from "components/features/SEO/NoIndex";

const Flight = ({
  bookingToken,
  title,
  originId,
  dateFrom,
  asPath,
}: {
  bookingToken?: string;
  title: string;
  originId?: string;
  dateFrom: string;
  asPath: string;
}) => {
  const shouldRedirect = !bookingToken || !originId || !dateFrom;

  useServerSideRedirect({
    to: getPathWithoutSlugAndQueryParams(asPath),
    status: 302,
    condition: shouldRedirect,
  });
  const localeLinks = useLandingPageLocaleLinks({
    metadataUri: getPathWithoutSlugAndQueryParams(asPath),
  });

  if (shouldRedirect) return null;

  if (bookingToken) {
    return (
      <>
        <Header gteLocaleLinks={localeLinks} />
        <NoIndex />
        <QueryParamProvider skipScroll>
          <FlightContainer title={title} />
        </QueryParamProvider>
        <AdminGearLoader hideCommonLinks />
      </>
    );
  }
  return null;
};

Flight.getInitialProps = (ctx: NextPageContext) => {
  const { bookingToken, title, originId, dateFrom } = getQueryParamsViaLayer0(ctx);
  const asPath = ctx.asPath ? cleanAsPathWithLocale(ctx.asPath) : undefined;

  return {
    bookingToken,
    title,
    originId,
    dateFrom,
    asPath,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.commonSearchNs,
      Namespaces.flightSearchNs,
      Namespaces.commonBookingWidgetNs,
      Namespaces.flightNs,
      Namespaces.cartNs,
    ],
    queries: [],
    contactUsButtonPosition: Direction.Left,
  };
};

export default Flight;
