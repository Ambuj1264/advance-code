import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";

import FlightItineraryDetailsContainer from "../../ui/FlightsShared/FlightItineraryDetailsContainer";

import FlightContactDetailsContainer from "./FlightContactDetailsContainer";
import PassengerDetailsContainer from "./PassengerDetailsContainer";
import { constructFlightItinerary, getQueryBaggage, getBagCount } from "./utils/flightUtils";
import FlightChangedModal from "./FlightChangedModal";
import FlightStateContext from "./contexts/FlightStateContext";
import { useFlightQuery } from "./useFlightQueries";
import useFlightQueryParams from "./utils/useFlightQueryParams";

import { ProductChangedContent } from "components/ui/ProductChangedModal";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import CustomNextDynamic from "lib/CustomNextDynamic";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import { Content } from "components/ui/PageContentContainer";
import { gutters } from "styles/variables";

const FlightBookingWidgetContainer = CustomNextDynamic(
  () => import("./FlightBookingWidgetContainer"),
  { ssr: false, loading: () => <BookingWidgetLoadingContainer /> }
);

const NoFlightWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.large * 2}px;
  width: 100%;
`;

const StyledContent = styled(Content)`
  padding: 0 ${gutters.small}px;
`;

const FlightContentContainer = ({
  flightSearchUrl,
  flightContentData,
  hasError,
  title,
  adults,
  infants,
  bookingToken,
  cartItemId,
  flightContentLoading,
}: {
  flightSearchUrl: string;
  flightContentData?: {
    flightCheckFlight: FlightTypes.QueryFlightContentData;
    cartLink: string;
  };
  hasError: boolean;
  title: string;
  adults: number;
  infants: number;
  bookingToken?: string;
  cartItemId?: string;
  flightContentLoading?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.flightNs);
  const { passengers } = useContext(FlightStateContext);
  const queryBaggage = getQueryBaggage(passengers);
  const bagCount = getBagCount(passengers);
  const [isModalOpen, onOpenModal] = useState(false);
  const [{ children = 0 }] = useFlightQueryParams();
  const {
    flightData,
    flightsChecked,
    flightsInvalid,
    price,
    priceChange,
    showHealthDeclaration,
    flightsRefetching,
  } = useFlightQuery({
    queryBaggage,
    bagCount,
    hasError,
    adults,
    children,
    infants,
    bookingToken,
    skip: !flightContentData,
  });
  const [hasAcceptedPriceChange, onAcceptPriceChange] = useState(false);
  const onModalClose = useCallback(() => {
    onAcceptPriceChange(true);
    onOpenModal(false);
  }, []);
  useEffect(() => {
    if ((priceChange || flightsInvalid) && !hasAcceptedPriceChange && !isModalOpen) {
      onOpenModal(true);
    }
  }, [flightsInvalid, hasAcceptedPriceChange, isModalOpen, priceChange]);

  if (!flightContentData || hasError) {
    return (
      <NoFlightWrapper>
        <ProductChangedContent
          isInvalid
          title={t("Sorry, this flight just sold out!")}
          description={t("Hurry and search for more similar flights now before they sell out too!")}
          searchUrl={flightSearchUrl}
        />
      </NoFlightWrapper>
    );
  }

  const itineraryDetails = constructFlightItinerary(flightContentData.flightCheckFlight);
  const { outboundRoute, inboundRoute } = itineraryDetails;

  return (
    <>
      <StyledContent>
        <FlightItineraryDetailsContainer itineraryDetails={itineraryDetails} />
        <FlightContactDetailsContainer
          showHealthDeclaration={showHealthDeclaration}
          dataTestid="passenger-contact-details"
        />
        <PassengerDetailsContainer nrOfAdults={adults} nrOfInfants={infants} />
      </StyledContent>
      <FlightBookingWidgetContainer
        departureDate={outboundRoute.flights[0].dateOfDeparture}
        returnDate={inboundRoute?.flights[0]?.dateOfDeparture ?? undefined}
        departureTime={outboundRoute.flights[0].timeOfDeparture}
        returnTime={inboundRoute?.flights[0]?.timeOfDeparture ?? undefined}
        bookingToken={bookingToken}
        isFlightChecked={flightsChecked ?? false}
        cartLink={flightContentData.cartLink}
        flightSearchUrl={flightSearchUrl}
        title={title}
        id={flightContentData.flightCheckFlight.bookingToken}
        price={price}
        cartItemId={cartItemId}
        showHealthDeclaration={showHealthDeclaration}
        sessionId={flightData?.flightCheckFlight.sessionId}
        flightLoading={flightContentLoading || flightsRefetching}
      />
      {isModalOpen && (
        <FlightChangedModal
          isInvalid={flightsInvalid}
          flightSearchUrl={flightSearchUrl}
          price={price}
          onModalClose={onModalClose}
        />
      )}
    </>
  );
};

export default FlightContentContainer;
