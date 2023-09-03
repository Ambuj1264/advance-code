import React, { ChangeEvent, SyntheticEvent, useCallback, memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { range } from "fp-ts/lib/Array";

import { getTimeString, parseTime } from "./mobileTimePickerUtils";

import { singleLineTruncation } from "styles/base";
import ClockIcon from "components/icons/clock-alternate.svg";
import { gutters, greyColor, borderRadiusSmall, whiteColor } from "styles/variables";
import { typographyBody2, typographyH5 } from "styles/typography";

const Wrapper = styled.span`
  ${typographyBody2};
  position: relative;
  display: block;
  border: 1px solid ${rgba(greyColor, 0.4)};
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 34px;
  padding: ${gutters.small / 2.5}px 0 ${gutters.small / 2}px ${gutters.small / 2 + 2}px;
  background-color: ${whiteColor};
  cursor: pointer;
  color: ${greyColor};
  line-height: ${gutters.small}px;
  overflow: hidden;
`;

const TimeInput = styled.input`
  ${typographyH5};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

export const TimeLabel = styled.label`
  ${singleLineTruncation};
  display: inline-block;
  margin-left: ${gutters.small / 2}px;
  width: 80%;
  padding-left: ${gutters.small / 2}px;
  vertical-align: middle;
`;

const iconStyles = (theme: Theme) => css`
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  fill: ${theme.colors.primary};
`;

export type MobileTimePickerSharedTypes = {
  onTimeSelection: (value: SharedTypes.Time) => void;
  onClick?: (e: SyntheticEvent) => void;
};

const MobileTimePicker = ({
  name,
  className,
  displayTime = {
    hour: 10,
    minute: 0,
  },
  onClick,
  onTimeSelection,
  stepMinutes = 30,
  useClosestStep = true,
  disabled,
  availableTime,
}: {
  name: string;
  className?: string;
  displayTime?: SharedTypes.Time;
  stepMinutes?: number;
  useClosestStep?: boolean;
  disabled?: boolean;
  availableTime?: SharedTypes.AvailableTime;
} & MobileTimePickerSharedTypes) => {
  const id = `timepicker-${name}`;
  const onTimeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const parsedTime = parseTime(e.target.value, stepMinutes, useClosestStep, availableTime);

      onTimeSelection?.(parsedTime);
    },
    [availableTime, onTimeSelection, stepMinutes, useClosestStep]
  );
  const clickHandler = useCallback(
    e => {
      if (disabled) e.preventDefault();
      onClick?.(e);
    },
    [disabled, onClick]
  );

  const timeStr = getTimeString(displayTime.hour, displayTime.minute);

  const availableTimeProps = {
    min: availableTime?.minHour ? getTimeString(availableTime.minHour, 0) : undefined,
    max: availableTime?.maxHour ? getTimeString(availableTime.maxHour, 0) : undefined,
  };

  return (
    <Wrapper onClick={clickHandler} className={className}>
      <ClockIcon css={iconStyles} />
      <TimeLabel htmlFor={id}>{timeStr}</TimeLabel>
      <TimeInput
        type="time"
        id={id}
        list={`${id}-list`}
        name={name}
        defaultValue={timeStr}
        onChange={onTimeChange}
        step={stepMinutes * 60}
        {...availableTimeProps}
      />
      <datalist id={`${id}-list`}>
        {range(0, 23).map(hour =>
          range(0, 60 / stepMinutes - 1).map(minute => {
            const displayMinute = minute * stepMinutes;
            const value = getTimeString(hour, displayMinute);

            return (
              <option
                key={displayMinute}
                value={value}
                data-hour={hour}
                data-minute={displayMinute}
              >
                {value}
              </option>
            );
          })
        )}
      </datalist>
    </Wrapper>
  );
};

export default memo(MobileTimePicker);
