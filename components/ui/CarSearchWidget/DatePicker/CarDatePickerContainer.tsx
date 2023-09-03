import React, { useContext } from "react";

import CarSearchWidgetCallbackContext from "../contexts/CarSearchWidgetCallbackContext";
import CarSearchWidgetStateContext from "../contexts/CarSearchWidgetStateContext";

import { Namespaces } from "shared/namespaces";
import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import PickupInfoDesktop from "components/ui/DatePicker/PickupInfoDesktop";
import { useTranslation } from "i18n";
import {
  getInitialMonth,
  getAdjustedTime,
  getAvailableTime,
} from "components/ui/DatePicker/utils/datePickerUtils";
import SearchWidgetDatePicker from "components/ui/SearchWidget/SearchWidgetDatePicker";
import useEffectOnce from "hooks/useEffectOnce";

const CarDatePickerContainer = ({
  selectedDates,
  onDateInputClick,
  disabled,
  isMobile = false,
  className,
}: {
  selectedDates: SharedTypes.SelectedDates;
  onDateInputClick?: () => void;
  disabled?: boolean;
  isMobile?: boolean;
  className?: string;
}) => {
  const { onDateSelectionWithAdjustedTime, onSetHour, onSetMinute, onSetCalendarOpen } = useContext(
    CarSearchWidgetCallbackContext
  );
  const onCloseCalendar = () => onSetCalendarOpen(false);
  const {
    times: { pickup, dropoff },
    isCalendarOpen,
  } = useContext(CarSearchWidgetStateContext);
  const { t } = useTranslation(Namespaces.carSearchNs);
  const dates = { unavailableDates: [], min: new Date() };

  useEffectOnce(() => {
    const { hour, timeType } = getAdjustedTime(selectedDates, {
      pickup,
      dropoff,
    });
    onSetHour(hour, timeType);
  });

  const pickupAvailableTime = getAvailableTime(selectedDates.from);
  const dropoffAvailableTime = getAvailableTime(selectedDates.to);

  return isMobile ? (
    <MobileStepDates
      className={className}
      selectedDates={selectedDates}
      onDateSelection={onDateSelectionWithAdjustedTime}
      fromPlaceholder={t("Pick-up date")}
      toPlaceholder={t("Drop-off date")}
      fromLabel={t("Pick-up")}
      toLabel={t("Drop-off")}
    />
  ) : (
    <SearchWidgetDatePicker
      className={className}
      selectedDates={selectedDates}
      onDateSelection={onDateSelectionWithAdjustedTime}
      minDays={1}
      dates={dates}
      initialMonth={getInitialMonth({ dates })}
      numberOfMonths={2}
      preOpenCalendar={false}
      fromPlaceholder={t("Pick-up")}
      toPlaceholder={t("Drop-off")}
      directionOverflow="right"
      shouldDisplayArrowIcon={false}
      color="action"
      bottomContent={
        <PickupInfoDesktop
          onHourChange={onSetHour}
          onMinuteChange={onSetMinute}
          pickup={pickup}
          dropoff={dropoff}
          pickupAvailableTime={pickupAvailableTime}
          dropoffAvailableTime={dropoffAvailableTime}
        />
      }
      showTime
      allowSeparateSelection
      onDateInputClick={onDateInputClick}
      disabled={disabled}
      isOpen={isCalendarOpen}
      onClose={onCloseCalendar}
    />
  );
};

export default CarDatePickerContainer;
