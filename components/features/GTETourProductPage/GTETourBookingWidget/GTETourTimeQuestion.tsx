import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { range } from "fp-ts/lib/Array";

import { Separator } from "components/ui/DatePicker/CalendarDropdownDisplay";
import { DropdownWrapper } from "components/ui/Inputs/Dropdown/Dropdown";
import { StyledDropDown, SeparatorWrapper } from "components/ui/Inputs/DateSelect";

export const TimeSelectWrapper = styled.div`
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
  ${DropdownWrapper}:nth-of-type(1),
  ${DropdownWrapper}:nth-of-type(2) {
    flex-basis: 50%;
    flex-grow: 0.5;
    max-width: 50%;
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;

const hoursOptions: SelectOption[] = range(0, 23).map(hour => {
  const formattedHour = `0${hour}`.slice(-2);
  return {
    value: hour.toString(),
    nativeLabel: formattedHour.toString(),
    label: formattedHour.toString(),
  };
});

const minuteOptions: SelectOption[] = range(0, 59).map(minute => {
  const formattedMinute = `0${minute}`.slice(-2);
  return {
    value: minute.toString(),
    nativeLabel: formattedMinute.toString(),
    label: formattedMinute.toString(),
  };
});

const GTETourTimeQuestion = ({
  id,
  selectedTime,
  onTimeChange,
  className,
  borderColor,
}: {
  id: string;
  selectedTime: SharedTypes.Time;
  onTimeChange: (timeObject: SharedTypes.Time) => void;
  className?: string;
  borderColor?: string;
}) => {
  const addTimeInfo = useCallback(
    (timeObject: SharedTypes.Time) => {
      onTimeChange(timeObject);
    },
    [onTimeChange]
  );

  return (
    <TimeSelectWrapper className={className}>
      <StyledDropDown
        id={`${id}-hours`}
        options={hoursOptions}
        onChange={hour => addTimeInfo({ hour: Number(hour), minute: selectedTime.minute })}
        selectedValue={selectedTime ? String(selectedTime.hour) : undefined}
        isSearchable
        className="hourSelection"
        isRightCombinedDropdown
        placeholder="Hour"
        noDefaultValue
        selectHeight={45}
        isDisabled={false}
        borderColor={borderColor}
      />
      <SeparatorWrapper>
        <Separator />
      </SeparatorWrapper>
      <StyledDropDown
        id={`${id}-minutes`}
        options={minuteOptions}
        onChange={minute => addTimeInfo({ hour: selectedTime.hour, minute: Number(minute) })}
        selectedValue={selectedTime ? String(selectedTime.minute) : undefined}
        selectHeight={45}
        isSearchable
        className="minuiteSelection"
        isLeftCombinedDropdown
        placeholder="Minutes"
        noDefaultValue
        isDisabled={false}
        borderColor={borderColor}
      />
    </TimeSelectWrapper>
  );
};

export default GTETourTimeQuestion;
