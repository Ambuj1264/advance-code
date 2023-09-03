import React, { SyntheticEvent, useContext } from "react";
import styled from "@emotion/styled";

import FlightSearchPageStateContext from "../contexts/FlightSearchPageStateContext";
import FlightSearchPageCallbackContext from "../contexts/FlightSearchPageCallbackContext";
import FlightSearchPageConstantContext from "../contexts/FlightSearchPageConstantContext";

import { mqMin } from "styles/base";
import { gutters, zIndex, borderRadiusSmall } from "styles/variables";
import { ContentWrapper } from "components/ui/Tabs/RoundedTabs";
import FlightSearchWidgetContent from "components/ui/FlightSearchWidget/FlightSearchWidgetContent";

const StyledContentWrapper = styled(ContentWrapper)`
  position: relative;
  border-radius: ${borderRadiusSmall};
  padding: ${gutters.small / 2}px ${gutters.large}px;
  text-align: left;
`;

const FlightSearchWidgetWrapper = styled.div`
  z-index: ${zIndex.z1};
  width: 100%;
  max-width: 548px;
  padding: ${gutters.small}px;
  padding-top: ${gutters.small}px;

  ${mqMin.large} {
    max-width: 1200px;
    padding-top: ${gutters.large - gutters.small / 2}px;
  }

  ${mqMin.desktop} {
    padding: ${gutters.large}px;
  }
`;

const FlightSearchWidgetLarge = ({
  onSearchClick,
  errorMessage,
}: {
  onSearchClick: (e: SyntheticEvent) => void;
  errorMessage?: string;
}) => {
  const {
    selectedDepartureDates,
    selectedReturnDates,
    flightType,
    passengers,
    cabinType,
    originName,
    destinationName,
  } = useContext(FlightSearchPageStateContext);
  const {
    onDepartureDateSelection,
    onReturnDateSelection,
    onOriginLocationChange,
    onDestinationLocationChange,
    onFlightTypeChange,
    onNumberOfPassengersChange,
    onCabinTypeChange,
  } = useContext(FlightSearchPageCallbackContext);
  const { defaultOrigin, defaultDestination } = useContext(FlightSearchPageConstantContext);
  return (
    <FlightSearchWidgetWrapper>
      <StyledContentWrapper>
        <FlightSearchWidgetContent
          isMobile={false}
          onSearchClick={onSearchClick}
          errorMessage={errorMessage}
          selectedDepartureDates={selectedDepartureDates}
          selectedReturnDates={selectedReturnDates}
          flightType={flightType}
          defaultOrigin={defaultOrigin}
          defaultDestination={defaultDestination}
          onDepartureDateSelection={onDepartureDateSelection}
          onReturnDateSelection={onReturnDateSelection}
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          onFlightTypeChange={onFlightTypeChange}
          passengers={passengers}
          onNumberOfPassengersChange={onNumberOfPassengersChange}
          cabinType={cabinType}
          onCabinTypeChange={onCabinTypeChange}
          onClearDates={() => {
            onDepartureDateSelection({ from: undefined, to: undefined });
            onReturnDateSelection({ from: undefined, to: undefined });
          }}
          origin={originName}
          destination={destinationName}
        />
      </StyledContentWrapper>
    </FlightSearchWidgetWrapper>
  );
};

export default FlightSearchWidgetLarge;
