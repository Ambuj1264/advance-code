import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TimePickerContainer from "../CarSearchWidget/TimePickerContainer";

import { whiteColor, gutters, fontSizeCaption, fontSizeBody2 } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { CarSearchTimeType } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";

const Label = styled.div([
  css`
    display: flex;
    align-items: center;
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    text-align: center;
  `,
]);

const TimePickerWrapper = styled.div`
  margin-left: ${gutters.small / 2}px;
  font-size: ${fontSizeBody2};
`;

const PickupTimeWrapper = styled.div`
  display: inline-flex;
`;

const DropoffTimeWrapper = styled.div`
  display: inline-flex;
  margin-left: auto;
`;

const PickupContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    margin: 14px -17px -17px -17px;
    border-radius: 0 0 4px 4px;
    padding: ${gutters.large / 2}px ${gutters.large}px;
    background-color: ${theme.colors.primary};
  `
);

const PickupInfoDesktop = ({
  onHourChange,
  onMinuteChange,
  pickup,
  dropoff,
  pickupAvailableTime,
  dropoffAvailableTime,
  className,
}: {
  onHourChange: (hour: number, timeType: SharedCarTypes.SearchTimeTypes) => void;
  onMinuteChange: (minute: number, timeType: SharedCarTypes.SearchTimeTypes) => void;
  pickup: SharedTypes.Time;
  dropoff: SharedTypes.Time;
  pickupAvailableTime?: SharedTypes.AvailableTime;
  dropoffAvailableTime?: SharedTypes.AvailableTime;
  className?: string;
}) => {
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.commonSearchNs);
  return (
    <PickupContainer className={className}>
      <PickupTimeWrapper>
        <Label>
          <Trans ns={Namespaces.commonSearchNs}>Pick up</Trans>
        </Label>
        <TimePickerWrapper>
          <TimePickerContainer
            id="pickup"
            selectedHour={pickup.hour.toString()}
            selectedMinute={pickup.minute.toString()}
            onHourChange={hour => onHourChange(Number(hour), CarSearchTimeType.PICKUP)}
            onMinuteChange={minute => onMinuteChange(Number(minute), CarSearchTimeType.PICKUP)}
            availableTime={pickupAvailableTime}
            hourLabel={activeLocale === "ko" ? t("hour", "시") : undefined}
            minuteLabel={activeLocale === "ko" ? t("minute", "분") : undefined}
          />
        </TimePickerWrapper>
      </PickupTimeWrapper>
      <DropoffTimeWrapper>
        <Label>
          <Trans ns={Namespaces.commonSearchNs}>Drop off</Trans>
        </Label>
        <TimePickerWrapper>
          <TimePickerContainer
            id="dropoff"
            selectedHour={dropoff.hour.toString()}
            selectedMinute={dropoff.minute.toString()}
            onHourChange={hour => onHourChange(Number(hour), CarSearchTimeType.DROPOFF)}
            onMinuteChange={minute => onMinuteChange(Number(minute), CarSearchTimeType.DROPOFF)}
            availableTime={dropoffAvailableTime}
            hourLabel={activeLocale === "ko" ? t("hour", "시") : undefined}
            minuteLabel={activeLocale === "ko" ? t("minute", "분") : undefined}
          />
        </TimePickerWrapper>
      </DropoffTimeWrapper>
    </PickupContainer>
  );
};
export default PickupInfoDesktop;
