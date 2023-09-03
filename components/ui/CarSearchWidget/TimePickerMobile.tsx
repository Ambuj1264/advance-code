import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import MobileTimePicker, { TimeLabel } from "../TimePicker/MobileTimePicker";
import { DoubleLabel } from "../MobileSteps/AutocompleteModalHelpers";

import { CallbackContext } from "./contexts/CarSearchWidgetCallbackContext";

import { gutters, greyColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { SeparatorWrapper } from "components/ui/Inputs/DateSelect";

const MobileTimePickerStyled = styled(MobileTimePicker)<{ isPickup?: boolean }>(
  ({ isPickup = false, theme }) => [
    isPickup &&
      css`
        border-right: none;
        border-top-right-radius: unset;
        border-bottom-right-radius: unset;
      `,
    !isPickup &&
      css`
        border-left: none;
        border-top-left-radius: unset;
        border-bottom-left-radius: unset;
      `,
    css`
      display: flex;
      align-items: center;
      height: 40px;
      border-color: ${theme.colors.primary};
      ${TimeLabel} {
        display: flex;
        justify-content: center;
        margin-left: -${gutters.large}px;
        width: 100%;
      }
    `,
  ]
);

const TimeSelectWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Separator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  background-color: ${rgba(greyColor, 0.5)};
`;

const TimePickerMobile = ({
  times: { pickup, dropoff },
  pickupAvailableTime,
  dropoffAvailableTime,
  onPickupTimeChange,
  onDropoffTimeChange,
  className,
}: {
  times: SharedCarTypes.CarSeachTimes;
  pickupAvailableTime?: SharedTypes.AvailableTime;
  dropoffAvailableTime?: SharedTypes.AvailableTime;
  className?: string;
} & Pick<CallbackContext, "onPickupTimeChange" | "onDropoffTimeChange">) => {
  const { t } = useTranslation(Namespaces.carSearchNs);
  return (
    <div className={className}>
      <DoubleLabel leftLabel={t("Pick-up time")} rightLabel={t("Drop-off time")} />
      <TimeSelectWrapper>
        <MobileTimePickerStyled
          name="pickup"
          onTimeSelection={onPickupTimeChange}
          displayTime={pickup}
          availableTime={pickupAvailableTime}
          isPickup
        />
        <SeparatorWrapper>
          <Separator />
        </SeparatorWrapper>
        <MobileTimePickerStyled
          name="dropoff"
          onTimeSelection={onDropoffTimeChange}
          displayTime={dropoff}
          availableTime={dropoffAvailableTime}
        />
      </TimeSelectWrapper>
    </div>
  );
};

export default TimePickerMobile;
