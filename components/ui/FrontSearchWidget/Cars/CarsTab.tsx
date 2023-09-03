import React, { SyntheticEvent } from "react";

import {
  useGetParticularStepOpenHandler,
  useOnDatesClear,
  useSetRangeDatesWithTime,
  useOnCarsMinuteChange,
  useOnCarsHourChange,
  useOnCarsPickupLocationItemClick,
  useOnCarsDropoffLocationItemClick,
  useOnCarsDriverCountryChange,
  useOnCarsDriverAgeChange,
  useOnCarLocationClear,
  useOnCarsPickupTimeChange,
  useOnCarsDropoffTimeChange,
  useToggleCalendarClientSideState,
} from "../frontHooks";
import { FrontStepKeys, useFrontSearchContext } from "../FrontSearchStateContext";

import CarsTabContent from "./CarsTabContent";

import { getTimeString } from "components/ui/TimePicker/mobileTimePickerUtils";
import {
  ActiveLocationAutocomplete,
  CarsMobileStepsEnum,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import useEffectOnce from "hooks/useEffectOnce";

const CarsTab = ({
  onSearchClick,
  isMobile,
  shouldInitializeInputs,
  useDesktopStyle = true,
}: {
  onSearchClick: (e: SyntheticEvent) => void;
  isMobile: boolean;
  shouldInitializeInputs?: boolean;
  useDesktopStyle?: boolean;
}) => {
  const {
    dateFrom,
    dateTo,
    carPickupLocationId,
    carDropoffLocationId,
    carPickupLocationName,
    carDropoffLocationName,
    carTimes: { pickup, dropoff },
    carDriverAge,
    carDriverCountry,
    isDesktopCalendarOpen,
    countryCode,
  } = useFrontSearchContext();

  const setRangeDatesWithTime = useSetRangeDatesWithTime();
  const onDatesClear = useOnDatesClear();
  const onCarsHourChange = useOnCarsHourChange();
  const onCarsMinuteChange = useOnCarsMinuteChange();
  const onCarsPickupTimeChange = useOnCarsPickupTimeChange();
  const onCarsDropoffTimeChange = useOnCarsDropoffTimeChange();
  const onPickupLocationItemSelect = useOnCarsPickupLocationItemClick();
  const onDropoffLocationItemSelect = useOnCarsDropoffLocationItemClick();
  const onCarDriverCountryChange = useOnCarsDriverCountryChange();
  const onCarDriverAgeChange = useOnCarsDriverAgeChange();
  const clearCarLocation = useOnCarLocationClear();
  const carsStepsController = useGetParticularStepOpenHandler<CarsMobileStepsEnum>(
    FrontStepKeys.carsCurrentStep
  );
  const onLocationInputClick = carsStepsController(CarsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Origin,
  });
  const onDropoffInputClick = carsStepsController(CarsMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Destination,
  });
  const onDateInputClick = carsStepsController(CarsMobileStepsEnum.Dates, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });

  const selectedDates = constructSelectedDatesFromQuery({
    dateFrom: dateFrom && `${dateFrom} ${getTimeString(pickup.hour, pickup.minute)}`,
    dateTo: dateTo && `${dateTo} ${getTimeString(dropoff.hour, dropoff.minute)}`,
    withTime: true,
  });

  useEffectOnce(() => {
    setRangeDatesWithTime(selectedDates);
  });

  const isAllDatesSelected = Boolean(selectedDates.from && selectedDates.to);
  const isAllLocationsSelected = Boolean(carPickupLocationId && carDropoffLocationId);

  const isCalendarOpen = useToggleCalendarClientSideState(
    !isAllDatesSelected && isAllLocationsSelected && useDesktopStyle
  );

  return (
    <CarsTabContent
      onSearchClick={onSearchClick}
      isMobile={isMobile}
      setRangeDatesWithTime={setRangeDatesWithTime}
      onDatesClear={onDatesClear}
      onCarsHourChange={onCarsHourChange}
      onCarsMinuteChange={onCarsMinuteChange}
      onCarsPickupTimeChange={onCarsPickupTimeChange}
      onCarsDropoffTimeChange={onCarsDropoffTimeChange}
      onPickupLocationItemSelect={onPickupLocationItemSelect}
      onDropoffLocationItemSelect={onDropoffLocationItemSelect}
      onLocationInputClick={onLocationInputClick}
      onDropoffLocationInputClick={onDropoffInputClick}
      onDateInputClick={onDateInputClick}
      selectedDates={selectedDates}
      carPickupLocationId={carPickupLocationId}
      carDropoffLocationId={carDropoffLocationId}
      pickup={pickup}
      dropoff={dropoff}
      onSetDriverAge={onCarDriverAgeChange}
      onSetDriverCountry={onCarDriverCountryChange}
      onClearCarLocation={clearCarLocation}
      driverAge={carDriverAge}
      driverCountry={carDriverCountry}
      isDesktopCalendarOpen={isDesktopCalendarOpen || isCalendarOpen}
      carPickupLocationName={carPickupLocationName}
      carDropoffLocationName={carDropoffLocationName}
      shouldInitializeInputs={shouldInitializeInputs}
      countryCode={countryCode}
      useDesktopStyle={useDesktopStyle}
    />
  );
};

export default CarsTab;
