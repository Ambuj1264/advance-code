import React, { SyntheticEvent, useCallback } from "react";

import {
  useGetParticularStepOpenHandler,
  useOnFlightsDepartureDateSelection,
  useOnFlightsReturnDateSelection,
  useOnFlightsOriginChange,
  useOnFlightsDestinationChange,
  useOnFlightTypeChange,
  useOnFlightsPassengersChange,
  useOnFlightsCabinTypeChange,
  useOnClearFlightDates,
} from "../frontHooks";

import { useIsDesktop } from "hooks/useMediaQueryCustom";
import FlightSearchWidgetTabContent from "components/ui/FlightSearchWidget/FlightSearchWidgetTabContent";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import {
  FlightsMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const FlightsTab = ({
  isMobile,
  onSearchClick,
  useDesktopStyle = true,
}: {
  isMobile: boolean;
  onSearchClick: (e: SyntheticEvent) => void;
  useDesktopStyle?: boolean;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const isDesktop = useIsDesktop();
  const {
    flightDepartureDates,
    flightReturnDates,
    flightOriginName,
    flightDestinationName,
    flightPassengers,
    flightType,
    flightCabinType,
    flightDefaultOriginName,
    flightDefaultDestinationName,
    flightDestinationId,
  } = useFrontSearchContext();
  const onDepartureDateSelection = useOnFlightsDepartureDateSelection();
  const onReturnDateSelection = useOnFlightsReturnDateSelection();
  const onOriginLocationChange = useOnFlightsOriginChange();
  const onDestinationLocationChange = useOnFlightsDestinationChange();
  const onFlightTypeChange = useOnFlightTypeChange();
  const onNumberOfPassengersChange = useOnFlightsPassengersChange();
  const onCabinTypeChange = useOnFlightsCabinTypeChange();
  const onClearDates = useOnClearFlightDates();
  const onlyDeparture = flightType === "oneway";
  const flightsStepsController = useGetParticularStepOpenHandler<FlightsMobileStepsEnum>(
    FrontStepKeys.flightsCurrentStep
  );
  const onOriginLocationInputClick = flightsStepsController(FlightsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Origin,
  });
  const onDestinationLocationInputClick = flightsStepsController(FlightsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Destination,
  });
  const onDatesClick = flightsStepsController(FlightsMobileStepsEnum.Dates, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });
  const onPassengersClick = flightsStepsController(FlightsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });
  const roundTripHasDates =
    flightType === "round" ? Boolean(flightDepartureDates.from && flightReturnDates.from) : true;
  const isFormValid =
    (flightDepartureDates.from || flightReturnDates.from) &&
    flightOriginName &&
    flightDestinationName &&
    roundTripHasDates;
  const errorMessage =
    !isFormValid && isDesktop ? commonSearchT("Please fill in your search information") : undefined;
  const onSearchButtonClick = useCallback(
    (e: SyntheticEvent) => {
      const isDatesMissing = onlyDeparture
        ? !flightDepartureDates.from
        : !flightDepartureDates.from || !flightReturnDates.from;
      const isLocationMissing = !flightOriginName || !flightDestinationName;
      if ((isDatesMissing || isLocationMissing) && !isDesktop) {
        e.preventDefault();
        if (isDatesMissing) {
          onDatesClick();
        } else if (!flightOriginName) {
          onOriginLocationInputClick();
        } else {
          onDestinationLocationInputClick();
        }
      } else {
        onSearchClick(e);
      }
    },
    [
      onlyDeparture,
      flightDepartureDates,
      flightReturnDates,
      flightOriginName,
      flightDestinationName,
      onOriginLocationInputClick,
      onDestinationLocationInputClick,
      onDatesClick,
      onSearchClick,
    ]
  );
  return (
    <FlightSearchWidgetTabContent
      isMobile={isMobile}
      onSearchClick={onSearchButtonClick}
      onOriginLocationInputClick={onOriginLocationInputClick}
      onDestinationLocationInputClick={onDestinationLocationInputClick}
      onDatesClick={onDatesClick}
      errorMessage={errorMessage}
      selectedDepartureDates={flightDepartureDates}
      selectedReturnDates={flightReturnDates}
      flightType={flightType}
      onDepartureDateSelection={onDepartureDateSelection}
      onReturnDateSelection={onReturnDateSelection}
      onOriginLocationChange={onOriginLocationChange}
      onDestinationLocationChange={onDestinationLocationChange}
      onFlightTypeChange={onFlightTypeChange}
      passengers={flightPassengers}
      onNumberOfPassengersChange={onNumberOfPassengersChange}
      cabinType={flightCabinType}
      onCabinTypeChange={onCabinTypeChange}
      onClearDates={onClearDates}
      origin={flightOriginName}
      destination={flightDestinationName}
      destinationId={flightDestinationId}
      defaultOrigin={flightDefaultOriginName}
      defaultDestination={flightDefaultDestinationName}
      onPassengersClick={onPassengersClick}
      useDesktopStyle={useDesktopStyle}
    />
  );
};

export default FlightsTab;
