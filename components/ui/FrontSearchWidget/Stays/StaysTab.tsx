import React, { SyntheticEvent, useMemo, useEffect } from "react";

import StaysTabContent from "./StaysTabContent";

import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import {
  useGetParticularStepOpenHandler,
  useOnDatesClear,
  useSetNumberOfGuests,
  useSetRangeDates,
  useUpdateChildrenAges,
  useSetRoomsNumber,
  useStaysLocationHooks,
  useSetOccupancies,
} from "components/ui/FrontSearchWidget/frontHooks";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import {
  StaysMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useSettings } from "contexts/SettingsContext";
import useStayDefaultLocations from "components/features/StaysSearch/useStayDefaultLocations";

const StaysTab = ({
  onSearchClick,
  isMobile,
  useDesktopStyle = true,
}: {
  onSearchClick: (e: SyntheticEvent) => void;
  isMobile: boolean;
  useDesktopStyle?: boolean;
}) => {
  const { marketplace } = useSettings();
  const {
    accommodationAddress,
    accommodationId,
    dateFrom,
    dateTo,
    adults,
    childrenAges,
    accommodationLocationItems,
    accommodationRooms,
    accommodationType,
    useNewGuestPicker,
    occupancies,
    setContextState,
  } = useFrontSearchContext();
  const { onLocationInputChange, onLocationItemClick } = useStaysLocationHooks(marketplace);
  const setRangeDates = useSetRangeDates();
  const onDatesClear = useOnDatesClear();
  const setNumberOfGuests = useSetNumberOfGuests();
  const updateChildrenAges = useUpdateChildrenAges();
  const setRoomsNumber = useSetRoomsNumber();
  const setOccupancies = useSetOccupancies();
  const staysStepsController = useGetParticularStepOpenHandler<StaysMobileStepsEnum>(
    FrontStepKeys.staysCurrentStep
  );
  const onLocationInputClick = staysStepsController(StaysMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Destination,
  });
  const onDateInputClick = staysStepsController(StaysMobileStepsEnum.Dates, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });
  const onGuestsInputClick = staysStepsController(StaysMobileStepsEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });
  const selectedDates = constructSelectedDatesFromQuery({
    dateFrom,
    dateTo,
  });
  const numberOfGuests = useMemo(
    () => ({
      adults,
      children: childrenAges,
    }),
    [adults, childrenAges]
  );
  const defaultLocationsList = useStayDefaultLocations({
    accommodationAddress,
    shouldSkip: accommodationLocationItems !== undefined,
  });

  useEffect(() => {
    if (defaultLocationsList && !accommodationLocationItems) {
      const defaultLocation = defaultLocationsList?.[0];
      setContextState({
        accommodationLocationItems: defaultLocationsList,
        accommodationId: accommodationId || defaultLocation?.id,
        accommodationAddress: accommodationId ? accommodationAddress : defaultLocation?.name,
      });
    }
  }, [
    defaultLocationsList,
    accommodationLocationItems,
    setContextState,
    accommodationId,
    accommodationAddress,
  ]);

  return (
    <StaysTabContent
      onSearchClick={onSearchClick}
      isMobile={isMobile}
      onSetNumberOfRooms={setRoomsNumber}
      selectedDates={selectedDates}
      numberOfGuests={numberOfGuests}
      onDateInputClick={onDateInputClick}
      onGuestsInputClick={onGuestsInputClick}
      onDatesClear={onDatesClear}
      onDateSelection={setRangeDates}
      onLocationInputChange={onLocationInputChange}
      onLocationItemClick={onLocationItemClick}
      updateChildrenAges={updateChildrenAges}
      locationItems={accommodationLocationItems}
      address={accommodationAddress}
      accommodationType={accommodationType}
      numberOfRooms={accommodationRooms}
      onLocationInputClick={onLocationInputClick}
      onSetNumberOfGuests={setNumberOfGuests}
      useDesktopStyle={useDesktopStyle}
      useNewGuestPicker={useNewGuestPicker}
      setOccupancies={setOccupancies}
      occupancies={occupancies}
    />
  );
};

export default StaysTab;
