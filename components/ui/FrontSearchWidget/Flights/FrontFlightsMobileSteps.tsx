import React, { SyntheticEvent, useCallback, useState, useMemo } from "react";

import {
  useOnFlightsDepartureDateSelection,
  useOnFlightsReturnDateSelection,
  useOnFlightsOriginChange,
  useOnFlightsDestinationChange,
  useOnFlightTypeChange,
  useOnFlightsPassengersChange,
  useOnFlightsCabinTypeChange,
  useOnClearFlightDates,
} from "../frontHooks";
import FrontStepModal from "../FrontStepModal";
import { getFlightsMobileSteps } from "../utils/frontUtils";

import { getFlightMinMaxDates } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import MobileMultiRangeDatePicker from "components/ui/DatePicker/MobileMultiRangeDatePicker";
import { Namespaces } from "shared/namespaces";
import FlightTravelDetailsStep from "components/ui/FlightSearchWidget/FlightTravelDetailsStep";
import FlightIcon from "components/icons/plane-1.svg";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import {
  FlightsMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useTranslation } from "i18n";

const FrontFlightsMobileSteps = ({
  onModalClose,
  onSearchClick,
}: {
  onModalClose: () => void;
  onSearchClick: (e: SyntheticEvent) => void;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const [isReturnActive, setReturnActive] = useState(false);
  const {
    flightsCurrentStep,
    flightDepartureDates,
    flightReturnDates,
    flightOriginName,
    flightDestinationName,
    flightPassengers,
    flightType,
    flightCabinType,
    flightDefaultOriginName,
    flightDefaultOriginId,
    flightDefaultDestinationName,
    flightDefaultDestinationId,
    flightsOpenedStep,
    activeLocationAutocomplete,
  } = useFrontSearchContext();
  const onDepartureDateSelection = useOnFlightsDepartureDateSelection();
  const onReturnDateSelection = useOnFlightsReturnDateSelection();
  const onOriginLocationChange = useOnFlightsOriginChange();
  const onDestinationLocationChange = useOnFlightsDestinationChange();
  const onFlightTypeChange = useOnFlightTypeChange();
  const onNumberOfPassengersChange = useOnFlightsPassengersChange();
  const onCabinTypeChange = useOnFlightsCabinTypeChange();
  const onClearDates = useOnClearFlightDates();
  const dates = getFlightMinMaxDates();

  const roundTripHasDates =
    flightType === "round" ? Boolean(flightDepartureDates.from && flightReturnDates.from) : true;
  const isFormValid =
    flightDepartureDates.from && flightOriginName && flightDestinationName && roundTripHasDates;
  const onlyDeparture = flightType === "oneway";
  const onSetReturnActive = useCallback(
    (returnActive: boolean) => {
      if (onlyDeparture && returnActive === true) {
        onFlightTypeChange("round" as FlightSearchTypes.FlightType);
      }
      setReturnActive(returnActive);
    },
    [setReturnActive, onlyDeparture, onFlightTypeChange]
  );
  const steps = useMemo(
    () =>
      getFlightsMobileSteps(
        flightsOpenedStep,
        onlyDeparture,
        flightDepartureDates.from,
        flightReturnDates.from,
        flightOriginName,
        flightDestinationName
      ),
    [flightsOpenedStep]
  );
  return (
    <FrontStepModal<FlightsMobileStepsEnum>
      title="Flights"
      Icon={FlightIcon}
      onModalClose={onModalClose}
      onSearchClick={onSearchClick}
      stepKey={FrontStepKeys.flightsCurrentStep}
      datesStep={FlightsMobileStepsEnum.Dates}
      hideTitle
      translationNamespace={Namespaces.flightSearchNs}
      steps={steps}
      tooltipErrorMessage={
        !isFormValid ? commonSearchT("Please fill in your search information") : undefined
      }
    >
      {FlightsMobileStepsEnum.Details === flightsCurrentStep && (
        <FlightTravelDetailsStep
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          origin={flightOriginName}
          destination={flightDestinationName}
          defaultOrigin={flightDefaultOriginName}
          defaultOriginId={flightDefaultOriginId}
          defaultDestination={flightDefaultDestinationName}
          defaultDestinationId={flightDefaultDestinationId}
          passengers={flightPassengers}
          onNumberOfPassengersChange={onNumberOfPassengersChange}
          cabinType={flightCabinType}
          onCabinTypeChange={onCabinTypeChange}
          flightType={flightType}
          onFlightTypeChange={onFlightTypeChange}
          forceOriginFocus={activeLocationAutocomplete === ActiveLocationAutocomplete.Origin}
          forceDestinationFocus={
            activeLocationAutocomplete === ActiveLocationAutocomplete.Destination
          }
        />
      )}
      {FlightsMobileStepsEnum.Dates === flightsCurrentStep && (
        <MobileMultiRangeDatePicker
          selectedDates={flightDepartureDates}
          selectedReturnDates={flightReturnDates}
          onDateSelection={onDepartureDateSelection}
          onReturnDateSelection={onReturnDateSelection}
          hasNoAvailableDates={false}
          onlyDeparture={onlyDeparture}
          fromPlaceholder={t("Departure")}
          toPlaceholder={onlyDeparture ? t("No return") : t("Return")}
          isReturnActive={isReturnActive}
          onSetReturnActive={onSetReturnActive}
          onClear={onClearDates}
          fromLabel={t("Departure")}
          toLabel={t("Destination")}
          dates={dates}
        />
      )}
    </FrontStepModal>
  );
};

export default FrontFlightsMobileSteps;
