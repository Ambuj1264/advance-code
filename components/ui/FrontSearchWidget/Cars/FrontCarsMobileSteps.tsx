import React, { SyntheticEvent, useMemo } from "react";

import {
  useSetRangeDatesWithTime,
  useOnCarsPickupLocationItemClick,
  useOnCarsDropoffLocationItemClick,
  useOnCarsPickupTimeChange,
  useOnCarsDropoffTimeChange,
  useOnCarsDriverAgeChange,
  useOnCarsDriverCountryChange,
} from "components/ui/FrontSearchWidget/frontHooks";
import FrontStepModal from "components/ui/FrontSearchWidget/FrontStepModal";
import { Namespaces } from "shared/namespaces";
import PickupInfoMobile from "components/ui/CarSearchWidget/PickupInfoMobile";
import CarIcon from "components/icons/car.svg";
import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import {
  getSelectedDatesFromString,
  getCarsMobileSteps,
} from "components/ui/FrontSearchWidget/utils/frontUtils";
import {
  CarsMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useTranslation } from "i18n";
import { getAvailableTime } from "components/ui/DatePicker/utils/datePickerUtils";

const FrontCarsMobileSteps = ({
  onModalClose,
  onSearchClick,
}: {
  onModalClose: () => void;
  onSearchClick: (e: SyntheticEvent) => void;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const {
    carsCurrentStep,
    dateFrom,
    dateTo,
    carPickupLocationId,
    carDropoffLocationId,
    carTimes,
    carDriverAge,
    carDriverCountry,
    carPickupLocationName,
    carDropoffLocationName,
    carsOpenedStep,
    activeLocationAutocomplete,
  } = useFrontSearchContext();
  const onPickupLocationItemSelect = useOnCarsPickupLocationItemClick();
  const onDropoffLocationItemSelect = useOnCarsDropoffLocationItemClick();
  const onPickupTimeChange = useOnCarsPickupTimeChange();
  const onDropoffTimeChange = useOnCarsDropoffTimeChange();
  const setRangeDatesWithTime = useSetRangeDatesWithTime();
  const selectedDates = getSelectedDatesFromString({ dateFrom, dateTo });
  const onCarsDriverAgeChange = useOnCarsDriverAgeChange();
  const onCarsDriverCountryChange = useOnCarsDriverCountryChange();
  const isFormValid = dateFrom && dateTo && carPickupLocationId && carDropoffLocationId;

  const pickupAvailableTime = selectedDates && getAvailableTime(selectedDates.from);
  const dropoffAvailableTime = selectedDates && getAvailableTime(selectedDates.to);
  const steps = useMemo(
    () =>
      getCarsMobileSteps(
        carsOpenedStep,
        dateFrom,
        dateTo,
        carPickupLocationName,
        carDropoffLocationName
      ),
    [carsOpenedStep]
  );
  return (
    <FrontStepModal<CarsMobileStepsEnum>
      title="Cars"
      Icon={CarIcon}
      onModalClose={onModalClose}
      onSearchClick={onSearchClick}
      stepKey={FrontStepKeys.carsCurrentStep}
      datesStep={CarsMobileStepsEnum.Dates}
      hideTitle={CarsMobileStepsEnum.Details === carsCurrentStep}
      translationNamespace={Namespaces.carSearchNs}
      steps={steps}
      tooltipErrorMessage={
        !isFormValid ? commonSearchT("Please fill in your search information") : undefined
      }
    >
      {CarsMobileStepsEnum.Details === carsCurrentStep && (
        <PickupInfoMobile
          times={carTimes}
          pickupName={carPickupLocationName}
          pickupId={carPickupLocationId}
          dropoffName={carDropoffLocationName}
          dropoffId={carDropoffLocationId}
          onPickupLocationChange={onPickupLocationItemSelect}
          onDropoffLocationChange={onDropoffLocationItemSelect}
          onPickupTimeChange={onPickupTimeChange}
          onDropoffTimeChange={onDropoffTimeChange}
          pickupAvailableTime={pickupAvailableTime}
          dropoffAvailableTime={dropoffAvailableTime}
          driverAge={carDriverAge}
          setDriverAge={onCarsDriverAgeChange}
          driverCountry={carDriverCountry}
          setDriverCountry={onCarsDriverCountryChange}
          forceFocusOrigin={activeLocationAutocomplete === ActiveLocationAutocomplete.Origin}
          forceFocusDestination={
            activeLocationAutocomplete === ActiveLocationAutocomplete.Destination
          }
        />
      )}
      {CarsMobileStepsEnum.Dates === carsCurrentStep && (
        <MobileStepDates
          selectedDates={{ from: selectedDates?.from, to: selectedDates?.to }}
          onDateSelection={setRangeDatesWithTime}
          fromPlaceholder={commonSearchT("Pick-up date")}
          toPlaceholder={commonSearchT("Drop-off date")}
          fromLabel={commonSearchT("Pick-up")}
          toLabel={commonSearchT("Drop-off")}
        />
      )}
    </FrontStepModal>
  );
};

export default FrontCarsMobileSteps;
