import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import RouteInformation from "./RouteInformation";

import { getDuration } from "utils/helperUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { typographySubtitle1, typographyCaption, typographyBody2 } from "styles/typography";
import { gutters, greyColor, fontWeightSemibold } from "styles/variables";
import { mqMax } from "styles/base";

const RouteContainer = styled.div``;

const Wrapper = styled.div``;

const RouteHeading = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    color: ${theme.colors.primary};
  `,
]);

const RouteHeadingContainer = styled.div<{ isCentered: boolean }>(
  ({ isCentered }) =>
    css`
      display: flex;
      align-items: flex-end;
      justify-content: ${isCentered ? "center" : "flex-start"};
    `
);

export const RouteModalHeading = styled.div(
  typographyBody2,
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: ${gutters.large}px;
    width: 100%;
    height: 32px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
    color: ${theme.colors.primary};
    font-weight: ${fontWeightSemibold};
    ${mqMax.large} {
      margin-top: ${gutters.small}px;
    }
  `
);

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${gutters.small}px;
`;

const RouteDuration = styled.div(
  typographyCaption,
  css`
    display: flex;
    margin-left: ${gutters.small / 2}px;
    color: ${greyColor};
    line-height: 20px;
  `
);
export const Route = ({
  title,
  isOrigin,
  route,
  showTime = false,
  flightClassString,
  isModalView = false,
  dataTestid,
}: {
  title?: string;
  isOrigin?: boolean;
  route: FlightSearchTypes.Route;
  showTime?: boolean;
  flightClassString: string;
  isModalView?: boolean;
  dataTestid?: string;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const [hours, minutes] = getDuration(route.totalDurationSec ?? 0);
  const defaultTitle = isOrigin ? t("Departure") : t("Return");
  return (
    <RouteContainer data-testid={dataTestid}>
      <RouteHeadingContainer isCentered={!showTime}>
        {isModalView ? (
          <RouteModalHeading>{title || defaultTitle}</RouteModalHeading>
        ) : (
          <RouteHeading>{title || defaultTitle}</RouteHeading>
        )}
        {showTime && <RouteDuration>{`${hours}h ${minutes}m`}</RouteDuration>}
      </RouteHeadingContainer>
      <DetailsContainer>
        {route.flights.map(flight => (
          <RouteInformation
            key={flight.id}
            isDetailedView
            dateOfDeparture={flight.dateOfDeparture}
            timeOfDeparture={flight.timeOfDeparture}
            origin={flight.origin}
            originAirportCode={flight.originAirportCode}
            destination={flight.destination}
            dateOfArrival={flight.dateOfArrival}
            timeOfArrival={flight.timeOfArrival}
            destinationAirportCode={flight.destinationAirportCode}
            nightsInDestination={flight.nightsInDestination}
            layoverTimeInSec={flight.layoverTimeInSec}
            totalDurationSec={flight.durationInSec}
            flightNumber={flight.flightNumber}
            airlines={[flight.airline]}
            flightClassString={flightClassString}
            bagsRecheckRequired={flight.bagsRecheckRequired}
            hasGuarantee={flight.guarantee}
          />
        ))}
      </DetailsContainer>
    </RouteContainer>
  );
};

const FlightDetailedInformation = ({
  flightItinerary,
  className,
  isModalView = false,
}: {
  flightItinerary: FlightSearchTypes.FlightItinerary;
  className?: string;
  isModalView?: boolean;
}) => {
  const { t: flightSearchT } = useTranslation(Namespaces.flightSearchNs);
  const { outboundRoute, inboundRoute } = flightItinerary;

  return (
    <Wrapper className={className}>
      <Route
        isOrigin
        route={outboundRoute}
        showTime
        title={flightSearchT("{origin} to {destination}", {
          origin: outboundRoute.flights[0].origin,
          destination: outboundRoute.flights[outboundRoute.flights.length - 1].destination,
        })}
        flightClassString={flightSearchT(
          outboundRoute.flights[outboundRoute.flights.length - 1].flightClass
        )}
        isModalView={isModalView}
      />
      {inboundRoute && (
        <Route
          route={inboundRoute}
          showTime
          title={flightSearchT("{origin} to {destination}", {
            origin: inboundRoute.flights[0].origin,
            destination: inboundRoute.flights[inboundRoute.flights.length - 1].destination,
          })}
          flightClassString={flightSearchT(
            inboundRoute.flights[inboundRoute.flights.length - 1].flightClass
          )}
          isModalView={isModalView}
        />
      )}
    </Wrapper>
  );
};

export default FlightDetailedInformation;
