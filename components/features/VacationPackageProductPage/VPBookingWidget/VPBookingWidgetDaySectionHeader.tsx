import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { addDays } from "date-fns";

import { getSectionHeaderDate } from "./utils/vpBookingWidgetUtils";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import VPBookingWidgetSectionHeader from "components/ui/BookingWidget/BookingWidgetSectionHeader";
import { gutters } from "styles/variables";
import { isDomNodeValueTruncated } from "components/ui/utils/uiUtils";
import useOnResize from "hooks/useOnResize";
import useActiveLocale from "hooks/useActiveLocale";

const StyledVPBookingWidgetSectionHeader = styled(VPBookingWidgetSectionHeader)`
  padding-left: ${gutters.small * 2}px;
`;

const VPBookingWidgetDaySectionHeader = ({
  dayNumber,
  selectedDates,
  vpDay,
}: {
  dayNumber: number;
  selectedDates: SharedTypes.SelectedDates;
  vpDay: VacationPackageTypes.VacationPackageDay;
}) => {
  const activeLocale = useActiveLocale();
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const ref = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useOnResize(ref, entry => {
    if (entry?.[0]?.target) {
      setTruncated(isDomNodeValueTruncated(entry[0].target as HTMLElement));
    }
  });

  const dayTitlte = vacationPackageT("Day {dayNumber} in {region}", {
    dayNumber,
    region: vpDay.region,
  });

  return (
    <StyledVPBookingWidgetSectionHeader
      ref={ref}
      withTooltip={truncated}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      date={getSectionHeaderDate(addDays(selectedDates.from!, dayNumber - 1), activeLocale)}
    >
      {dayTitlte}
    </StyledVPBookingWidgetSectionHeader>
  );
};

export default VPBookingWidgetDaySectionHeader;
