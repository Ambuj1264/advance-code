import React, { useCallback, ChangeEvent } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { greyColor, borderRadiusSmall, whiteColor, gutters, redColor } from "styles/variables";
import { Separator } from "components/ui/DatePicker/CalendarDropdownDisplay";
import { DropdownWrapper } from "components/ui/Inputs/Dropdown/Dropdown";
import { StyledDropDown, SeparatorWrapper } from "components/ui/Inputs/DateSelect";

export const TimeSelectWrapper = styled.div`
  display: flex;
  width: 100%;
  input::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
  input[type="number"],
  ${DropdownWrapper} {
    flex-basis: 50%;
    flex-grow: 0.5;
    max-width: 50%;
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;

const StyledInput = styled.input<{ borderColor?: string }>(
  ({ borderColor }) => css`
    border: 1px solid ${borderColor || rgba(greyColor, 0.5)};
    border-right: none;
    border-radius: ${borderRadiusSmall};
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    width: 100%;
    height: 45px;
    padding: ${gutters.large / 2}px;
    background-color: ${whiteColor};
    color: ${greyColor};
  `
);

const GTETourNumberAndUnitQuestion = ({
  id,
  answer,
  units,
  selectedUnit,
  className,
  onUnitChange,
  onChange,
  borderColor,
  isError,
  maxValue,
  onBlur,
}: {
  id: string;
  answer: string;
  units: string[];
  selectedUnit?: string;
  className?: string;
  onUnitChange: (value: string) => void;
  onChange: (value: string) => void;
  borderColor?: string;
  isError: boolean;
  maxValue: number;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const handleInputChange = useCallback(
    (event?: ChangeEvent<HTMLInputElement>) => {
      const inputValue = String(event?.target?.value ?? "");
      onChange(inputValue);
    },
    [onChange]
  );
  const borderColorOrError = isError ? redColor : borderColor;
  return (
    <TimeSelectWrapper className={className}>
      <StyledInput
        type="number"
        min={1}
        max={maxValue - 1}
        maxLength={4}
        value={answer !== "" ? Number(answer) : undefined}
        onChange={handleInputChange}
        borderColor={borderColorOrError}
        onBlur={onBlur}
      />
      <SeparatorWrapper borderColor={borderColorOrError}>
        <Separator />
      </SeparatorWrapper>
      <StyledDropDown
        id={`${id}-units`}
        options={units.map(unit => ({
          value: unit,
          nativeLabel: unit,
          label: unit,
        }))}
        onChange={onUnitChange}
        selectedValue={selectedUnit}
        selectHeight={45}
        isSearchable
        className="unitSelection"
        isLeftCombinedDropdown
        isDisabled={false}
        borderColor={borderColorOrError}
      />
    </TimeSelectWrapper>
  );
};

export default GTETourNumberAndUnitQuestion;
