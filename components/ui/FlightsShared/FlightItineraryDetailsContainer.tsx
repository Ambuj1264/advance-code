import React from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Route } from "./FlightDetailedInformation";
import { Separator, SectionContentWrapper, MarginWrapper } from "./flightShared";
import { constructFlightTitle } from "./flightsSharedUtils";

import SectionWithTitle from "components/ui/Section/SectionWithTitle";
import { gutters, whiteColor } from "styles/variables";
import TicketIcon from "components/icons/ticket.svg";
import { mqMin } from "styles/base";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const iconStyles = css`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const RouteWrapper = styled.div<{ oneway: boolean }>(
  ({ oneway }) =>
    css`
      ${mqMin.large} {
        flex-basis: ${oneway ? 1 : "calc(50% - 33px)"};
      }
    `
);

const StyledSectionWithTitle = styled(SectionWithTitle)`
  margin-top: 0px;
  ${mqMin.large} {
    margin-top: 0px;
  }
`;

const FlightItineraryDetailsContainer = ({
  itineraryDetails,
}: {
  itineraryDetails: FlightTypes.FlightItinerary;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.flightNs);
  const { t: flightSearchT } = useTranslation(Namespaces.flightSearchNs);
  const { inboundRoute, outboundRoute } = itineraryDetails;
  const isRound = inboundRoute && inboundRoute?.flights.length > 0;
  return (
    <StyledSectionWithTitle
      color={theme.colors.primary}
      title={t("Itinerary details")}
      icon={<TicketIcon css={iconStyles} />}
    >
      <MarginWrapper>
        <SectionContentWrapper>
          <RouteWrapper oneway={!isRound} data-testid="oneway">
            <Route
              isOrigin
              route={outboundRoute}
              showTime
              title={constructFlightTitle({
                isRound: false,
                origin: outboundRoute.flights[0].origin,
                destination: outboundRoute.flights[outboundRoute.flights.length - 1].destination,
                t,
              })}
              flightClassString={flightSearchT(
                outboundRoute.flights[outboundRoute.flights.length - 1].flightClass
              )}
            />
          </RouteWrapper>
          {inboundRoute && isRound && (
            <>
              <Separator />
              <Route
                route={inboundRoute}
                showTime
                title={constructFlightTitle({
                  isRound: false,
                  origin: inboundRoute.flights[0].origin,
                  destination: inboundRoute.flights[inboundRoute.flights.length - 1].destination,
                  t,
                })}
                flightClassString={flightSearchT(
                  inboundRoute.flights[inboundRoute.flights.length - 1].flightClass
                )}
                dataTestid="round"
              />
            </>
          )}
        </SectionContentWrapper>
      </MarginWrapper>
    </StyledSectionWithTitle>
  );
};

export default FlightItineraryDetailsContainer;
