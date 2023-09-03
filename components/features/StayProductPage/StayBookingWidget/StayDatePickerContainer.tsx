import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useMediaQuery } from "react-responsive";

import { useStayBookingWidgetContext } from "./StayBookingWidgetStateContext";
import { useOnDateSelection } from "./stayHooks";
import useMonolithStayCalendarDates from "./useMonolithStayCalendarDates";
import { getCartItemIdFromQuery } from "./utils/cartUtils";

import { gutters, breakpointsMax } from "styles/variables";
import BookingWidgetDateRangeDropdown from "components/ui/BookingWidget/BookingWidgetDateRangeDropdown";
import { DisplayValue, DropdownContainer } from "components/ui/Inputs/ContentDropdown";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getInitialMonth } from "components/ui/DatePicker/utils/datePickerUtils";
import DatePickerLoading from "components/ui/DatePicker/DatePickerLoading";
import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import { DoubleLabel } from "components/ui/MobileSteps/AutocompleteModalHelpers";

const StyledDoubleLabel = styled(DoubleLabel)`
  margin-left: ${gutters.large}px;
`;

const StyledBookingWidgetDateRangeDropdown = styled(BookingWidgetDateRangeDropdown)(
  ({ theme }) => css`
    margin-top: 0;
    ${DisplayValue} {
      border-color: ${theme.colors.primary};
    }
    ${DropdownContainer} {
      top: 50px;
    }
  `
);

const StayDatePickerContainer = () => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const cartItemId = useMemo(getCartItemIdFromQuery, []);
  const { t } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  const { t: accomodationT } = useTranslation(Namespaces.accommodationNs);
  const { selectedDates, minDays } = useStayBookingWidgetContext();
  const onDateSelection = useOnDateSelection();
  const { loading, dates } = useMonolithStayCalendarDates({
    selectedDates,
    onDateSelection,
  });
  if (loading) {
    return <DatePickerLoading />;
  }
  const informationLabel =
    minDays > 1
      ? t("Minimum of {minDays} days to book this accommodation", {
          minDays,
        })
      : undefined;
  const initialMonth = selectedDates.from || getInitialMonth({ dates });
  return isMobile ? (
    <MobileStepDates
      selectedDates={selectedDates}
      onDateSelection={onDateSelection}
      dates={dates}
      fromPlaceholder={t("Check in")}
      toPlaceholder={t("Check out")}
      fromLabel={t("Check-in")}
      toLabel={t("Check-out")}
      allowSameDateSelection={false}
    />
  ) : (
    <>
      <StyledDoubleLabel leftLabel={t("Dates")} />
      <StyledBookingWidgetDateRangeDropdown
        selectedDates={selectedDates}
        onDateSelection={onDateSelection}
        dates={dates}
        initialMonth={initialMonth}
        preOpenCalendar={!cartItemId && (!selectedDates.from || !selectedDates.to)}
        fromPlaceholder={accomodationT("Check in")}
        toPlaceholder={accomodationT("Check out")}
        hasNoAvailableDates={false}
        allowSeparateSelection
        minDays={minDays}
        informationLabel={informationLabel}
        allowSameDateSelection={false}
      />
    </>
  );
};

export default StayDatePickerContainer;
