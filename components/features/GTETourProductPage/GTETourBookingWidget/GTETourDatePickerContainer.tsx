import React, { memo, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import GTETourDayAvailabilityQuery from "../queries/GTETourDayAvailabilityQuery.graphql";

import { constructGTETourDates } from "./utils/gteTourBookingWidgetUtils";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { useOnDateSelection } from "./gteTourHooks";
import { GTETourDropdownType } from "./types/enums";

import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import DatePickerContent from "components/features/TourBookingWidget/DatePicker/DatePickerContent";
import useActiveLocale from "hooks/useActiveLocale";
import { getInitialMonth } from "components/ui/DatePicker/utils/datePickerUtils";
import {
  getShortMonthNumbericDateFormat,
  getFormattedDate,
  yearMonthDayFormat,
} from "utils/dateUtils";
import DatePickerLoading from "components/ui/DatePicker/DatePickerLoading";
import { noCacheHeaders } from "utils/apiUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { gutters } from "styles/variables";
import { DisplayValue, DropdownContainer, Wrapper } from "components/ui/Inputs/ContentDropdown";
import { CalendarIcon } from "components/features/ProductPage/BookingWidget/DatePicker/FixedRangeDatePickerDesktop";
import { mqMax } from "styles/base";

const StyledBookingWidgetRow = styled(BookingWidgetControlRow)(
  () => css`
    ${mqMax.large} {
      margin-bottom: ${gutters.small}px;
      padding: 0;
    }
  `
);

const StyledDatePickerContent = styled(DatePickerContent)(
  ({ theme }) => css`
    margin: 0;
    ${Wrapper} {
      margin-top: ${gutters.small / 2}px;
      padding-right: 0;
      padding-left: 0;
    }
    ${DisplayValue} {
      height: 45px;
      padding-right: ${gutters.small}px;
      padding-left: 10px;
      border-color: ${theme.colors.primary};
    }
    ${CalendarIcon} {
      fill: ${theme.colors.primary};
    }

    ${DropdownContainer} {
      top: 50px;
      border-color: ${theme.colors.primary};
    }
  `
);

const GTETourDatePickerContainer = ({
  lengthOfTour,
  onOpenStateChange,
  activeDropdown,
  productId,
  viewType = "dropdown",
  isMobileSteps = false,
  onDropdownDateInputClick,
}: {
  lengthOfTour: number;
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  productId?: string;
  isMobileSteps?: boolean;
  viewType?: "dropdown" | "calendar";
  onDropdownDateInputClick?: () => void;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { selectedDates, setContextState } = useGTETourBookingWidgetContext();
  const activeLocale = useActiveLocale();
  const onDateSelection = useOnDateSelection();

  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { data, loading, error } = useQuery<GTETourTypes.QueryTourDates>(
    GTETourDayAvailabilityQuery,
    {
      variables: { productCode: productId },
      context: {
        headers: noCacheHeaders,
      },
      skip: !productId,
      onCompleted: ({ toursAndTicketsAvailableDays }) => {
        const selectedDatesFrom = selectedDates.from;
        const isSelectedDateAvailable = selectedDatesFrom
          ? toursAndTicketsAvailableDays.availableDates?.some(
              (date: string) =>
                getFormattedDate(new Date(date), yearMonthDayFormat) ===
                getFormattedDate(selectedDatesFrom, yearMonthDayFormat)
            )
          : true;
        if (!isSelectedDateAvailable) {
          setContextState({
            selectedDates: { from: undefined, to: undefined },
          });
        }
        setContextState({
          areDatesLoading: false,
        });
      },
    }
  );

  useEffect(() => {
    if (error) {
      setContextState({
        areDatesLoading: false,
        isError: true,
      });
    }
  }, [setContextState, error]);
  if (loading) {
    return <DatePickerLoading />;
  }
  const dates = constructGTETourDates(data, error);
  const hasAvailableDates = dates.min || dates.max;
  const startDate =
    selectedDates.from &&
    hasAvailableDates &&
    getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDate =
    selectedDates.to &&
    hasAvailableDates &&
    getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);
  const initialMonth = selectedDates.from || getInitialMonth({ dates, fixedLength: lengthOfTour });
  if (viewType === "calendar") {
    return (
      <DatePickerContent
        onDateSelection={onDateSelection}
        dates={dates}
        lengthOfTour={lengthOfTour}
        selectedDates={selectedDates}
        startDate={startDate}
        endDate={endDate}
        activeLocale={activeLocale}
        initialMonth={initialMonth}
        isMobile
        hideInputLabel
      />
    );
  }
  return (
    <StyledBookingWidgetRow
      title={t("Travel dates")}
      isOpen={activeDropdown === GTETourDropdownType.DATES}
    >
      <StyledDatePickerContent
        onDateSelection={onDateSelection}
        dates={dates}
        lengthOfTour={lengthOfTour}
        selectedDates={selectedDates}
        startDate={startDate}
        endDate={endDate}
        activeLocale={activeLocale}
        initialMonth={initialMonth}
        isMobile={false}
        onOpenStateChange={onOpenStateChange}
        hideInputLabel
        onDateInputClick={onDropdownDateInputClick}
        canOpenDropdown={viewType === "dropdown" && isMobileSteps ? false : undefined}
      />
    </StyledBookingWidgetRow>
  );
};

export default memo(GTETourDatePickerContainer);
