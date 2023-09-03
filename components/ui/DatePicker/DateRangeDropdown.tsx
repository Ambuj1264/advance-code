import React, {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { addDays } from "date-fns";
import styled from "@emotion/styled";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import ContentDropdown, {
  ArrowIcon,
  DisplayValue,
  DropdownContentWrapper,
} from "components/ui/Inputs/ContentDropdown";
import CalendarDropdownDisplay from "components/ui/DatePicker/CalendarDropdownDisplay";
import { bothDaysSet, DateRangeEnum } from "components/ui/DatePicker/utils/datePickerUtils";
import useToggle from "hooks/useToggle";
import { getFormattedDateWithTime, getShortMonthNumbericDateFormat } from "utils/dateUtils";
import DateRangePicker from "components/ui/DatePicker/DateRangePicker";
import LocaleContext from "contexts/LocaleContext";
import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const ContentDropdownStyled = styled(ContentDropdown)`
  padding: 0;
  user-select: none;

  ${DropdownContentWrapper} {
    padding: ${gutters.small / 2}px;

    ${mqMin.large} {
      padding: ${gutters.small}px;
    }
  }

  ${DisplayValue} {
    position: relative;
    padding: 0;
  }

  ${ArrowIcon} {
    position: absolute;
    right: ${gutters.small}px;
  }
`;

const BottomContent = styled.div`
  position: relative;
`;

const DateRangeDropdown = ({
  id = "",
  className,
  informationLabel,
  fromPlaceholder = "",
  toPlaceholder = "",
  inputLabel,
  selectedDates,
  onDateSelection,
  onDateInputClick,
  dates,
  initialMonth,
  minDays = 1,
  preOpenCalendar,
  allowSeparateSelection,
  numberOfMonths = 1,
  directionOverflow,
  bottomContent,
  disabled,
  shouldDisplayArrowIcon = true,
  color,
  hasNoAvailableDates = false,
  showTime = false,
  showDateFrom,
  showDateTo,
  onClear,
  isOpen = false,
  allowSameDateSelection = true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
}: {
  id?: string;
  className?: string;
  informationLabel?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  inputLabel?: string;
  selectedDates: SharedTypes.SelectedDates;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onDateInputClick?: (e: SyntheticEvent, type?: DateRangeEnum) => void;
  dates: SharedTypes.Dates;
  initialMonth?: Date;
  minDays?: number;
  preOpenCalendar: boolean;
  allowSeparateSelection?: boolean;
  numberOfMonths?: number;
  directionOverflow?: "right" | "left";
  bottomContent?: ReactNode;
  disabled?: boolean;
  shouldDisplayArrowIcon?: boolean;
  color?: "action" | "primary";
  hasNoAvailableDates?: boolean;
  showTime?: boolean;
  showDateFrom?: boolean;
  showDateTo?: boolean;
  onClear?: (e: SyntheticEvent<SVGElement>) => void;
  isOpen?: boolean;
  allowSameDateSelection?: boolean;
  onClose?: () => void;
}) => {
  const activeLocale = useContext(LocaleContext);
  const isMobile = useIsMobile();
  let startDate = "";
  if (selectedDates.from) {
    startDate = showTime
      ? getFormattedDateWithTime(selectedDates.from, activeLocale)
      : getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  }
  let endDate = "";
  if (selectedDates.to) {
    endDate = showTime
      ? getFormattedDateWithTime(selectedDates.to, activeLocale)
      : getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);
  }
  const initialActiveDateInput = preOpenCalendar
    ? DateRangeEnum.onFromActive
    : DateRangeEnum.inactive;

  const [isCalendarOpen, toggleCalendar] = useToggle(preOpenCalendar);
  const [activeDateInput, setActiveDateInput] = useState<DateRangeEnum>(initialActiveDateInput);
  const prevActiveDateInput = usePreviousState(activeDateInput);
  const getClickHandler = useCallback(
    (value: DateRangeEnum) => {
      return allowSeparateSelection
        ? (e: SyntheticEvent) => {
            if (!disabled) setActiveDateInput(value);
            onDateInputClick?.(e, value);
          }
        : onDateInputClick;
    },
    [allowSeparateSelection, disabled, onDateInputClick]
  );

  useEffect(() => {
    // We only want to run this useEffect when a parent wants to affect if the calendar is open and the internal state doesn't match.
    if (isOpen === true && isCalendarOpen === false) {
      if (allowSeparateSelection) {
        setActiveDateInput(DateRangeEnum.onFromActive);
      }
      toggleCalendar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOutsideClick = useCallback(
    () => {
      if (!isCalendarOpen) {
        return;
      }

      if (allowSeparateSelection) {
        onClose();
        toggleCalendar();
        setActiveDateInput(DateRangeEnum.inactive);
      }

      if (!startDate || !endDate) {
        return;
      }

      onClose();
      toggleCalendar();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowSeparateSelection, startDate, endDate, isCalendarOpen, onClose]
  );

  return (
    <ContentDropdownStyled
      id={`datePicker${id}`}
      className={className}
      directionOverflow={directionOverflow}
      displayValue={
        <CalendarDropdownDisplay
          from={startDate}
          to={endDate}
          fromPlaceholder={fromPlaceholder}
          toPlaceholder={toPlaceholder}
          onFromClick={getClickHandler(DateRangeEnum.onFromActive)}
          onToClick={getClickHandler(DateRangeEnum.onToActive)}
          activeInput={activeDateInput}
          onClear={startDate || endDate ? onClear : undefined}
          showDateFrom={showDateFrom}
          showDateTo={showDateTo}
        />
      }
      inputLabel={inputLabel}
      isContentOpen={isCalendarOpen}
      toggleContent={() => {
        if (disabled || isMobile) return;

        const shouldSetDateTo = !allowSeparateSelection && selectedDates.from && !selectedDates.to;

        if (shouldSetDateTo) {
          onDateSelection({
            from: selectedDates.from,
            to: selectedDates.from ? addDays(selectedDates.from, minDays) : undefined,
          });
        }
        if (!isCalendarOpen || activeDateInput === prevActiveDateInput) {
          toggleCalendar();
        }
      }}
      information={informationLabel}
      onOutsideClick={handleOutsideClick}
      shouldDisplayArrowIcon={!allowSeparateSelection && shouldDisplayArrowIcon}
    >
      <DateRangePicker
        canChangeMonth
        showWeekdays
        numberOfMonths={numberOfMonths}
        selectedDates={selectedDates}
        initialMonth={initialMonth}
        allowSeparateSelection={allowSeparateSelection}
        activeInputType={activeDateInput}
        onDateSelection={newDates => {
          if (bothDaysSet(newDates)) {
            onClose();
            toggleCalendar();
            setActiveDateInput(DateRangeEnum.inactive);
          }

          if (allowSeparateSelection && activeDateInput === DateRangeEnum.onFromActive) {
            setActiveDateInput(DateRangeEnum.onToActive);
          }
          onDateSelection(newDates);
        }}
        hasNoAvailableDates={hasNoAvailableDates}
        dates={dates}
        color={color}
        allowSameDateSelection={allowSameDateSelection}
      />
      <BottomContent>{bottomContent}</BottomContent>
    </ContentDropdownStyled>
  );
};

export default DateRangeDropdown;
