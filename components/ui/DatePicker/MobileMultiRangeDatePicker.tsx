import React, { useState } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import Close from "@travelshift/ui/icons/close.svg";

import { DoubleLabel } from "../MobileSteps/AutocompleteModalHelpers";

import MultiDateRangePickerDisplay from "./MultiDateRangePickerDisplay";

import ToggleButton from "components/ui/Inputs/ToggleButton";
import { addDayToRange } from "components/ui/DatePicker/utils/datePickerUtils";
import MobileDatePickerHeader from "components/ui/DatePicker/MobileDatePickerHeader";
import MultiRangeDatePicker from "components/ui/DatePicker/MultiRangeDatePicker";
import { Trans, useTranslation } from "i18n";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import useActiveLocale from "hooks/useActiveLocale";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import { greyColor, borderRadiusSmall, gutters } from "styles/variables";
import { typographyCaption, typographySubtitle2 } from "styles/typography";

export const DisplayWrapper = styled.div`
  border: 1px solid ${rgba(greyColor, 0.5)};
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 40px;
`;

export const ClearWrapper = styled.div([
  typographyCaption,
  css`
    position: absolute;
    top: 8px;
    right: 0px;
    display: flex;
    align-items: center;
    color: ${greyColor};
  `,
]);

export const CloseStyled = styled(Close)`
  margin-left: 4px;
  width: 10px;
  height: 10px;
  fill: ${greyColor};
`;

export const StyledToggleButton = styled(ToggleButton)<{ checked: boolean }>(
  ({ theme, checked }) =>
    css`
      margin-top: ${gutters.small / 2}px;
      #mobileMultiDateToggleOnOption {
        color: ${theme.colors.primary};
      }
      #mobileMultiDateToggleOffOption {
        color: ${theme.colors.primary};
        letter-spacing: ${checked ? 0.4 : 0.1}px;
        ${!checked && typographySubtitle2};
      }
      label {
        background: ${theme.colors.primary};
      }
    `
);

export const ToggleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledMobileDatePickerHeader = styled(MobileDatePickerHeader)`
  height: 189px;
`;

const MobileMultiRangeDatePicker = ({
  selectedDates,
  selectedReturnDates,
  onDateSelection,
  onReturnDateSelection,
  color = "action",
  hasNoAvailableDates,
  onlyDeparture = false,
  fromPlaceholder,
  toPlaceholder,
  isReturnActive,
  onSetReturnActive,
  onClear,
  useRangeAsDefault = false,
  fromLabel,
  toLabel,
  dates = { unavailableDates: [], min: new Date() },
}: {
  selectedDates: SharedTypes.SelectedDates;
  selectedReturnDates: SharedTypes.SelectedDates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onReturnDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  color?: "action" | "primary";
  hasNoAvailableDates: boolean;
  onlyDeparture?: boolean;
  fromPlaceholder: string;
  toPlaceholder: string;
  isReturnActive: boolean;
  onSetReturnActive: (isReturnActive: boolean) => void;
  onClear?: () => void;
  useRangeAsDefault?: boolean;
  fromLabel: string;
  toLabel: string;
  dates?: SharedTypes.Dates;
}) => {
  const { t } = useTranslation();
  const activeLocale = useActiveLocale();
  const [useExactDates, setUseExactDates] = useState(!useRangeAsDefault);
  let startDate = "";
  if (selectedDates.from) {
    startDate = getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  }
  let endDate = "";
  if (selectedDates.to) {
    endDate = getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);
  }
  let startReturnDate = "";
  if (selectedReturnDates.from) {
    startReturnDate = getShortMonthNumbericDateFormat(selectedReturnDates.from, activeLocale);
  }
  let endReturnDate = "";
  if (selectedReturnDates.to) {
    endReturnDate = getShortMonthNumbericDateFormat(selectedReturnDates.to, activeLocale);
  }

  const onChangeUseExactDates = (isExactDates: boolean) => {
    setUseExactDates(isExactDates);
    onDateSelection({ from: undefined, to: undefined });
    onReturnDateSelection({ from: undefined, to: undefined });
    onSetReturnActive(false);
  };

  const onExactDateSelection = (day: Date) => {
    if (isReturnActive) {
      onReturnDateSelection({ from: day, to: undefined });
      onSetReturnActive(false);
    } else {
      onDateSelection({ from: day, to: undefined });
      if (!onlyDeparture) {
        onSetReturnActive(true);
      }
    }
  };
  const onDateRangeSelection = (newDates: SharedTypes.SelectedDates, isReturnDate: boolean) => {
    if (isReturnDate) {
      onReturnDateSelection(newDates);
      if (newDates.from && newDates.to) {
        onSetReturnActive(false);
      }
    } else {
      onDateSelection(newDates);
      if (newDates.from && newDates.to) {
        if (!onlyDeparture) {
          onSetReturnActive(true);
        }
      }
    }
  };

  const handleDayClick = (day: Date) => {
    if (useExactDates) {
      onExactDateSelection(day);
    } else if (isReturnActive) {
      onDateRangeSelection(addDayToRange(day, selectedReturnDates), true);
    } else {
      onDateRangeSelection(addDayToRange(day, selectedDates), false);
    }
  };
  const canClearDates = selectedDates.from || selectedDates.to;
  return (
    <>
      <StyledMobileDatePickerHeader activeLocale={activeLocale}>
        <MobileSectionHeading>
          <Trans>Select dates</Trans>
          {onClear && canClearDates && (
            <ClearWrapper onClick={onClear}>
              <Trans>Clear</Trans>
              <CloseStyled />
            </ClearWrapper>
          )}
        </MobileSectionHeading>
        <DoubleLabel leftLabel={fromLabel} rightLabel={toLabel} />
        <DisplayWrapper>
          <MultiDateRangePickerDisplay
            startDate={startDate}
            endDate={endDate}
            returnStartDate={startReturnDate}
            returnEndDate={endReturnDate}
            isReturnActive={isReturnActive}
            onDepartureClick={() => onSetReturnActive(false)}
            onReturnClick={() => onSetReturnActive(true)}
            fromPlaceholder={fromPlaceholder}
            toPlaceholder={toPlaceholder}
          />
        </DisplayWrapper>
        <ToggleWrapper>
          <StyledToggleButton
            checked={useExactDates}
            onChange={onChangeUseExactDates}
            offValue={t("Date range")}
            onValue={t("Exact dates")}
            id="mobileMultiDateToggle"
          />
        </ToggleWrapper>
      </StyledMobileDatePickerHeader>
      <MultiRangeDatePicker
        shouldScrollSelectedDateIntoView
        canChangeMonth={false}
        showWeekdays={false}
        numberOfMonths={24}
        selectedDates={selectedDates}
        initialMonth={new Date()}
        onDayClick={handleDayClick}
        hasNoAvailableDates={hasNoAvailableDates}
        dates={dates}
        color={color}
        onDayMouseEnter={() => {}}
        selectedReturnDates={selectedReturnDates}
        useExactDates={useExactDates}
      />
    </>
  );
};

export default MobileMultiRangeDatePicker;
