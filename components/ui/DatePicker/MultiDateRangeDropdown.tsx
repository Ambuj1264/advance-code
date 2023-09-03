import React, { SyntheticEvent, useCallback, useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import MultiDateRangePickerDisplay from "./MultiDateRangePickerDisplay";
import MultiRangeDatePicker from "./MultiRangeDatePicker";
import { DateModifiers } from "./CommonDatePicker";

import ToggleButton from "components/ui/Inputs/ToggleButton";
import ContentDropdown, {
  ArrowIcon,
  DisplayValue,
  DropdownContentWrapper,
  DropdownContainer,
} from "components/ui/Inputs/ContentDropdown";
import {
  DateRangeEnum,
  constructDaysRange,
  getRangePickerHoverRange,
} from "components/ui/DatePicker/utils/datePickerUtils";
import useToggle from "hooks/useToggle";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import LocaleContext from "contexts/LocaleContext";
import { mqMin } from "styles/base";
import { gutters, greyColor, borderRadiusSmall, whiteColor } from "styles/variables";
import { useTranslation } from "i18n";

const BottomContent = styled.div(
  ({ theme }) => css`
    position: relative;
    display: flex;
    margin: 14px -17px -17px -17px;
    border-radius: 0 0 4px 4px;
    padding: ${gutters.large / 2}px ${gutters.small}px;
    background-color: ${theme.colors.primary};
  `
);

const ContentDropdownStyled = styled(ContentDropdown)`
  margin: 0;
  border: 1px solid ${rgba(greyColor, 0.5)};
  border-radius: ${borderRadiusSmall};
  padding-right: 0px;
  padding-left: 0px;
  background-color: ${whiteColor};
  user-select: none;
  ${mqMin.large} {
    padding-right: ${gutters.small}px;
    padding-left: ${gutters.small}px;
  }
  ${DropdownContentWrapper} {
    ${mqMin.large} {
      padding: ${gutters.small}px;
    }
  }
  ${DropdownContainer} {
    right: auto;
    left: -${gutters.large}px;
  }

  ${DisplayValue} {
    position: relative;
    margin: 0;
    border: none;
    height: 38px;
    padding: 0;
    background: none;
    ${mqMin.large} {
      height: 48px;
    }
  }
  ${ArrowIcon} {
    position: absolute;
    right: ${gutters.small}px;
    ${mqMin.large} {
      right: 0;
    }
  }
`;

const DisplayWrapper = styled.div`
  margin-left: 0;
  width: 100%;
  height: 100%;
`;

const MultiDateRangeDropdown = ({
  id = "",
  informationLabel,
  fromPlaceholder = "",
  toPlaceholder = "",
  inputLabel,
  selectedDates,
  onDateSelection,
  onDateInputClick,
  dates,
  initialMonth,
  numberOfMonths = 1,
  directionOverflow,
  disabled,
  color,
  hasNoAvailableDates = false,
  selectedReturnDates,
  onReturnDateSelection,
  isReturnActive = false,
  setReturnActive,
  onlyDeparture = false,
  onClear,
  useRangeAsDefault = false,
  isOpen = false,
  className,
}: {
  id?: string;
  informationLabel?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  inputLabel?: string;
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onDateInputClick?: (e: SyntheticEvent, type?: DateRangeEnum) => void;
  dates: SharedTypes.Dates;
  initialMonth?: Date;
  numberOfMonths?: number;
  directionOverflow?: "right" | "left";
  disabled?: boolean;
  color?: "action" | "primary";
  hasNoAvailableDates?: boolean;
  selectedReturnDates: SharedTypes.SelectedDates;
  onReturnDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  isReturnActive: boolean;
  setReturnActive: (isReturnActive: boolean) => void;
  onlyDeparture?: boolean;
  onClear?: (e: SyntheticEvent<SVGElement>) => void;
  useRangeAsDefault?: boolean;
  isOpen?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation();
  const activeLocale = useContext(LocaleContext);

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
  const [useExactDates, setUseExactDates] = useState(!useRangeAsDefault);
  const [isCalendarOpen, toggleCalendar] = useToggle(false);
  const [activeDateInput, setActiveDateInput] = useState<DateRangeEnum>(DateRangeEnum.inactive);
  const [dateMouseEntered, setDateMouseEntered] = useState<Date | undefined>(undefined);
  const prevActiveDateInput = usePreviousState(activeDateInput);
  const getClickHandler = useCallback(
    (value: DateRangeEnum) => {
      return (e: SyntheticEvent) => {
        onDateInputClick?.(e, value);
      };
    },
    [onDateInputClick]
  );

  const onChangeUseExactDates = (isExactDates: boolean) => {
    setUseExactDates(isExactDates);
    onDateSelection({ from: undefined, to: undefined });
    onReturnDateSelection({ from: undefined, to: undefined });
    setReturnActive(false);
    setActiveDateInput(DateRangeEnum.onFromActive);
  };

  const onExactDateSelection = (day: Date) => {
    if (isReturnActive) {
      onReturnDateSelection({ from: day, to: undefined });
      toggleCalendar();
      setReturnActive(false);
      setActiveDateInput(DateRangeEnum.inactive);
    } else {
      onDateSelection({ from: day, to: undefined });
      if (!onlyDeparture) {
        setReturnActive(true);
      }
    }
  };

  const onDateRangeSelection = (newDates: SharedTypes.SelectedDates, isReturnDate: boolean) => {
    if (isReturnDate) {
      onReturnDateSelection(newDates);
      if (newDates.from) {
        if (newDates.to) {
          toggleCalendar();
          setReturnActive(false);
          setActiveDateInput(DateRangeEnum.inactive);
        } else {
          setActiveDateInput(DateRangeEnum.onToActive);
        }
      }
    } else {
      onDateSelection(newDates);
      if (newDates.from) {
        if (newDates.to) {
          if (onlyDeparture) {
            toggleCalendar();
            setActiveDateInput(DateRangeEnum.inactive);
          } else {
            setActiveDateInput(DateRangeEnum.onFromActive);
            setReturnActive(true);
          }
        } else {
          setActiveDateInput(DateRangeEnum.onToActive);
        }
      }
    }
  };

  const handleDayClick = (day: Date) => {
    if (useExactDates) {
      onExactDateSelection(day);
    } else if (isReturnActive) {
      onDateRangeSelection(constructDaysRange(day, selectedReturnDates, activeDateInput), true);
    } else {
      onDateRangeSelection(constructDaysRange(day, selectedDates, activeDateInput), false);
    }
  };
  const handleDayMouseEnter = (day: Date, modifiers: DateModifiers) => {
    if (!modifiers.disabled) {
      setDateMouseEntered(day);
    }
  };
  const toActive =
    (isReturnActive && selectedReturnDates.from && !selectedReturnDates.to) ||
    (!isReturnActive && selectedDates.from && !selectedDates.to && !onlyDeparture);
  const canClearDates = Boolean(selectedDates.from || selectedReturnDates.from);

  useEffect(() => {
    // this allows parent component to control the state of the initial calendar open state
    if (isOpen && isCalendarOpen === false) {
      toggleCalendar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ContentDropdownStyled
      id={`multiDateRangePicker${id}`}
      className={className}
      directionOverflow={directionOverflow}
      displayValue={
        <DisplayWrapper
          key={`${id}Display`}
          onClick={getClickHandler(
            toActive ? DateRangeEnum.onToActive : DateRangeEnum.onFromActive
          )}
        >
          <MultiDateRangePickerDisplay
            startDate={startDate}
            endDate={endDate}
            returnStartDate={startReturnDate}
            returnEndDate={endReturnDate}
            isReturnActive={isReturnActive}
            isCalendarOpen={isCalendarOpen}
            onDepartureClick={() => {
              setReturnActive(false);
              if (selectedDates.from && !selectedDates.to && !useExactDates) {
                setActiveDateInput(DateRangeEnum.onToActive);
              } else {
                setActiveDateInput(DateRangeEnum.onFromActive);
              }
            }}
            onReturnClick={() => {
              setReturnActive(true);
              if (selectedReturnDates.from && !selectedReturnDates.to && !useExactDates) {
                setActiveDateInput(DateRangeEnum.onToActive);
              } else {
                setActiveDateInput(DateRangeEnum.onFromActive);
              }
            }}
            fromPlaceholder={fromPlaceholder}
            toPlaceholder={toPlaceholder}
            onClear={e => {
              if (canClearDates && onClear) {
                onClear(e);
                setReturnActive(false);
                if (isCalendarOpen) {
                  setActiveDateInput(DateRangeEnum.onFromActive);
                } else {
                  setActiveDateInput(DateRangeEnum.inactive);
                }
              }
            }}
          />
        </DisplayWrapper>
      }
      inputLabel={inputLabel}
      isContentOpen={isCalendarOpen}
      toggleContent={() => {
        if (disabled) return;
        if (!isCalendarOpen || activeDateInput === prevActiveDateInput) {
          toggleCalendar();
        }
      }}
      information={informationLabel}
      onOutsideClick={() => {
        if (!isCalendarOpen) return;
        toggleCalendar();
        setActiveDateInput(DateRangeEnum.inactive);
      }}
      shouldDisplayArrowIcon={false}
    >
      <MultiRangeDatePicker
        canChangeMonth
        numberOfMonths={numberOfMonths}
        selectedDates={selectedDates}
        initialMonth={initialMonth}
        onDayClick={handleDayClick}
        hasNoAvailableDates={hasNoAvailableDates}
        dates={dates}
        color={color}
        onDayMouseEnter={handleDayMouseEnter}
        selectedReturnDates={selectedReturnDates}
        useExactDates={useExactDates}
        hoverRange={getRangePickerHoverRange({
          selectedDates: isReturnActive ? selectedReturnDates : selectedDates,
          dateMouseEntered,
          activeInputType: activeDateInput,
        })}
      />
      <BottomContent>
        <ToggleButton
          checked={useExactDates}
          onChange={onChangeUseExactDates}
          offValue={t("Date range")}
          onValue={t("Exact dates")}
          id="multiDateToggle"
          reverse
        />
      </BottomContent>
    </ContentDropdownStyled>
  );
};

export default MultiDateRangeDropdown;
