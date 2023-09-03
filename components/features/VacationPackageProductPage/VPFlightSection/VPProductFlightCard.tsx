import React, { useCallback, useMemo, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { ApolloError } from "apollo-client";

import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import VPProductCardFooter, { TextWrapper } from "../VPProductCardFooter";
import VPProductCardModal from "../VPProductCardModal";
import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { useOnToggleModal } from "../contexts/VPStateHooks";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import FlightSelectHeader from "./FlightSelectHeader";
import VPBaggageInfoContent from "./VPBaggageInfoContent";

import FlightStateContext from "components/features/Flight/contexts/FlightStateContext";
import RouteInformation, {
  NightsOverview,
  OneWayDetailsWrapper,
  StayWrapper,
} from "components/ui/FlightsShared/RouteInformation";
import {
  getCondensedFlightItinerary,
  getFlightClassString,
} from "components/ui/FlightsShared/flightsSharedUtils";
import { Namespaces } from "shared/namespaces";
import { borderRadius, gutters } from "styles/variables";
import { useTranslation } from "i18n";
import { TileProductCardWrapper } from "components/ui/Search/utils/sharedSearchUtils";
import { getRouteInformationData } from "components/ui/FlightsShared/RouteInformationHelpers";
import { mqMax, mqMin, singleLineTruncation } from "styles/base";
import FlightDetailedInformation, {
  RouteModalHeading,
} from "components/ui/FlightsShared/FlightDetailedInformation";
import TicketIcon from "components/icons/ticket.svg";
import BaggageSectionIcon from "components/icons/baggage-plane.svg";
import Tooltip from "components/ui/Tooltip/Tooltip";

const StyledTileProductCardWrapper = styled(TileProductCardWrapper)`
  min-height: 451px;
  overflow: hidden;
`;

const StyledRouteInformation = styled(RouteInformation)`
  ${NightsOverview} {
    ${mqMin.large} {
      left: 0;
      padding-left: 0;
    }
  }
  ${StayWrapper} {
    ${mqMin.large} {
      height: ${gutters.large * 2}px;
    }
  }

  ${OneWayDetailsWrapper} {
    top: -5%;
  }
`;

const StyledVPProductCardFooter = styled(VPProductCardFooter)`
  ${TextWrapper} {
    width: 100%;
  }
`;

const CardContentWrapper = styled.div<{ isSelected: boolean }>(({ theme, isSelected }) => [
  isSelected
    ? css`
        span,
        div {
          color: ${theme.colors.action};
        }
        svg {
          fill: ${theme.colors.action};
        }
      `
    : css`
        color: inherit;
      `,
  css`
    position: relative;
    padding: ${gutters.large / 2}px;
  `,
]);

const TopFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BorderWrapper = styled.div<{ isSelected: boolean }>(
  ({ theme, isSelected }) => css`
    border: ${isSelected ? `2px solid ${theme.colors.action}` : `2px solid transparent`};
    border-radius: ${borderRadius};
    height: 100%;
    cursor: pointer;
  `
);

const Wrapper = styled.div`
  margin: 0 ${gutters.small}px;

  ${RouteModalHeading} {
    min-width: calc(100% + ${gutters.large * 2 + gutters.small * 2}px);
  }

  ${mqMax.large} {
    margin: 0 ${gutters.small / 2}px;
    ${RouteModalHeading} {
      min-width: calc(100% + ${gutters.large * 2 + gutters.small * 2}px);
    }
  }
`;

const BaggageTextContainer = styled.div`
  position: relative;
  width: 100%;
`;

const BaggageTextWrapper = styled.div([
  singleLineTruncation,
  css`
    position: absolute;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 90%;
  `,
]);

const VPProductFlightCard = ({
  itinerary,
  selectedFlightId,
  onItinerarySelect,
  flightBaggageQueryError,
}: {
  itinerary: VacationPackageTypes.VacationFlightItinerary;
  selectedFlightId?: string;
  onItinerarySelect: (selectedProductId: string) => void;
  flightBaggageQueryError?: ApolloError;
}) => {
  const { t: flightSearchT } = useTranslation(Namespaces.flightSearchNs);
  const { baggageInfoText } = useContext(VPFlightStateContext);
  const { passengers } = useContext(FlightStateContext);
  const { onSetVPFlightPriceInput } = useContext(VPActionCallbackContext);
  const flightClassString = getFlightClassString(
    flightSearchT,
    itinerary.outboundRoute,
    itinerary?.inboundRoute
  );
  const editModalTitle = {
    Icon: BaggageSectionIcon,
    title: flightSearchT("Baggage details and addons"),
  };
  const infoModalTitle = {
    Icon: TicketIcon,
    title: flightSearchT("Itinerary details"),
  };
  const { firstOutboundFlight, lastOutboundFlight, firstInboundFlight, lastInboundFlight } =
    useMemo(() => getCondensedFlightItinerary(itinerary), [itinerary]);
  const [isInfoModalActive, toggleInfoModal] = useOnToggleModal(
    VPActiveModalTypes.InfoFlight,
    itinerary.id
  );
  const onClickHandler = useCallback(() => {
    onItinerarySelect(itinerary.id);
  }, [itinerary.id, onItinerarySelect]);

  const onFlightEditModalClose = useCallback(() => {
    onSetVPFlightPriceInput(passengers);
  }, [passengers, onSetVPFlightPriceInput]);
  const outboundFlight = useMemo(
    () =>
      firstOutboundFlight &&
      lastOutboundFlight &&
      getRouteInformationData(firstOutboundFlight, lastOutboundFlight, toggleInfoModal),
    [firstOutboundFlight, lastOutboundFlight, toggleInfoModal]
  );
  const inboundFlight = useMemo(
    () =>
      firstInboundFlight &&
      lastInboundFlight &&
      getRouteInformationData(firstInboundFlight, lastInboundFlight, toggleInfoModal),
    [firstInboundFlight, lastInboundFlight, toggleInfoModal]
  );
  const isSelected = itinerary.id === selectedFlightId;
  const isOneWay = !firstInboundFlight && !lastInboundFlight;

  return (
    <>
      <BorderWrapper isSelected={isSelected}>
        <StyledTileProductCardWrapper onClick={onClickHandler}>
          <TopFlexContainer>
            <FlightSelectHeader
              isSelected={isSelected}
              flightRanking={itinerary.flightRanking}
              onInfoBtnClick={toggleInfoModal}
            />
            <CardContentWrapper isSelected={isSelected}>
              {outboundFlight !== undefined && (
                <StyledRouteInformation
                  {...outboundFlight}
                  nightsInDestination={isOneWay ? undefined : outboundFlight?.nightsInDestination}
                  totalDurationSec={itinerary.outboundRoute.totalDurationSec}
                  numberOfStops={itinerary.outboundRoute.flights.length - 1}
                  airlines={itinerary.outboundRoute.flights.map(flight => flight.airline)}
                  isExpiredOffer={false}
                  flightClassString={flightClassString}
                  isOneWay={isOneWay}
                />
              )}
              {inboundFlight !== undefined && (
                <StyledRouteInformation
                  {...inboundFlight}
                  totalDurationSec={itinerary?.inboundRoute?.totalDurationSec ?? 0}
                  numberOfStops={
                    itinerary?.inboundRoute?.flights.length
                      ? itinerary.inboundRoute.flights.length - 1
                      : 0
                  }
                  airlines={
                    itinerary?.inboundRoute?.flights?.map(flight => flight.airline) ?? [
                      { code: "", imageUrl: "", name: "" },
                    ]
                  }
                  isExpiredOffer={false}
                />
              )}
            </CardContentWrapper>
          </TopFlexContainer>
          <StyledVPProductCardFooter
            editModalTitle={editModalTitle}
            productId={itinerary.id}
            editModalId={VPActiveModalTypes.EditFlight}
            price={itinerary.vpPrice}
            onModalClose={onFlightEditModalClose}
            includedFooterTextContent={
              <Tooltip title={baggageInfoText} testid="baggageTextTooltip" fullWidth>
                <BaggageTextContainer>
                  <BaggageTextWrapper>{baggageInfoText}</BaggageTextWrapper>
                </BaggageTextContainer>
              </Tooltip>
            }
            radioButtonValue={itinerary.id}
            isSelected={isSelected}
            editModalContent={
              !flightBaggageQueryError ? (
                <VPBaggageInfoContent />
              ) : (
                // todo create real fallback in case of errors
                <div>there was an error fetching available baggage.</div>
              )
            }
            isCardDisabled={false}
          />
        </StyledTileProductCardWrapper>
      </BorderWrapper>
      {isInfoModalActive && (
        <VPProductCardModal
          modalTitle={infoModalTitle}
          modalContent={
            <Wrapper>
              <FlightDetailedInformation flightItinerary={itinerary} isModalView />
            </Wrapper>
          }
          onToggleModal={toggleInfoModal}
          withModalFooter={false}
        />
      )}
    </>
  );
};

export default VPProductFlightCard;
