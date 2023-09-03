import React, { SyntheticEvent, useMemo } from "react";

import {
  useToursLocationHooks,
  useSetNumberOfGuestsByType,
  useSetRangeDates,
  useSetSingleDate,
  useUpdateChildrenAges,
} from "components/ui/FrontSearchWidget/frontHooks";
import FrontStepModal from "components/ui/FrontSearchWidget/FrontStepModal";
import TravelerIcon from "components/icons/traveler.svg";
import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import {
  getSelectedDatesFromString,
  frontGuestGroups,
  getTripsMobileSteps,
} from "components/ui/FrontSearchWidget/utils/frontUtils";
import {
  TripsMobileStepsEnum,
  ActiveLocationAutocomplete,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { useSettings } from "contexts/SettingsContext";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import MobileStepLocationAndTravellers from "components/ui/MobileSteps/MobileStepLocationAndTravellers";

const FrontTripsMobileSteps = ({
  onModalClose,
  onSearchClick,
}: {
  onModalClose: () => void;
  onSearchClick: (e: SyntheticEvent) => void;
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { marketplace } = useSettings();
  const {
    tripsCurrentStep,
    dateFrom,
    dateTo,
    adults,
    childrenAges,
    tripStartingLocationItems,
    tripStartingLocationName,
    isSingleDate,
    tripsOpenedStep,
    activeLocationAutocomplete,
  } = useFrontSearchContext();
  const { onLocationInputChange, onLocationItemClick } = useToursLocationHooks(marketplace);
  const setNumberOfGuests = useSetNumberOfGuestsByType();
  const setRangeDates = useSetRangeDates();
  const setSingleDate = useSetSingleDate();
  const updateChildrenAges = useUpdateChildrenAges();
  const selectedDates = getSelectedDatesFromString({ dateFrom, dateTo });
  const numberOfGuests = useMemo(
    () => ({
      adults,
      children: childrenAges,
    }),
    [adults, childrenAges]
  );
  const steps = useMemo(
    () => getTripsMobileSteps(tripsOpenedStep, dateFrom, dateTo, tripStartingLocationName),
    [tripsOpenedStep]
  );
  return (
    <FrontStepModal<TripsMobileStepsEnum>
      title="Trips"
      translationNamespace={Namespaces.tourSearchNs}
      Icon={TravelerIcon}
      onModalClose={onModalClose}
      onSearchClick={onSearchClick}
      stepKey={FrontStepKeys.tripsCurrentStep}
      datesStep={TripsMobileStepsEnum.Dates}
      steps={steps}
      tooltipErrorMessage={
        !tripStartingLocationName
          ? commonSearchT("Please fill in your search information")
          : undefined
      }
    >
      {TripsMobileStepsEnum.Details === tripsCurrentStep && (
        <MobileStepLocationAndTravellers
          startingLocationItems={tripStartingLocationItems}
          onInputChange={onLocationInputChange}
          onItemClick={onLocationItemClick}
          locationPlaceholder={tripStartingLocationName || t("Starting location")}
          locationLabel={t("Starting location")}
          namespace={Namespaces.tourSearchNs}
          numberOfGuests={numberOfGuests}
          onSetNumberOfGuests={setNumberOfGuests}
          updateChildrenAges={updateChildrenAges}
          guestGroups={frontGuestGroups}
          forceLocationFocus={activeLocationAutocomplete === ActiveLocationAutocomplete.Destination}
        />
      )}
      {TripsMobileStepsEnum.Dates === tripsCurrentStep && (
        <MobileStepDates
          selectedDates={{ from: selectedDates?.from, to: selectedDates?.to }}
          onDateSelection={isSingleDate ? setSingleDate : setRangeDates}
          color="action"
          fromPlaceholder={t("Starting date")}
          toPlaceholder={t("Final date")}
          fromLabel={t("From")}
          toLabel={t("To")}
          isSingleDate={isSingleDate}
        />
      )}
    </FrontStepModal>
  );
};

export default FrontTripsMobileSteps;
