import React from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getFlightPageType } from "../FlightSearchPage/utils/flightSearchUtils";

import { getSearchUrl, constructBaggage, getSearchUrlFromProductUrl } from "./utils/flightUtils";
import FlightContentContainer from "./FlightContentContainer";
import useFlightQueryParams from "./utils/useFlightQueryParams";
import FlightProvider from "./FlightProvider";
import { useFlightContentQuery } from "./useFlightQueries";
import FlightContentLoading from "./FlightContentLoading";

import Container from "components/ui/Grid/Container";
import { Marketplace } from "types/enums";
import { getPathWithoutSlugAndQueryParams } from "utils/routerUtils";
import useCountryList from "hooks/useCountryList";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import DefaultHeadTags from "lib/DefaultHeadTags";
import PageContentContainer, { Content } from "components/ui/PageContentContainer";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useSettings } from "contexts/SettingsContext";
import useSession from "hooks/useSession";
import { gutters } from "styles/variables";
import { constructFlightTitle } from "components/ui/FlightsShared/flightsSharedUtils";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import LandingPageLoadingBreadcrumbs from "components/ui/LandingPages/LandingPageLoadingBreadcrumbs";
import ProductHeader from "components/ui/ProductHeader";
import { mqMin } from "styles/base";

const StyledLandingPageLoadingBreadcrumbs = styled(LandingPageLoadingBreadcrumbs)<{
  useGTEStyles?: boolean;
}>(
  ({ useGTEStyles }) => css`
    justify-content: center;
    min-height: ${useGTEStyles ? 0 : "24px"};
    ${mqMin.medium} {
      justify-content: normal;
    }
  `
);

const StyledContent = styled(Content)`
  padding: 0 ${gutters.small}px;
`;
const FlightContainer = ({ title }: { title: string }) => {
  const [
    {
      adults = 1,
      children = 0,
      infants = 0,
      bookingToken,
      originId = "",
      origin = "",
      destinationId = "",
      destination = "",
      dateFrom = "",
      returnDateFrom,
      cabinType = "M",
      cartItemId,
    },
  ] = useFlightQueryParams();
  const { websiteName, marketplace, marketplaceUrl } = useSettings();
  const isGTE = Boolean(marketplace === Marketplace.GUIDE_TO_EUROPE);
  const { t } = useTranslation(Namespaces.flightNs);
  const { asPath } = useRouter();
  const { user, queryCompleted } = useSession();
  const { countryListLoading } = useCountryList();
  const { flightContentData, flightContentError, flightContentLoading } = useFlightContentQuery();
  const passportRequired =
    (flightContentData?.flightCheckFlight?.documentOptions?.documentNeed ?? 0) > 1;
  const isRound = returnDateFrom !== undefined;
  const searchUrl = getSearchUrlFromProductUrl(asPath);
  const flightSearchUrl = getSearchUrl({
    searchUrl,
    adults,
    children,
    infants,
    originId,
    origin,
    destinationId,
    destination,
    departureDate: dateFrom,
    returnDate: returnDateFrom,
    cabinType,
    cartItemId,
  });

  const flightTitle = constructFlightTitle({ isRound, origin, destination, t });
  const metadataTitle = `${title || flightTitle} | ${websiteName}`;
  if ((!flightContentData && flightContentLoading) || countryListLoading || !queryCompleted) {
    return (
      <>
        <DefaultHeadTags title={metadataTitle} />
        <Container>
          <StyledLandingPageLoadingBreadcrumbs useGTEStyles={isGTE} />
          <ProductHeader title={title} />
        </Container>
        <PageContentContainer>
          <StyledContent>
            <FlightContentLoading />
          </StyledContent>
          <BookingWidgetLoadingContainer />
        </PageContentContainer>
      </>
    );
  }
  const breadcrumbQueryCondition = {
    pageType: getFlightPageType(marketplaceUrl),
    metadataUri: getPathWithoutSlugAndQueryParams(asPath),
  };
  return (
    <>
      <DefaultHeadTags title={metadataTitle} />
      <Container>
        <LandingPageBreadcrumbs
          queryCondition={breadcrumbQueryCondition}
          customLastBreadcrumb={t("Summary & personalization")}
          onProductPage={isGTE}
        />
        <ProductHeader title={flightTitle} />
      </Container>
      <PageContentContainer>
        <FlightProvider
          queryAdults={adults}
          queryChildren={children}
          queryInfants={infants}
          baggage={constructBaggage(t, flightContentData?.flightCheckFlight?.availableBaggages)}
          originId={originId}
          origin={origin}
          destinationId={destinationId}
          destination={destination}
          searchPageUrl={searchUrl}
          passportRequired={passportRequired}
          dateOfDeparture={dateFrom}
          defaultNationality={user?.countryCode}
          defaultEmail={user?.email}
        >
          <FlightContentContainer
            flightSearchUrl={flightSearchUrl}
            flightContentData={flightContentData}
            hasError={flightContentError !== undefined || !flightContentData?.flightCheckFlight}
            title={flightTitle}
            adults={adults}
            infants={infants}
            bookingToken={bookingToken}
            cartItemId={cartItemId}
            flightContentLoading={flightContentLoading}
          />
        </FlightProvider>
      </PageContentContainer>
    </>
  );
};

export default FlightContainer;
