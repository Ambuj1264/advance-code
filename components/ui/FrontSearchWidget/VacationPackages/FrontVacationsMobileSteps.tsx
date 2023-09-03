import React, { useCallback, useMemo } from "react";

import {
  useOnVacationsDateSelection,
  useOnVacationsDestinationChange,
  useOnVacationsOriginChange,
  useOnSetOccupancies,
} from "../frontHooks";
import { FrontStepKeys, useFrontSearchContext } from "../FrontSearchStateContext";
import { VacationsMobileStepEnum, ActiveLocationAutocomplete } from "../utils/FrontEnums";
import FrontStepModal from "../FrontStepModal";
import MobileStepDates from "../../MobileSteps/MobileStepDates";
import { getVPMobileSteps } from "../utils/frontUtils";

import { getFlightMinMaxDates } from "components/features/FlightSearchPage/utils/flightSearchUtils";
import VacationIcon from "components/icons/vacation-widget-icon.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { setVpIncludesFlight } from "utils/localStorageUtils";
import VacationTravelDetailsMobileSteps from "components/ui/VacationPackageSearchWidget/VacationTravelDetailsMobileStep";

const FrontVacationsMobileSteps = ({
  onModalClose,
  onSearchClick,
  isSearchResults = false,
}: {
  onModalClose: () => void;
  onSearchClick: (e: React.SyntheticEvent) => void;
  isSearchResults?: boolean;
}) => {
  const {
    vacationsCurrentStep,
    vacationDefaultOriginId,
    vacationDefaultOriginName,
    vacationDefaultDestinationId,
    vacationDefaultDestinationName,
    vacationDates,
    vacationDestinationName,
    vacationOriginName,
    vacationIncludesFlight,
    occupancies,
    vpOpenedStep,
    activeLocationAutocomplete,
    setContextState,
  } = useFrontSearchContext();
  const dates = getFlightMinMaxDates();
  const { t } = useTranslation(Namespaces.vacationPackagesSearchN);
  const onOriginLocationChange = useOnVacationsOriginChange();
  const onDestinationLocationChange = useOnVacationsDestinationChange();
  const onDateSelection = useOnVacationsDateSelection();
  const onOccupanciesChange = useOnSetOccupancies();
  const toggleVacationIncludesFlight = useCallback(() => {
    setVpIncludesFlight(vacationIncludesFlight);

    setContextState({
      vacationIncludesFlight: !vacationIncludesFlight,
      ...(vacationIncludesFlight === false
        ? {
            vacationOriginId: undefined,
            vacationOriginName: undefined,
            vacationDefaultOriginId: undefined,
            vacationDefaultOriginName: undefined,
          }
        : {}),
    });
  }, [setContextState, vacationIncludesFlight]);

  const isFormValid =
    vacationDates.from &&
    vacationDates.to &&
    (vacationIncludesFlight
      ? vacationOriginName && vacationDestinationName
      : vacationDestinationName);
  const steps = useMemo(
    () =>
      getVPMobileSteps(
        isSearchResults,
        vpOpenedStep,
        vacationIncludesFlight,
        vacationDates,
        vacationOriginName,
        vacationDestinationName
      ),
    [vpOpenedStep]
  );
  return (
    <FrontStepModal<VacationsMobileStepEnum>
      title="Vacations"
      translationNamespace={Namespaces.vacationPackagesSearchN}
      Icon={VacationIcon}
      onModalClose={onModalClose}
      onSearchClick={onSearchClick}
      stepKey={FrontStepKeys.vacationsCurrentStep}
      datesStep={VacationsMobileStepEnum.Dates}
      selectedDatesOverride={vacationDates}
      steps={steps}
      tooltipErrorMessage={!isFormValid ? t("Please fill in your search information") : undefined}
    >
      {VacationsMobileStepEnum.Details === vacationsCurrentStep && (
        <VacationTravelDetailsMobileSteps
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          origin={vacationOriginName}
          destination={vacationDestinationName}
          defaultOrigin={vacationDefaultOriginName}
          defaultOriginId={vacationDefaultOriginId}
          defaultDestination={vacationDefaultDestinationName}
          defaultDestinationId={vacationDefaultDestinationId}
          toggleVacationIncludesFlight={toggleVacationIncludesFlight}
          vacationIncludesFlight={vacationIncludesFlight}
          occupancies={occupancies}
          onOccupanciesChange={onOccupanciesChange}
          forceOriginFocus={activeLocationAutocomplete === ActiveLocationAutocomplete.Origin}
          forceDestinationFocus={
            activeLocationAutocomplete === ActiveLocationAutocomplete.Destination
          }
        />
      )}
      {VacationsMobileStepEnum.Dates === vacationsCurrentStep && (
        <MobileStepDates
          selectedDates={vacationDates}
          onDateSelection={onDateSelection}
          dates={dates}
          color="action"
          fromPlaceholder={t("Start date")}
          toPlaceholder={t("End date")}
          fromLabel={t("Start")}
          toLabel={t("End")}
        />
      )}
    </FrontStepModal>
  );
};

export default FrontVacationsMobileSteps;
