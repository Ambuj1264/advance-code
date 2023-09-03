import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { getTotalNumberOfTravelers } from "../Travelers/utils/travelersUtils";
import {
  shouldShowDepartureNote,
  getSelectedPickupTimeDepartureTime,
} from "../utils/tourBookingWidgetUtils";

import PickupTimeDropdown from "./PickupTimeDropdown";

import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";
import { skeletonPulse } from "styles/base";
import { gutters, greyColor, fontSizeBody2 } from "styles/variables";
import { typographyCaption } from "styles/typography";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const SectionWrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const FreePickup = styled.span([
  typographyCaption,
  ({ theme }) => css`
    color: ${theme.colors.action};
    line-height: 20px;
  `,
]);

type Props = {
  selectedPickupTime?: string;
  onSetSelectedPickupTime: (selectedTime: string) => void;
  isLoadingAvailableTimes: boolean;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  isFreePickup: boolean;
  departureNote?: string;
  pickupType: string;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  hasPickup: boolean;
  className?: string;
};

const Loading = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small * 3.5}px;
    width: 100%;
    height: 43px;
  `,
]);

const DepartureNote = styled.div(({ theme }) => [
  typographyCaption,
  css`
    margin-top: ${gutters.small / 2}px;
    min-height: 18px;
    color: ${theme.colors.primary};
  `,
]);

const TimerHeader = styled.div`
  margin-top: ${gutters.small / 2}px;
  color: ${greyColor};
  font-size: ${fontSizeBody2};
`;

const PickupTimeContainerWrapper = styled.div();

const constructOptions = (
  availableTimes: TourBookingWidgetTypes.AvailableTimes,
  t: TFunction,
  numberOfTravelers: number,
  hasPickup: boolean,
  selectedPickupTime?: string
) =>
  availableTimes.times
    .filter(time => (hasPickup ? time.isPickupAvailable : true))
    .map(({ time, maxNumberOfTravelers, departureTime }) => {
      const spotsLeftText = t("{numberOfSpots} spots left", {
        numberOfSpots: maxNumberOfTravelers,
      });
      const selectedTime = hasPickup ? time : departureTime;
      const spotsLeft = (showSeparator = false) => {
        const separator = showSeparator ? " - " : "";
        if (maxNumberOfTravelers === 0) return `${separator}${t("Sold out")}`;
        if (maxNumberOfTravelers < numberOfTravelers * 2) return `${separator}${spotsLeftText}`;
        return "";
      };
      return {
        value: time,
        label: (
          <DropdownOption
            id={`${time}DropdownOption`}
            isSelected={selectedPickupTime === selectedTime}
            label={selectedTime}
            extraInfo={spotsLeft()}
            disabled={maxNumberOfTravelers < numberOfTravelers}
          />
        ),
        nativeLabel: `${selectedTime}${spotsLeft(true)}`,
        isDisabled: maxNumberOfTravelers < numberOfTravelers,
      };
    });

const PickupTimeContainer = ({
  onSetSelectedPickupTime,
  selectedPickupTime,
  availableTimes,
  isLoadingAvailableTimes,
  isFreePickup,
  departureNote,
  pickupType,
  numberOfTravelers,
  hasPickup,
  className,
}: Props) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  if (isLoadingAvailableTimes) return <Loading />;
  const showDepartureNote = shouldShowDepartureNote(pickupType, hasPickup, departureNote);
  const departureTime = getSelectedPickupTimeDepartureTime(
    availableTimes.times,
    selectedPickupTime
  );
  const normalizedSelectedPickupTime = hasPickup ? selectedPickupTime : departureTime;

  return availableTimes.times.length > 0 ? (
    <PickupTimeContainerWrapper className={className}>
      <SectionWrapper>
        <TimerHeader>
          <Trans ns={Namespaces.tourBookingWidgetNs}>Starting time</Trans>
        </TimerHeader>
        {isFreePickup && (
          <FreePickup>
            <Trans>Free Pickup</Trans>
          </FreePickup>
        )}
      </SectionWrapper>
      <PickupTimeDropdown
        options={constructOptions(
          availableTimes,
          t,
          getTotalNumberOfTravelers(numberOfTravelers),
          hasPickup,
          normalizedSelectedPickupTime
        )}
        onChange={onSetSelectedPickupTime}
        selectedPickupTime={normalizedSelectedPickupTime}
      />
      {showDepartureNote && (
        <DepartureNote>
          <Trans
            ns={Namespaces.tourBookingWidgetNs}
            defaults="From: {departureNote}"
            values={{ departureNote }}
          />
        </DepartureNote>
      )}
    </PickupTimeContainerWrapper>
  ) : null;
};

export default memo(PickupTimeContainer);
