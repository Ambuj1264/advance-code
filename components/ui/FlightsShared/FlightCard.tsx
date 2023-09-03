import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import ExpiryTimer from "../ExpiryTimer";
import MaybeClientLink from "../MaybeClientLink";

import { getFlightClassString, getCondensedFlightItinerary } from "./flightsSharedUtils";
import RouteInformation from "./RouteInformation";
import FlightCardDetailsModal from "./FlightCardDetailsModal";

import { CardContainer } from "components/features/Cart/sharedCartComponents";
import ProductFooter from "components/features/Cart/ProductFooter";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import FlightIcon from "components/icons/plane-1.svg";
import { typographySubtitle1 } from "styles/typography";
import { gutters } from "styles/variables";
import useToggle from "hooks/useToggle";
import { useTranslation } from "i18n";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";
import ShieldIcon from "components/icons/check-shield.svg";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";

const Title = styled.h2(({ theme }) => [
  typographySubtitle1,
  css`
    margin-top: ${gutters.small}px;
    color: ${theme.colors.primary};
    text-align: center;
  `,
]);

const CardContentWrapper = styled.div`
  position: relative;
  margin-top: ${gutters.small}px;
  margin-bottom: ${gutters.small}px;
  ${mqMin.large} {
    margin-top: 0;
  }
`;

const FlightCard = ({
  itinerary,
  className,
  onRemoveClick,
  onEditClick,
  onInformationClick,
  hideDetailedModalFooter = false,
  isActionFooter = false,
  expiredTimeDifference,
  isExpired,
  onExpired,
  isRemovingFromCart,
  isPriceLoading = false,
  isPaymentLink = false,
}: {
  itinerary: FlightSearchTypes.FlightItinerary;
  className?: string;
  onRemoveClick?: () => void;
  onEditClick?: () => void;
  onInformationClick?: () => void;
  hideDetailedModalFooter?: boolean;
  isActionFooter?: boolean;
  expiredTimeDifference?: number;
  isExpired?: boolean;
  onExpired?: () => void;
  isRemovingFromCart?: boolean;
  isPriceLoading?: boolean;
  isPaymentLink?: boolean;
}) => {
  const { t: orderT } = useTranslation(Namespaces.orderNs);
  const { t: flightSearchT } = useTranslation(Namespaces.flightSearchNs);
  const isMobile = useIsMobile();
  const [showDetailedInformation, toggleDetailedInformation] = useToggle();
  const flightClassString = getFlightClassString(
    flightSearchT,
    itinerary.outboundRoute,
    itinerary?.inboundRoute
  );
  const { firstOutboundFlight, lastOutboundFlight, firstInboundFlight, lastInboundFlight } =
    getCondensedFlightItinerary(itinerary);

  const clientRoute =
    expiredTimeDifference === undefined || isExpired ? itinerary.clientRoute : undefined;

  return (
    <>
      <CardContainer
        data-testid="itemContainerFlight"
        className={className}
        isExpiredOffer={!!isExpired}
        hasTitle={!!itinerary.title}
        isRemovingAnotherItem={isRemovingFromCart}
      >
        {itinerary.title && (
          <>
            <ProductCardActionHeader
              title={isExpired ? orderT("Offer expired") : orderT("Flights")}
              Icon={FlightIcon}
              onInformationClick={onInformationClick}
              onEditClick={isPaymentLink ? undefined : onEditClick}
              onRemoveClick={onRemoveClick}
              isExpiredOffer={!!isExpired}
              disableActions={isRemovingFromCart}
            />
            <Title>{itinerary.title}</Title>
          </>
        )}
        <CardContentWrapper>
          {firstOutboundFlight && lastOutboundFlight && (
            <RouteInformation
              dateOfDeparture={firstOutboundFlight.dateOfDeparture}
              timeOfDeparture={firstOutboundFlight.timeOfDeparture}
              origin={firstOutboundFlight.origin}
              originAirportCode={firstOutboundFlight.originAirportCode}
              destination={lastOutboundFlight.destination}
              dateOfArrival={lastOutboundFlight.dateOfArrival}
              timeOfArrival={lastOutboundFlight.timeOfArrival}
              destinationAirportCode={lastOutboundFlight.destinationAirportCode}
              nightsInDestination={lastOutboundFlight.nightsInDestination}
              totalDurationSec={itinerary.outboundRoute.totalDurationSec}
              numberOfStops={itinerary.outboundRoute.flights.length - 1}
              airlines={itinerary.outboundRoute.flights.map(flight => flight.airline)}
              onDetailsButtonClick={toggleDetailedInformation}
              isExpiredOffer={isExpired}
              clientRoute={clientRoute}
              flightClassString={flightClassString}
              isOneWay={!firstInboundFlight && !lastInboundFlight}
            />
          )}
          {firstInboundFlight && lastInboundFlight && (
            <MaybeClientLink clientRoute={clientRoute} skipTag>
              <RouteInformation
                dateOfDeparture={firstInboundFlight.dateOfDeparture}
                timeOfDeparture={firstInboundFlight.timeOfDeparture}
                origin={firstInboundFlight.origin}
                originAirportCode={firstInboundFlight.originAirportCode}
                destination={lastInboundFlight.destination}
                dateOfArrival={lastInboundFlight.dateOfArrival}
                timeOfArrival={lastInboundFlight.timeOfArrival}
                destinationAirportCode={lastInboundFlight.destinationAirportCode}
                nightsInDestination={lastInboundFlight.nightsInDestination}
                totalDurationSec={itinerary.inboundRoute!.totalDurationSec}
                numberOfStops={itinerary.inboundRoute!.flights.length - 1}
                airlines={itinerary.inboundRoute!.flights.map(flight => flight.airline)}
                onDetailsButtonClick={toggleDetailedInformation}
                isExpiredOffer={isExpired}
                clientRoute={clientRoute}
              />
            </MaybeClientLink>
          )}
        </CardContentWrapper>
        {expiredTimeDifference && (
          <ExpiryTimer
            numberOfSecondsUntilExpiry={expiredTimeDifference}
            onExpired={onExpired}
            isExpired={isExpired}
          />
        )}
        <ProductFooter
          isPriceLoading={isPriceLoading}
          price={itinerary.price}
          // we have priceObject only in cart, but this component is used in flight search results as well
          priceDisplayValue={itinerary.priceObject?.priceDisplayValue}
          priceDisplayCurrency={itinerary.priceObject?.currency}
          clientRoute={clientRoute}
          productProps={[
            {
              title: flightSearchT("All taxes included"),
              Icon: ShieldIcon,
            },
          ]}
          showLargeButton={!isMobile}
          priceSubtitle={flightSearchT("Price for {numberOfTravelers} travelers", {
            numberOfTravelers: itinerary.numberOfPassengers,
          })}
          isExpiredOffer={isExpired}
          isAction={isActionFooter}
          useRegularlink={!isMobile}
          shouldHideLoadingPrice={isPaymentLink}
        />
      </CardContainer>
      {showDetailedInformation && (
        <FlightCardDetailsModal
          flightItinerary={itinerary}
          onClose={toggleDetailedInformation}
          hideDetailedModalFooter={hideDetailedModalFooter}
        />
      )}
    </>
  );
};

export default FlightCard;
