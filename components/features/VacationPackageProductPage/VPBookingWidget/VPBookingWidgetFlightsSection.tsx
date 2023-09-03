import React, { useCallback, useContext, useRef } from "react";

import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { VPFlightStateContext } from "../contexts/VPFlightStateContext";
import { useOnFlightItinerarySelect } from "../VPFlightSection/vpFlightSectionHooks";
import { useOnToggleModal } from "../contexts/VPStateHooks";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPBookingWidgetFlightDropdownContent from "./VPBookingWidgetFlightDropdownContent";
import VPBookingWidgetFlightExtras from "./VPBookingWidgetFlightExtras";

import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import BookingWidgetDropdownFlightLocationPicker from "components/ui/BookingWidget/BookingWidgetDropdownFlightLocationPicker";
import { FlightFunnelType } from "types/enums";

const VPBookingWidgetFlightsSection = ({
  destinationName,
  destinationId,
  onOpenStateChange,
  activeDropdown,
}: {
  destinationName?: string;
  destinationId?: string;
  activeDropdown?: VPSearchWidgetTypes.activeDropdownType;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const originInputRef = useRef<VacationPackageTypes.originInputRef>(null);

  const {
    origin,
    originId,
    vacationIncludesFlight,
    cabinType,
    selectedFlight,
    flightsResults,
    flightSearchLoading,
    flightSearchError,
  } = useContext(VPFlightStateContext);
  const { onIncludeVPFlightsToggle, onVPFlightItinerarySelect } =
    useContext(VPActionCallbackContext);
  const { flightBaggageQueryError } = useOnFlightItinerarySelect();
  const selectedFlightId = selectedFlight?.id;
  const [, onFlightInfoClick] = useOnToggleModal(VPActiveModalTypes.InfoFlight, selectedFlight?.id);

  const isFlightSelectionDisabled = Boolean(
    !vacationIncludesFlight ||
      flightSearchLoading ||
      flightSearchError ||
      flightBaggageQueryError ||
      !selectedFlightId
  );

  const flightToggleTooltip = vacationPackageT("Please select your flight's origin to search");

  const cabinTypeString: { [cabinType: string]: string } = {
    M: "Economy included",
    W: "Premium Economy included",
    C: "Business class included",
    F: "First class included",
  };
  const isOpen = activeDropdown === "flight";
  const originInputToggle = useCallback(() => {
    if (originInputRef.current?.openDropdown && !selectedFlightId)
      originInputRef.current?.openDropdown();
  }, [selectedFlightId]);
  const handleFlightToggle = useCallback(
    (checked: boolean) => {
      if (!origin && !originId) {
        originInputToggle();
      } else {
        onIncludeVPFlightsToggle(checked);
      }
    },
    [onIncludeVPFlightsToggle, origin, originId, originInputToggle]
  );
  return (
    <>
      <BookingWidgetControlRow
        title={vacationPackageT("Flights")}
        subtitle={vacationIncludesFlight ? vacationPackageT(cabinTypeString[cabinType]) : undefined}
        onInfoClick={vacationIncludesFlight && selectedFlightId ? onFlightInfoClick : undefined}
        isChecked={vacationIncludesFlight}
        onToggleChange={handleFlightToggle}
        tooltipInfo={flightToggleTooltip}
        isTooltipVisible={!origin}
        isOpen={isOpen}
        alwaysUseThemeToggleColor
      >
        <BookingWidgetDropdownFlightLocationPicker
          isSelected={!isFlightSelectionDisabled}
          isDisabled={isFlightSelectionDisabled}
          destinationName={destinationName || destinationId}
          originName={origin}
          originId={originId}
          onOpenStateChange={onOpenStateChange}
          isOpen={isOpen && flightsResults.length > 0}
          autocompleteFunnel={FlightFunnelType.VACATION_PACKAGE}
          originInputRef={originInputRef}
        >
          <VPBookingWidgetFlightDropdownContent
            flightSearchResults={flightsResults}
            selectedFlightId={selectedFlightId}
            onItinerarySelect={onVPFlightItinerarySelect}
          />
        </BookingWidgetDropdownFlightLocationPicker>
      </BookingWidgetControlRow>
      {vacationIncludesFlight && <VPBookingWidgetFlightExtras isOnBookingWidget />}
    </>
  );
};

export default VPBookingWidgetFlightsSection;
