import React, { useCallback } from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { SeparatorWrapper } from "components/ui/Inputs/DateSelect";
import { mqMin } from "styles/base";
import { fontSizeBody2, greyColor, gutters } from "styles/variables";
import Dropdown, { DropdownWrapper } from "components/ui/Inputs/Dropdown/Dropdown";
import { Label } from "components/ui/InputWrapper";

const HOUR_DROPDOWN_ID = "hourDropdown";
const MINUTE_DROPDOWN_ID = "minuteDropdown";

const StyledDropDown = styled(Dropdown)<{
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
    #${HOUR_DROPDOWN_ID} > div:first-of-type > div:first-of-type {
      padding-right: ${gutters.small / 2}px;
      padding-left: clamp(${gutters.small / 4}px, 50%, ${gutters.small}px);

      /* select placeholder */
      & > div {
        width: max-content;
        max-width: 80%;
      }
    }
    #${MINUTE_DROPDOWN_ID} > div:first-of-type > div:first-of-type {
      padding-right: clamp(${gutters.small / 4}px, 50%, ${gutters.small}px);
      padding-left: ${gutters.small / 2}px;

      /* select placeholder */
      & > div {
        width: max-content;
        max-width: 80%;
      }
    }

    /* stylelint-enable selector-max-type */
    #${HOUR_DROPDOWN_ID} > div:first-of-type,
    #${MINUTE_DROPDOWN_ID} > div:first-of-type {
      background-color: ${isDisabled && rgba(greyColor, 0.03)};
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

const DropdownSelectWrapper = styled.div<{ isArrowHidden?: boolean }>(({ isArrowHidden }) => [
  css`
    display: flex;
    width: 100%;
    font-size: ${fontSizeBody2};
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    ${DropdownWrapper}:nth-of-type(1) {
      flex-basis: 50%;
      flex-grow: 0.5;
      max-width: 50%;
    }
    ${DropdownWrapper}:nth-of-type(2) {
      flex-basis: 50%;
      flex-grow: 0.5;
      max-width: 50%;
    }

    ${mqMin.large} {
      ${DropdownWrapper}:nth-of-type(1) {
        flex-basis: 50%;
        flex-grow: 0.5;
        max-width: 50%;
      }
      ${DropdownWrapper}:nth-of-type(2) {
        flex-basis: 50%;
        flex-grow: 0.5;
        max-width: 50%;
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
]);

const ColonSeparator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  height: 24px;
  color: ${rgba(greyColor, 0.5)};
`;

const TimeDropdown = ({
  onTimeChange,
  time,
  error,
  selectHeight,
  isArrowHidden = false,
  isDisabled = false,
  borderColor,
  maxHeight,
  className,
}: {
  onTimeChange: (time: SharedTypes.TimeDropdownObject) => void;
  time: SharedTypes.TimeDropdownObject;
  error?: boolean;
  selectHeight?: number;
  isArrowHidden?: boolean;
  isDisabled?: boolean;
  borderColor?: string;
  maxHeight?: string;
  className?: string;
}) => {
  const hours = range(0, 23).map(i => (i < 10 ? `0${i}` : String(i)));
  const minutes = range(0, 59).map(i => (i < 10 ? `0${i}` : String(i)));

  const addTimeInfo = useCallback(
    (timeObj: SharedTypes.TimeDropdownObject) => {
      onTimeChange({
        ...time,
        ...timeObj,
      });
    },
    [onTimeChange, time]
  );

  return (
    <DropdownSelectWrapper className={className}>
      <StyledDropDown
        id={HOUR_DROPDOWN_ID}
        options={hours.map(hour => ({
          value: hour,
          nativeLabel: hour,
          label: hour,
        }))}
        onChange={(value: string) => addTimeInfo({ hour: value })}
        selectedValue={time.hour}
        isSearchable
        className="hourSelection"
        isDisabled={isDisabled}
        error={error}
        isRightCombinedDropdown
        placeholder="HH"
        noDefaultValue
        selectHeight={selectHeight}
        borderColor={borderColor}
        isArrowHidden={isArrowHidden}
        maxHeight={maxHeight}
      />
      <SeparatorWrapper borderColor={borderColor}>
        <ColonSeparator>:</ColonSeparator>
      </SeparatorWrapper>
      <StyledDropDown
        id={MINUTE_DROPDOWN_ID}
        options={minutes.map(minute => ({
          value: minute,
          nativeLabel: minute,
          label: minute,
        }))}
        onChange={(value: string) => addTimeInfo({ minutes: value })}
        selectedValue={time.minutes}
        isSearchable
        className="minuteSelection"
        isDisabled={isDisabled}
        error={error}
        isLeftCombinedDropdown
        placeholder="mm"
        noDefaultValue
        selectHeight={selectHeight}
        borderColor={borderColor}
        isArrowHidden={isArrowHidden}
        maxHeight={maxHeight}
      />
    </DropdownSelectWrapper>
  );
};

export default TimeDropdown;
