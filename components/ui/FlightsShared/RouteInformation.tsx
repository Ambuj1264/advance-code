import styled from "@emotion/styled";
import React from "react";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { isSameDay } from "date-fns";

import MaybeClientLink from "../MaybeClientLink";

import { Separator } from "./SharedFlightComponents";
import FlightInformationPoint from "./FlightInformationPoint";
import FlightTimelinePoint from "./FlightTimelinePoint";
import FlightDate from "./FlightDate";

import Tooltip from "components/ui/Tooltip/Tooltip";
import SelfTransitIcon from "components/icons/tour-end.svg";
import { getDuration } from "utils/helperUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation, Trans } from "i18n";
import HotelBedroomIcon from "components/icons/hotel-bedroom.svg";
import ClockIcon from "components/icons/clock.svg";
import { typographyCaption, typographySubtitle3 } from "styles/typography";
import {
  blackColor,
  gutters,
  greyColor,
  fontWeightSemibold,
  whiteColor,
  borderRadius20,
  blueColor,
} from "styles/variables";
import { mqMin } from "styles/base";
import useActiveLocale from "hooks/useActiveLocale";
import { getShortYearMonthDayFormat } from "utils/dateUtils";
import InformationCircle from "components/icons/information-circle.svg";
import { useIsMobile } from "hooks/useMediaQueryCustom";

export const NightsOverview = styled.div<{
  isDetailedView?: boolean;
  isExpiredOffer: boolean;
}>(({ isDetailedView, isExpiredOffer }) => [
  typographyCaption,
  css`
    position: absolute;
    left: 0;
    padding-right: ${gutters.small / 2}px;
    background-color: ${isExpiredOffer ? rgba(whiteColor, 0.05) : whiteColor};
    color: ${greyColor};
    font-weight: ${fontWeightSemibold};
    ${mqMin.large} {
      left: ${isDetailedView ? "0" : "calc(50% - 90px)"};
      padding-left: ${isDetailedView ? 0 : gutters.small / 2}px;
    }
    & > svg {
      margin-right: ${gutters.small / 2}px;
      width: 12px;
      fill: ${rgba(blackColor, 0.7)};
    }
  `,
]);

const DetailsButton = styled.button(({ theme }) => [
  typographySubtitle3,
  css`
    min-width: 100px;
    color: ${theme.colors.primary};
    text-align: right;
    &:hover {
      text-decoration: underline;
    }
  `,
]);

const OneWayDetailsButton = styled(DetailsButton)(
  ({ theme }) => css`
    border-radius: 20px;
    padding: ${gutters.small / 2}px ${gutters.large / 2}px;
    background-color: ${rgba(theme.colors.action, 0.05)};
  `
);

const Wrapper = styled.div`
  position: relative;
`;

export const StayWrapper = styled.div<{ isDetailedView?: boolean }>(
  ({ isDetailedView }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: ${isDetailedView ? gutters.large * 2 : gutters.small * 2}px;
    ${mqMin.large} {
      height: ${isDetailedView ? gutters.large * 2 : gutters.small}px;
    }
  `
);

const StaySeparator = styled(Separator)`
  display: none;
  margin-left: unset;
  ${mqMin.medium} {
    display: block;
  }
`;

const FlightClassPill = styled.span([
  typographyCaption,
  css`
    position: absolute;
    top: 0;
    right: 0;
    border-radius: ${borderRadius20};
    padding: ${gutters.small / 2}px ${gutters.small}px;
    background-color: ${rgba(blueColor, 0.05)};
    color: ${greyColor};
  `,
]);

export const OneWayDetailsWrapper = styled.div`
  position: absolute;
  top: 40%;
  right: 0;
  ${mqMin.medium} {
    right: ${gutters.small}px;
  }
`;

const StyledSelfTransitIcon = styled(SelfTransitIcon)(
  ({ theme }) => css`
    margin-right: 4px;
    width: 18px;
    height: 18px;
    fill: ${theme.colors.primary};
  `
);

const SelfTransitWrapper = styled.div(({ theme }) => [
  typographyCaption,
  css`
    display: flex;
    align-items: center;
    margin-top: -${gutters.small / 2}px;
    margin-bottom: ${gutters.small}px;
    color: ${theme.colors.primary};
  `,
]);

const InformationCircleStyled = styled(InformationCircle)(
  ({ theme }) => css`
    margin-left: 4px;
    width: 12px;
    height: 12px;
    fill: ${rgba(theme.colors.primary, 0.4)};
  `
);

const ShowDetails = ({
  isDetailedView,
  onDetailsButtonClick,
}: {
  isDetailedView?: boolean;
  onDetailsButtonClick?: () => void;
}) =>
  !isDetailedView ? (
    <>
      <StaySeparator />
      <DetailsButton onClick={onDetailsButtonClick}>
        <Trans ns={Namespaces.commonNs}>Itinerary details</Trans>
      </DetailsButton>
    </>
  ) : null;

const StayOverview = ({
  isDetailedView,
  onDetailsButtonClick,
  isExpiredOffer,
  children,
}: {
  isDetailedView?: boolean;
  onDetailsButtonClick?: () => void;
  isExpiredOffer: boolean;
  children: React.ReactChild[];
}) => (
  <StayWrapper isDetailedView={isDetailedView}>
    <NightsOverview isDetailedView={isDetailedView} isExpiredOffer={isExpiredOffer}>
      {children}
    </NightsOverview>
    <ShowDetails isDetailedView={isDetailedView} onDetailsButtonClick={onDetailsButtonClick} />
  </StayWrapper>
);

const RouteInformation = ({
  className,
  isDetailedView,
  dateOfDeparture,
  timeOfDeparture,
  origin,
  originAirportCode,
  destination,
  dateOfArrival,
  timeOfArrival,
  destinationAirportCode,
  nightsInDestination,
  layoverTimeInSec,
  totalDurationSec,
  numberOfStops,
  airlines,
  flightNumber,
  onDetailsButtonClick,
  isExpiredOffer = false,
  clientRoute,
  flightClassString,
  isOneWay = false,
  bagsRecheckRequired = false,
  hasGuarantee = false,
}: {
  className?: string;
  isDetailedView?: boolean;
  dateOfDeparture: string;
  timeOfDeparture: string;
  origin: string;
  originAirportCode: string;
  destination: string;
  dateOfArrival: string;
  timeOfArrival: string;
  destinationAirportCode: string;
  nightsInDestination?: number;
  layoverTimeInSec?: number;
  totalDurationSec: number;
  numberOfStops?: number;
  airlines: FlightSearchTypes.Airline[];
  flightNumber?: string;
  onDetailsButtonClick?: () => void;
  isExpiredOffer?: boolean;
  clientRoute?: SharedTypes.ClientRoute;
  flightClassString?: string;
  isOneWay?: boolean;
  bagsRecheckRequired?: boolean;
  hasGuarantee?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const [hours, minutes] = getDuration(layoverTimeInSec ?? 0);
  const arrivalDate = new Date(dateOfArrival);
  const departureDate = new Date(dateOfDeparture);
  const showOneWayDetails = numberOfStops !== undefined && numberOfStops > 0 && isOneWay;
  const showStaysOverview =
    nightsInDestination !== undefined && (isDetailedView ? nightsInDestination > 0 : true);
  const isMobile = useIsMobile();
  return (
    <Wrapper className={className}>
      <MaybeClientLink
        clientRoute={clientRoute}
        skipTag
        useRegularLink={!isMobile}
        target={isMobile ? undefined : "_blank"}
      >
        {layoverTimeInSec !== undefined && (
          <StayOverview
            isDetailedView={isDetailedView}
            onDetailsButtonClick={onDetailsButtonClick}
            isExpiredOffer={isExpiredOffer}
          >
            <ClockIcon />
            <span>
              {t("{hours}h {minutes}m", { hours, minutes })} {t("layover")}
            </span>
          </StayOverview>
        )}
        {bagsRecheckRequired && isDetailedView && (
          <SelfTransitWrapper>
            <StyledSelfTransitIcon />
            {t("Self transfer")}
            {hasGuarantee && (
              <Tooltip
                tooltipWidth={200}
                title={t(
                  "You will need to leave the transit zone and check in for your next flight. If you have checked luggage, you will have to check it in again. But don't worry, your layover time is long enough for the transfer. And we provide you with a connection guarantee."
                )}
              >
                <InformationCircleStyled />
              </Tooltip>
            )}
          </SelfTransitWrapper>
        )}
        <FlightDate isDetailedView={isDetailedView}>
          {getShortYearMonthDayFormat(departureDate, activeLocale)}
        </FlightDate>
        <FlightTimelinePoint
          timeOfDeparture={timeOfDeparture}
          place={origin}
          airportCode={originAirportCode}
          isDetailedView={isDetailedView}
        />
        {!isDetailedView && flightClassString && (
          <FlightClassPill>{flightClassString}</FlightClassPill>
        )}
        <FlightInformationPoint
          durationInSec={totalDurationSec}
          numberOfStops={numberOfStops}
          airlines={airlines}
          flightNumber={flightNumber}
          isDetailedView={isDetailedView}
          flightClass={flightClassString}
        />
        <FlightTimelinePoint
          timeOfDeparture={timeOfArrival}
          place={destination}
          airportCode={destinationAirportCode}
          hasConnection={false}
          isDetailedView={isDetailedView}
        />
        {!isSameDay(arrivalDate, departureDate) && (
          <FlightDate isDestination isDetailedView={isDetailedView}>
            {getShortYearMonthDayFormat(arrivalDate, activeLocale)}
          </FlightDate>
        )}
      </MaybeClientLink>
      {showStaysOverview && (
        <StayOverview
          isExpiredOffer={isExpiredOffer}
          isDetailedView={isDetailedView}
          onDetailsButtonClick={onDetailsButtonClick}
        >
          <HotelBedroomIcon />
          <span>
            {t("{nightsInDestination} nights in {destination}", {
              nightsInDestination,
              destination,
            })}
          </span>
        </StayOverview>
      )}
      {showOneWayDetails && (
        <OneWayDetailsWrapper>
          <OneWayDetailsButton onClick={onDetailsButtonClick}>
            <Trans ns={Namespaces.commonNs}>Itinerary details</Trans>
          </OneWayDetailsButton>
        </OneWayDetailsWrapper>
      )}
    </Wrapper>
  );
};

export default RouteInformation;
