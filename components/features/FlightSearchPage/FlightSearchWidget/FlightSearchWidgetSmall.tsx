import React, { SyntheticEvent, useContext } from "react";

import FlightSearchPageStateContext from "../contexts/FlightSearchPageStateContext";
import FlightSearchPageCallbackContext from "../contexts/FlightSearchPageCallbackContext";
import FlightSearchPageConstantContext from "../contexts/FlightSearchPageConstantContext";

import FlightSearchWidgetSmallContent from "components/ui/FlightSearchWidget/FlightSearchWidgetSmallContent";
import SearchWidgetButton from "components/ui/SearchWidget/SearchWidgetButton";
import { SearchWidgetMobile, SearchWidgetDesktop } from "components/ui/SearchWidget/SearchWidget";

const FlightSearchWidgetSmall = ({
  isMobile,
  onSearchClick,
  onOriginLocationClick,
  onDestinationLocationClick,
  onDatesClick,
  onPassengersClick,
  errorMessage,
  rangeAsDefault,
}: {
  isMobile: boolean;
  onSearchClick: (e: SyntheticEvent) => void;
  onOriginLocationClick?: () => void;
  onDestinationLocationClick?: () => void;
  onDatesClick?: () => void;
  onPassengersClick?: () => void;
  errorMessage?: string;
  rangeAsDefault: boolean;
}) => {
  const Wrapper = isMobile ? SearchWidgetMobile : SearchWidgetDesktop;
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
    <Wrapper>
      <FlightSearchWidgetSmallContent
        isMobile={isMobile}
        onOriginLocationClick={onOriginLocationClick}
        onDestinationLocationClick={onDestinationLocationClick}
        onDatesClick={onDatesClick}
        onPassengersClick={onPassengersClick}
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
        rangeAsDefault={rangeAsDefault}
        searchButton={
          <SearchWidgetButton onSearchClick={onSearchClick} tooltipErrorMessage={errorMessage} />
        }
        origin={originName}
        destination={destinationName}
      />
    </Wrapper>
  );
};

export default FlightSearchWidgetSmall;
