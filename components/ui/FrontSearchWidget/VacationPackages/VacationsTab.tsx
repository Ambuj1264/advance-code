import React, { useEffect } from "react";

import {
  useGetParticularStepOpenHandler,
  useOnClearVacationsDates,
  useOnVacationsDateSelection,
  useOnVacationsDestinationChange,
  useOnVacationsOriginChange,
  useOnSetOccupancies,
} from "../frontHooks";
import { FrontStepKeys, useFrontSearchContext } from "../FrontSearchStateContext";
import { VacationsMobileStepEnum, ActiveLocationAutocomplete } from "../utils/FrontEnums";

import VacationsTabContent from "./VacationsTabContent";

import { getVpIncludesFlight } from "utils/localStorageUtils";

const VacationsTab = ({
  isMobile,
  onSearchClick,
  useDesktopStyle = true,
}: {
  isMobile: boolean;
  onSearchClick: (e: React.SyntheticEvent) => void;
  useDesktopStyle?: boolean;
}) => {
  const {
    vacationDefaultOriginId,
    vacationDefaultOriginName,
    vacationDefaultDestinationId,
    vacationDefaultDestinationName,
    vacationDestinationName,
    vacationOriginName,
    vacationDates,
    occupancies,
    vacationIncludesFlight,
    vacationDestinationId,
    setContextState,
  } = useFrontSearchContext();

  useEffect(() => {
    // We need to set includes flight value here instead of setting value in context initialization to avoid problem with different state on SSR and client
    const lsVpIncludesFlight = getVpIncludesFlight();

    if (lsVpIncludesFlight !== null) {
      setContextState({
        vacationIncludesFlight: lsVpIncludesFlight,
      });
    }
  }, [setContextState]);

  const onOriginLocationChange = useOnVacationsOriginChange();
  const onDestinationLocationChange = useOnVacationsDestinationChange();

  const onDateSelection = useOnVacationsDateSelection();
  const onClearDates = useOnClearVacationsDates();

  const vacationsStepController = useGetParticularStepOpenHandler<VacationsMobileStepEnum>(
    FrontStepKeys.vacationsCurrentStep
  );
  const onOriginLocationInputClick = vacationsStepController(VacationsMobileStepEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Origin,
  });
  const onDestinationLocationInputClick = vacationsStepController(VacationsMobileStepEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.Destination,
  });
  const onDatesClick = vacationsStepController(VacationsMobileStepEnum.Dates, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });
  const onOccupanciesChange = useOnSetOccupancies();
  const onTravellersInputClick = vacationsStepController(VacationsMobileStepEnum.Details, {
    activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  });

  return (
    <VacationsTabContent
      onSearchClick={onSearchClick}
      isMobile={isMobile}
      defaultDestinationName={vacationDefaultDestinationName}
      defaultDestinationId={vacationDefaultDestinationId}
      destinationId={vacationDestinationId}
      defaultOriginName={vacationDefaultOriginName}
      defaultOriginId={vacationDefaultOriginId}
      onOriginLocationChange={onOriginLocationChange}
      onDestinationLocationChange={onDestinationLocationChange}
      selectedDates={vacationDates}
      onDateSelection={onDateSelection}
      onClearDates={onClearDates}
      occupancies={occupancies}
      onOccupanciesChange={onOccupanciesChange}
      onTravellersInputClick={onTravellersInputClick}
      onOriginLocationClick={onOriginLocationInputClick}
      onDestinationLocationClick={onDestinationLocationInputClick}
      destinationName={vacationDestinationName}
      originName={vacationOriginName}
      onDatesClick={onDatesClick}
      vacationIncludesFlight={vacationIncludesFlight}
      useDesktopStyle={useDesktopStyle}
    />
  );
};

export default VacationsTab;
