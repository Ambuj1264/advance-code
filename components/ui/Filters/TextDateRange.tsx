import React, { ReactNode, useContext } from "react";

import { constructSelectedDatesFromQuery } from "components/ui/DatePicker/utils/datePickerUtils";
import LocaleContext from "contexts/LocaleContext";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";

const TextDateRange = ({
  children,
  dateFrom,
  dateTo,
  withTime = false,
}: {
  children: ReactNode;
  dateFrom?: string;
  dateTo?: string;
  withTime?: boolean;
}): JSX.Element => {
  const activeLocale = useContext(LocaleContext);

  const selectedDates = constructSelectedDatesFromQuery({
    dateFrom,
    dateTo,
    withTime,
  });
  const startDateShort =
    selectedDates?.from && getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDateShort =
    selectedDates?.to && getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);

  const hasDatesSet = Boolean(startDateShort || endDateShort);

  if (!hasDatesSet) {
    return children as JSX.Element;
  }

  const isBothDatesSet = Boolean(startDateShort && endDateShort);
  const dateRange = isBothDatesSet
    ? `${startDateShort} - ${endDateShort}`
    : `${startDateShort}${endDateShort ? `- ${endDateShort}` : ""}`;

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{dateRange}</>;
};

export default TextDateRange;
