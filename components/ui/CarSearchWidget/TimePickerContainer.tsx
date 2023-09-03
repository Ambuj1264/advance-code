import React from "react";
import styled from "@emotion/styled";
import { range } from "fp-ts/lib/Array";
import { css } from "@emotion/core";

import BaseDropdown from "components/ui/Inputs/Dropdown/BaseDropdown";
import { whiteColor, gutters, fontSizeCaption } from "styles/variables";

const DropdownWrapper = styled.div`
  width: 86px;
  height: 32px;
  &:last-child {
    margin-left: ${gutters.small / 2}px;
  }
`;

const Wrapper = styled.div`
  display: flex;
`;

const HourLabel = styled.div([
  css`
    display: flex;
    align-items: center;
    margin-right: ${gutters.small / 2}px;
    margin-left: ${gutters.small / 2}px;
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    text-align: center;
  `,
]);

const MinuteLabel = styled.div([
  css`
    display: flex;
    align-items: center;
    margin-left: ${gutters.small / 2}px;
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    text-align: center;
  `,
]);

const isHourDisabled = (hour: number, { minHour, maxHour }: SharedTypes.AvailableTime) => {
  return Boolean((minHour && hour < minHour) || (maxHour && hour > maxHour));
};

const constructHoursOptions = (availableTime?: SharedTypes.AvailableTime): SelectOption[] =>
  range(0, 23).map(hour => {
    const formattedHour = `0${hour}`.slice(-2);
    return {
      value: hour.toString(),
      nativeLabel: formattedHour.toString(),
      label: formattedHour.toString(),
      isDisabled: availableTime ? isHourDisabled(hour, availableTime) : false,
    };
  });

const minutesOptions = [
  {
    value: "0",
    nativeLabel: "00",
    label: "00",
  },
  {
    value: "30",
    nativeLabel: "30",
    label: "30",
  },
];

const TimePickerContainer = ({
  id,
  selectedHour,
  selectedMinute,
  onHourChange,
  onMinuteChange,
  availableTime,
  minuteLabel,
  hourLabel,
}: {
  id: string;
  selectedHour: string;
  selectedMinute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  availableTime?: SharedTypes.AvailableTime;
  minuteLabel?: string;
  hourLabel?: string;
}) => {
  return (
    <Wrapper>
      <DropdownWrapper>
        <BaseDropdown
          id={`${id}-hours`}
          options={constructHoursOptions(availableTime)}
          onChange={hour => onHourChange(hour)}
          selectedValue={selectedHour}
          selectHeight={32}
          maxHeight="120px"
        />
      </DropdownWrapper>
      {hourLabel && <HourLabel>{hourLabel}</HourLabel>}

      <DropdownWrapper>
        <BaseDropdown
          id={`${id}-minutes`}
          options={minutesOptions}
          onChange={minute => onMinuteChange(minute)}
          selectedValue={selectedMinute}
          selectHeight={32}
        />
      </DropdownWrapper>
      {minuteLabel && <MinuteLabel>{minuteLabel}</MinuteLabel>}
    </Wrapper>
  );
};

export default TimePickerContainer;
