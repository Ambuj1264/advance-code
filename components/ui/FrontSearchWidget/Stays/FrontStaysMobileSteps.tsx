import React, { SyntheticEvent, useMemo } from "react";

import {
  useStaysLocationHooks,
  useSetNumberOfGuests,
  useSetRangeDates,
  useSetRoomsNumber,
  useUpdateChildrenAges,
  useSetOccupancies,
} from "components/ui/FrontSearchWidget/frontHooks";
import FrontStepModal from "components/ui/FrontSearchWidget/FrontStepModal";
import HotelIcon from "components/icons/house-heart.svg";
import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import {
  getSelectedDatesFromString,
  getStaysMobileSteps,
} from "components/ui/FrontSearchWidget/utils/frontUtils";
import {
  StaysMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";
import MobileStepLocationAndGuests from "components/ui/MobileSteps/MobileStepLocationAndGuests";

const FrontStaysMobileSteps = ({
  onModalClose,
  onSearchClick,
}: {
  onModalClose: () => void;
  onSearchClick: (e: SyntheticEvent) => void;
}) => {
  const { marketplace } = useSettings();
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);

  const { t } = useTranslation(Namespaces.accommodationNs);
  const {
    staysCurrentStep,
    dateFrom,
    dateTo,
    adults,
    childrenAges,
    accommodationRooms,
    accommodationAddress,
    accommodationLocationItems,
    staysOpenedStep,
    activeLocationAutocomplete,
    occupancies,
    useNewGuestPicker,
  } = useFrontSearchContext();
  const { onLocationInputChange, onLocationItemClick } = useStaysLocationHooks(marketplace);
  const setRangeDates = useSetRangeDates();
  const updateChildrenAges = useUpdateChildrenAges();
  const setRoomsNumber = useSetRoomsNumber();
  const setOccupancies = useSetOccupancies();
  const setNumberOfGuests = useSetNumberOfGuests();
  const selectedDates = getSelectedDatesFromString({ dateFrom, dateTo });
  const numberOfGuests = useMemo(
    () => ({
      adults,
      children: childrenAges,
    }),
    [adults, childrenAges]
  );
  const steps = useMemo(
    () => getStaysMobileSteps(staysOpenedStep, dateFrom, dateTo, accommodationAddress),
    [staysOpenedStep]
  );
  const isFormValid = dateFrom && dateTo && accommodationAddress;

  return (
    <FrontStepModal<StaysMobileStepsEnum>
      title="Stays"
      translationNamespace={Namespaces.accommodationNs}
      Icon={HotelIcon}
      onModalClose={onModalClose}
      onSearchClick={onSearchClick}
      stepKey={FrontStepKeys.staysCurrentStep}
      datesStep={StaysMobileStepsEnum.Dates}
      steps={steps}
      tooltipErrorMessage={
        !isFormValid ? commonSearchT("Please fill in your search information") : undefined
      }
    >
      {StaysMobileStepsEnum.Details === staysCurrentStep && (
        <MobileStepLocationAndGuests
          startingLocationItems={accommodationLocationItems}
          locationPlaceholder={t("Location")}
          locationDefaultValue={accommodationAddress}
          onInputChange={onLocationInputChange}
          onItemClick={onLocationItemClick}
          locationLabel={t("Location")}
          numberOfGuests={numberOfGuests}
          onSetNumberOfGuests={setNumberOfGuests}
          onUpdateChildrenAges={updateChildrenAges}
          numberOfRooms={accommodationRooms}
          onSetNumberOfRooms={setRoomsNumber}
          forceLocationFocus={activeLocationAutocomplete === ActiveLocationAutocomplete.Destination}
          occupancies={occupancies}
          useNewGuestPicker={useNewGuestPicker}
          onSetOccupancies={setOccupancies}
        />
      )}
      {StaysMobileStepsEnum.Dates === staysCurrentStep && (
        <MobileStepDates
          selectedDates={{ from: selectedDates?.from, to: selectedDates?.to }}
          onDateSelection={setRangeDates}
          fromPlaceholder={t("Check in")}
          toPlaceholder={t("Check out")}
          fromLabel={t("Check-in")}
          toLabel={t("Check-out")}
          allowSameDateSelection={false}
        />
      )}
    </FrontStepModal>
  );
};

export default FrontStaysMobileSteps;
