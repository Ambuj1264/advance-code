import React, { useContext } from "react";
import { useTheme } from "emotion-theming";

import FlightSearchPageCallbackContext from "../FlightSearchPage/contexts/FlightSearchPageCallbackContext";
import FlightSearchPageStateContext from "../FlightSearchPage/contexts/FlightSearchPageStateContext";

import FlightSearchWidgetSmallContent from "components/ui/FlightSearchWidget/FlightSearchWidgetSmallContent";
import { SearchWidgetDesktop as Wrapper } from "components/ui/SearchWidget/SearchWidget";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import { constructSearchUrl } from "components/ui/FlightsShared/flightsSharedUtils";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const ModalFlightSearchWidgetContent = ({
  searchLink,
  defaultOriginId,
  defaultOrigin,
  defaultDestinationId,
  defaultDestination,
}: {
  searchLink?: string;
  defaultOriginId?: string;
  defaultOrigin?: string;
  defaultDestinationId?: string;
  defaultDestination?: string;
}) => {
  const theme: Theme = useTheme();
  const {
    selectedDepartureDates,
    selectedReturnDates,
    flightType,
    destinationName,
    originName,
    originId,
    destinationId,
    passengers,
    cabinType,
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
  return (
    <Wrapper>
      <FlightSearchWidgetSmallContent
        isMobile={false}
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
        origin={originName}
        destination={destinationName}
        searchButton={
          <Button
            color="action"
            theme={theme}
            buttonSize={ButtonSize.Small}
            type="button"
            target="_blank"
            href={
              searchLink &&
              selectedDepartureDates.from &&
              (originId || defaultOriginId) &&
              (destinationId || defaultDestinationId) &&
              (originName || defaultOrigin) &&
              (destinationName || defaultDestination)
                ? constructSearchUrl({
                    searchUrl: searchLink,
                    adults: passengers.adults,
                    children: passengers.children,
                    infants: passengers.infants,
                    dateFrom: selectedDepartureDates.from,
                    returnDateFrom: selectedReturnDates.from,
                    flightType,
                    originId: originId! || defaultOriginId!,
                    origin: originName! || defaultOrigin!,
                    destinationId: destinationId! || defaultDestinationId!,
                    destination: destinationName! || defaultDestination!,
                    cabinType,
                  })
                : undefined
            }
          >
            <Trans ns={Namespaces.flightNs}>Search for availability</Trans>
          </Button>
        }
      />
    </Wrapper>
  );
};

export default ModalFlightSearchWidgetContent;
