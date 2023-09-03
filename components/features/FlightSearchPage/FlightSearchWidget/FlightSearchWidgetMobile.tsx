import React, { SyntheticEvent, useContext, useCallback, useState } from "react";

import FlightSearchPageStateContext from "../contexts/FlightSearchPageStateContext";
import FlightSearchPageCallbackContext from "../contexts/FlightSearchPageCallbackContext";
import FlightSearchPageConstantContext from "../contexts/FlightSearchPageConstantContext";
import { getFlightMinMaxDates } from "../utils/flightSearchUtils";

import { StepsEnum } from "./enums";

import FlightTravelDetailsStep from "components/ui/FlightSearchWidget/FlightTravelDetailsStep";
import SearchWidgetMobile from "components/ui/SearchWidget/SearchWidgetMobile";
import SearchWidgetFooterMobile from "components/ui/SearchWidget/SearchWidgetFooterMobile";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import MobileMultiRangeDatePicker from "components/ui/DatePicker/MobileMultiRangeDatePicker";

const FlightSearchWidgetMobile = ({
  onPreviousClick,
  onModalClose,
  searchWidgetView,
  onFooterButtonClick,
  showBackButtonOnFirstStep = false,
  errorMessage,
}: {
  onPreviousClick: () => void;
  onModalClose: () => void;
  searchWidgetView: StepsEnum;
  onFooterButtonClick: (e: SyntheticEvent) => void;
  showBackButtonOnFirstStep?: boolean;
  errorMessage?: string;
}) => {
  const { t } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { t: flightT } = useTranslation(Namespaces.flightSearchNs);
  const isDatesView = searchWidgetView === StepsEnum.Dates;
  const [isReturnActive, setReturnActive] = useState(false);
  const dates = getFlightMinMaxDates();
  const {
    passengers,
    cabinType,
    selectedDepartureDates,
    selectedReturnDates,
    flightType,
    originName,
    destinationName,
  } = useContext(FlightSearchPageStateContext);

  const {
    onNumberOfPassengersChange,
    onCabinTypeChange,
    onOriginLocationChange,
    onDestinationLocationChange,
    onDepartureDateSelection,
    onReturnDateSelection,
    onFlightTypeChange,
  } = useContext(FlightSearchPageCallbackContext);
  const {
    defaultOrigin,
    defaultOriginId,
    defaultDestination,
    defaultDestinationId,
    rangeAsDefault,
  } = useContext(FlightSearchPageConstantContext);
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
  return (
    <SearchWidgetMobile
      onPreviousClick={onPreviousClick}
      onModalClose={onModalClose}
      showBackButton={!(searchWidgetView === StepsEnum.Details && !showBackButtonOnFirstStep)}
      currentStep={searchWidgetView}
      footer={
        <SearchWidgetFooterMobile
          onButtonClick={onFooterButtonClick}
          tooltipErrorMessage={searchWidgetView === StepsEnum.Dates ? errorMessage : undefined}
          buttonCallToAction={isDatesView ? commonSearchT("Search") : t("Continue")}
        />
      }
    >
      {searchWidgetView === StepsEnum.Dates && (
        <MobileMultiRangeDatePicker
          selectedDates={selectedDepartureDates}
          selectedReturnDates={selectedReturnDates}
          onDateSelection={onDepartureDateSelection}
          onReturnDateSelection={onReturnDateSelection}
          hasNoAvailableDates={false}
          onlyDeparture={onlyDeparture}
          fromPlaceholder={flightT("Departure")}
          toPlaceholder={onlyDeparture ? flightT("No return") : flightT("Return")}
          isReturnActive={isReturnActive}
          onSetReturnActive={onSetReturnActive}
          onClear={() => {
            onDepartureDateSelection({ from: undefined, to: undefined });
            onReturnDateSelection({ from: undefined, to: undefined });
          }}
          useRangeAsDefault={rangeAsDefault}
          fromLabel={flightT("Departure")}
          toLabel={flightT("Destination")}
          dates={dates}
        />
      )}
      {searchWidgetView === StepsEnum.Details && (
        <FlightTravelDetailsStep
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          defaultOrigin={defaultOrigin}
          defaultOriginId={defaultOriginId}
          defaultDestination={defaultDestination}
          defaultDestinationId={defaultDestinationId}
          origin={originName}
          destination={destinationName}
          passengers={passengers}
          onNumberOfPassengersChange={onNumberOfPassengersChange}
          cabinType={cabinType}
          onCabinTypeChange={onCabinTypeChange}
          flightType={flightType}
          onFlightTypeChange={onFlightTypeChange}
        />
      )}
    </SearchWidgetMobile>
  );
};

export default FlightSearchWidgetMobile;
