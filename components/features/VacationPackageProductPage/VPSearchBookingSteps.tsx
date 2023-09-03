import React, { useContext, useMemo } from "react";

import FixedRangeDatePickerMobile from "../ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerMobile";
import FlightConstantContext from "../Flight/contexts/FlightConstantContext";

import { VPFlightStateContext } from "./contexts/VPFlightStateContext";
import { getMaxMinDate } from "./utils/vacationPackageUtils";
import { VPStateContext } from "./contexts/VPStateContext";
import { VPModalStateContext, VPStepsTypes } from "./contexts/VPModalStateContext";
import { VPActionCallbackContext } from "./contexts/VPActionStateContext";
import { VPStayStateContext } from "./contexts/VPStayStateContext";

import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import FlightLocationMobileStep from "components/ui/FlightSearchWidget/FlightLocationMobileStep";
import NewMobileRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewMobileRoomAndGuestPicker";

const VPSearchBookingSteps = ({
  isSadPathWithoutParams = false,
}: {
  isSadPathWithoutParams?: boolean;
}) => {
  const { minDate, maxDate } = useMemo(() => getMaxMinDate(), []);
  const { t } = useTranslation(Namespaces.vacationPackagesSearchN);
  const { selectedDates, vacationLength, unavailableDatesRange } = useContext(VPStateContext);
  const { currentStep } = useContext(VPModalStateContext);
  const { destination, destinationId } = useContext(FlightConstantContext);
  const activeLocale = useActiveLocale();
  const { origin } = useContext(VPFlightStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const {
    onVPOriginLocationChange,
    onVPDateSelection,
    onVPOccupanciesChange,
    onVPOccupanciesRoomsChange,
  } = useContext(VPActionCallbackContext);

  const startDate =
    selectedDates.from && getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDate =
    selectedDates.to && getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);

  const dates = useMemo(
    () => ({
      unavailableDates: [],
      unavailableDatesRange: unavailableDatesRange ?? [],
      min: minDate,
      max: maxDate,
    }),
    [maxDate, minDate, unavailableDatesRange]
  );

  return (
    <>
      {(currentStep === VPStepsTypes.Dates || isSadPathWithoutParams) && (
        <FixedRangeDatePickerMobile
          selectedDates={selectedDates}
          dates={dates}
          startDateString={startDate}
          endDateString={endDate}
          lengthOfTour={vacationLength}
          onDateSelection={onVPDateSelection}
          activeLocale={activeLocale}
          allowSelectDisabledPeriodsInDatesRange={false}
          fromPlaceholder={t("Start date")}
          toPlaceholder={t("End date")}
          fromLabel={t("Start")}
          toLabel={t("End")}
          allowClearDates={false}
        />
      )}
      {currentStep === VPStepsTypes.Location && (
        <FlightLocationMobileStep
          onOriginLocationChange={onVPOriginLocationChange}
          onDestinationLocationChange={onVPOriginLocationChange}
          defaultOrigin={origin}
          defaultDestination={destination || destinationId}
          defaultOriginId="europe"
          defaultDestinationId="europe"
          origin={origin}
          destination={destination}
          disableDestinationInput
          forceOriginFocus
        />
      )}
      {currentStep === VPStepsTypes.Travellers && (
        <NewMobileRoomAndGuestPicker
          occupancies={occupancies}
          onSetOccupancies={onVPOccupanciesChange}
          onSetRooms={onVPOccupanciesRoomsChange}
          namespace={Namespaces.vacationPackageNs}
        />
      )}
    </>
  );
};

export default VPSearchBookingSteps;
