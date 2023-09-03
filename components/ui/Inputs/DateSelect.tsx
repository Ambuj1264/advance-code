import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { Label } from "components/ui/Inputs/Dropdown/BaseDropdownSelectedOption";
import { DropdownWrapper } from "components/ui/Inputs/Dropdown/Dropdown";
import DropdownLeft from "components/ui/Inputs/Dropdown/DropdownLeft";
import {
  getMonths,
  getExpirationYears,
  getBirthdayYears,
} from "components/ui/DatePicker/utils/datePickerUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { gutters, greyColor, whiteColor } from "styles/variables";
import { Separator } from "components/ui/DatePicker/CalendarDropdownDisplay";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { addLeadingZero } from "utils/dateUtils";

export const SeparatorWrapper = styled.span<{ borderColor?: string }>(
  ({ borderColor }) => css`
    display: flex;
    align-items: center;
    border-top: 1px solid ${borderColor || rgba(greyColor, 0.5)};
    border-bottom: 1px solid ${borderColor || rgba(greyColor, 0.5)};
    padding: ${gutters.small / 2}px 0;
    background-color: ${whiteColor};
  `
);

export const StyledDropDown = styled(DropdownLeft)<{
  isDisabled: boolean;
  isLeftCombinedDropdown?: boolean;
  isRightCombinedDropdown?: boolean;
  width?: number;
  mobileWidth?: number;
}>(({ isDisabled, isRightCombinedDropdown, isLeftCombinedDropdown, width, mobileWidth }) => [
  css`
    width: ${mobileWidth ? `${mobileWidth}px` : "100%"};
    ${mqMin.desktop} {
      width: ${width ? `${width}px` : "100%"};
    }

    /* stylelint-disable selector-max-type */
    #dayDropdown > div:first-of-type > div:first-of-type {
      padding-right: ${gutters.small / 2}px;
      padding-left: clamp(${gutters.small / 4}px, 20%, ${gutters.small}px);

      /* select placeholder */
      & > div {
        width: max-content;
        max-width: 80%;
      }
    }
    #yearDropdown > div:first-of-type > div:first-of-type {
      padding-right: clamp(${gutters.small / 4}px, 20%, ${gutters.small}px);
      padding-left: ${gutters.small / 2}px;

      /* select placeholder */
      & > div {
        width: max-content;
        max-width: 80%;
      }
    }
    #monthDropdown > div:first-of-type > div:first-of-type {
      padding-right: ${gutters.small / 2}px;
      padding-left: ${gutters.small / 2}px;

      /* select placeholder */
      & > div {
        width: max-content;
        max-width: 80%;
      }
    }
    /* stylelint-enable selector-max-type */

    #monthDropdown > div:first-of-type,
    #dayDropdown > div:first-of-type,
    #yearDropdown > div:first-of-type {
      background-color: ${isDisabled && rgba(greyColor, 0.03)};
    }
    div[data-selected="true"] {
      padding-left: ${gutters.small / 4}px;
      ${mqMin.medium} {
        padding-left: ${gutters.small}px;
      }
    }
  `,
  isRightCombinedDropdown &&
    css`
      border-right: none;
      border-top-right-radius: unset;
      border-bottom-right-radius: unset;
    `,
  isLeftCombinedDropdown &&
    css`
      border-left: none;
      border-top-left-radius: unset;
      border-bottom-left-radius: unset;
    `,
]);

export const LocationSelectWrapper = styled.div<{ isArrowHidden?: boolean }>(
  ({ isArrowHidden }) => [
    css`
      display: flex;
      width: 100%;
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      ${DropdownWrapper}:nth-of-type(1) {
        flex-basis: 20%;
        flex-grow: 0.2;
        max-width: 20%;
      }
      ${DropdownWrapper}:nth-of-type(2) {
        flex-basis: 45%;
        flex-grow: 0.45;
        max-width: 45%;
      }
      ${DropdownWrapper}:nth-of-type(3) {
        flex-basis: 35%;
        flex-grow: 0.35;
        max-width: 35%;
      }

      ${mqMin.large} {
        ${DropdownWrapper}:nth-of-type(1) {
          flex-basis: 25%;
          flex-grow: 0.25;
          max-width: 25%;
        }
        ${DropdownWrapper}:nth-of-type(2) {
          flex-basis: 45%;
          flex-grow: 0.45;
          max-width: 45%;
        }
        ${DropdownWrapper}:nth-of-type(3) {
          flex-basis: 30%;
          flex-grow: 0.3;
          max-width: 30%;
        }
      }
    `,
    isArrowHidden &&
      css`
        ${Label} {
          width: 90%;
          max-width: 90%;
        }
      `,
  ]
);

const DateSelect = ({
  onDateChange,
  disabled = false,
  date,
  isExpiration = false,
  error,
  selectHeight,
  isArrowHidden = false,
  borderColor,
  maxHeight,
  expirationYearsLimit = 50,
  className,
}: {
  onDateChange: (dateObject: SharedTypes.Birthdate) => void;
  disabled?: boolean;
  date: SharedTypes.Birthdate;
  isExpiration?: boolean;
  error?: boolean;
  selectHeight?: number;
  isArrowHidden?: boolean;
  borderColor?: string;
  maxHeight?: string;
  expirationYearsLimit?: number;
  className?: string;
}) => {
  const activeLocale = useActiveLocale();
  const { t: commonT } = useTranslation();
  const months = getMonths(activeLocale);
  const days = range(1, 31).map(i => String(i));
  const birthdayYears = getBirthdayYears();
  const expirationYears = getExpirationYears(expirationYearsLimit);
  const years = isExpiration ? expirationYears : birthdayYears;

  const addDateInfo = useCallback(
    (dateObject: SharedTypes.Birthdate) => {
      const formattedDate: SharedTypes.Birthdate = {
        ...date,
        ...dateObject,
        day: dateObject.day ? Number(dateObject.day).toString() : date.day,
        month: dateObject.month ? Number(dateObject.month).toString() : date.month,
      };
      onDateChange(formattedDate);
    },
    [onDateChange, date]
  );

  const adjustedDate = useMemo(
    () => ({
      ...date,
      month: addLeadingZero(date.month),
      day: addLeadingZero(date.day),
    }),
    [date]
  );

  return (
    <LocationSelectWrapper isArrowHidden={isArrowHidden} className={className}>
      <StyledDropDown
        id="dayDropdown"
        options={days.map(day => {
          const dd = `${day.length === 1 ? `0${day}` : day}`;
          return {
            value: dd,
            nativeLabel: dd,
            label: dd,
          };
        })}
        onChange={value => addDateInfo({ day: value })}
        selectedValue={adjustedDate.day}
        isSearchable
        className="daySelection"
        isDisabled={disabled}
        error={error}
        isRightCombinedDropdown
        placeholder={commonT("Day")}
        noDefaultValue
        selectHeight={selectHeight}
        borderColor={borderColor}
        isArrowHidden={isArrowHidden}
        maxHeight={maxHeight}
      />
      <SeparatorWrapper borderColor={borderColor}>
        <Separator />
      </SeparatorWrapper>
      <StyledDropDown
        id="monthDropdown"
        options={months.map((month, index) => {
          const adjustedIndex = index + 1;
          const monthNumber = adjustedIndex < 10 ? `0${adjustedIndex}` : adjustedIndex.toString();
          return {
            value: monthNumber,
            nativeLabel: month,
            label: month,
          };
        })}
        onChange={value => addDateInfo({ month: value })}
        selectedValue={adjustedDate.month}
        isSearchable
        className="monthSelection"
        isDisabled={disabled}
        error={error}
        isRightCombinedDropdown
        isLeftCombinedDropdown
        placeholder={commonT("Month")}
        noDefaultValue
        selectHeight={selectHeight}
        borderColor={borderColor}
        isArrowHidden={isArrowHidden}
        maxHeight={maxHeight}
      />
      <SeparatorWrapper borderColor={borderColor}>
        <Separator />
      </SeparatorWrapper>
      <StyledDropDown
        id="yearDropdown"
        options={years.map(year => ({
          value: year,
          nativeLabel: year,
          label: year,
        }))}
        onChange={value => addDateInfo({ year: value })}
        selectedValue={adjustedDate.year}
        isSearchable
        className="yearSelection"
        isDisabled={disabled}
        error={error}
        isLeftCombinedDropdown
        placeholder={commonT("Year")}
        noDefaultValue
        selectHeight={selectHeight}
        borderColor={borderColor}
        isArrowHidden={isArrowHidden}
        maxHeight={maxHeight}
      />
    </LocationSelectWrapper>
  );
};

export default DateSelect;
