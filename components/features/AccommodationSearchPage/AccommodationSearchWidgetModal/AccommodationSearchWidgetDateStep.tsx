import React, { useContext } from "react";

import {
  AccommodationSearchPageStateContext,
  AccommodationSearchPageCallbackContext,
} from "../AccommodationSearchPageStateContext";

import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const AccommodationSearchWidgetDateStep = () => {
  const { selectedDates } = useContext(AccommodationSearchPageStateContext);
  const { onDateSelection, onClearDates } = useContext(AccommodationSearchPageCallbackContext);
  const { t } = useTranslation(Namespaces.accommodationNs);
  return (
    <MobileStepDates
      selectedDates={selectedDates}
      onDateSelection={onDateSelection}
      onClear={onClearDates}
      fromPlaceholder={t("Check in")}
      toPlaceholder={t("Check out")}
      fromLabel={t("Check-in")}
      toLabel={t("Check-out")}
      allowSameDateSelection={false}
    />
  );
};

export default AccommodationSearchWidgetDateStep;
