import React from "react";

import ButtonFilterSection from "./ButtonFilterSection";

import CalendarClockIcon from "components/icons/calendar-clock.svg";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterQueryParam } from "types/enums";

const DurationFilterSection = ({
  filters,
  resetPageOnFilterSelection,
  useSingleSelection,
}: {
  filters: SearchPageTypes.Filter[];
  resetPageOnFilterSelection?: boolean;
  useSingleSelection?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);

  return (
    <ButtonFilterSection
      title={t("Duration")}
      Icon={CalendarClockIcon}
      filters={filters}
      sectionId={FilterQueryParam.DURATION_IDS}
      resetPageOnFilterSelection={resetPageOnFilterSelection}
      useSingleSelection={useSingleSelection}
    />
  );
};

export default DurationFilterSection;
