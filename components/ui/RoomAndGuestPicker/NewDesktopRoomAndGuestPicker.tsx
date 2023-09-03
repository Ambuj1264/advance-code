import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { DoubleLabel } from "../MobileSteps/AutocompleteModalHelpers";

import DesktopRoomAndGuestPickerContent from "./DesktopRoomAndGuestPickerContent";
import TotalGuestPicker from "./TotalGuestPicker";
import { getTotalGuests } from "./utils/roomAndGuestUtils";

import ContentDropdown, {
  ArrowIcon,
  DisplayValue,
  DropdownContentWrapper,
  DropdownContainer,
} from "components/ui/Inputs/ContentDropdown";
import { gutters, greyColor, borderRadiusSmall, whiteColor } from "styles/variables";
import useToggle from "hooks/useToggle";
import TravelersIcon from "components/icons/travellers.svg";
import RoomIcon from "components/icons/hotel-bedroom.svg";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import { singleLineTruncation, mqMin, container, styledWebkitScrollbar } from "styles/base";

export enum ActiveTabEnum {
  travelersActive = "travelers",
  roomsActive = "rooms",
  inactive = "inactive",
}

export const ContentDropdownStyled = styled(ContentDropdown)(
  ({ theme }) => css`
    margin: 0;
    padding: 0;
    user-select: none;

    ${container} {
      padding: 0;
    }

    ${DropdownContentWrapper} {
      padding: ${gutters.small / 2}px;

      ${mqMin.large} {
        padding: ${gutters.small}px;
      }
    }
    ${DropdownContainer} {
      ${styledWebkitScrollbar};
      top: 50px;
      max-height: 380px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
    ${DisplayValue} {
      position: relative;
      margin: 0;
      padding: 0;
      border-color: ${theme.colors.primary};
    }

    ${ArrowIcon} {
      position: absolute;
      right: ${gutters.small}px;
    }
  `
);

export const iconStyles = (theme: Theme) => css`
  width: 16px;
  height: 16px;
  fill: ${theme.colors.primary};
`;

export const DisplayWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${borderRadiusSmall};
  width: 100%;
  height: 100%;
  background-color: ${whiteColor};
`;

export const DisplayValueItem = styled.span<{
  isActive?: boolean;
  onlyGuestSelection?: boolean;
}>([
  ({ onlyGuestSelection = false }) => css`
    position: relative;
    display: flex;
    flex-basis: ${onlyGuestSelection ? 100 : 50}%;
    align-items: center;
    min-width: calc(50% - 0.5px);
    height: 100%;
    padding: ${gutters.small / 4}px 0 ${gutters.small / 4}px ${gutters.small}px;
    color: ${greyColor};
  `,
  ({ isActive = false }) =>
    isActive &&
    (({ theme }) => css`
      &::before {
        content: "";
        position: absolute;
        top: 5px;
        right: 5px;
        bottom: 6px;
        left: 5px;
        border-radius: ${borderRadiusSmall};
        background: ${rgba(theme.colors.primary, 0.1)};
      }
    `),
]);

export const Value = styled.span<{ onlyGuestSelection?: boolean }>(
  ({ onlyGuestSelection = false }) => css`
    ${singleLineTruncation};
    display: block;
    margin-left: ${gutters.small / 2}px;
    width: ${onlyGuestSelection ? 90 : 80}%;
    padding-left: ${gutters.small / 2}px;
  `
);

export const Separator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1px;
  height: 24px;
  background-color: ${rgba(greyColor, 0.5)};
`;

const NewDesktopRoomAndGuestPicker = ({
  className,
  shouldDisplayArrowIcon = false,
  occupancies,
  onSetOccupancies,
  onSetRooms,
  onlyGuestSelection = false,
  travelerLabel,
  roomLabel,
  withLabelWrapper = true,
  onOpenStateChange,
  onBeforeInputClick,
  disableTravelersInputClickHandler = false,
  disableRoomsInputClickHandler = false,
  namespace = Namespaces.accommodationNs,
  dataTestid,
}: {
  className?: string;
  shouldDisplayArrowIcon?: boolean;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onSetRooms?: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  travelerLabel?: string;
  roomLabel?: string;
  withLabelWrapper?: boolean;
  onlyGuestSelection?: boolean;
  onBeforeInputClick?: (clickedInputType: ActiveTabEnum) => void;
  disableTravelersInputClickHandler?: boolean;
  disableRoomsInputClickHandler?: boolean;
  namespace?: Namespaces;
  dataTestid?: string;
} & BookingWidgetTypes.onOpenStateChange) => {
  const totalGuests = getTotalGuests(occupancies);
  const [isTravelersOpen, toggleTravelers] = useToggle(false);
  const [activeInput, setActiveInput] = useState<ActiveTabEnum>(ActiveTabEnum.inactive);
  const onTravelersClick = useCallback(() => {
    onBeforeInputClick?.(ActiveTabEnum.travelersActive);
    if (disableTravelersInputClickHandler) return;
    if (activeInput === ActiveTabEnum.travelersActive && isTravelersOpen) {
      setActiveInput(ActiveTabEnum.inactive);
      toggleTravelers();
      onOpenStateChange?.(false);
    } else {
      setActiveInput(ActiveTabEnum.travelersActive);
      if (!isTravelersOpen) {
        toggleTravelers();
        onOpenStateChange?.(true);
      }
    }
  }, [
    onBeforeInputClick,
    disableTravelersInputClickHandler,
    activeInput,
    isTravelersOpen,
    toggleTravelers,
    onOpenStateChange,
  ]);
  const onRoomsClick = useCallback(() => {
    onBeforeInputClick?.(ActiveTabEnum.roomsActive);
    if (disableRoomsInputClickHandler) return;
    if (activeInput === ActiveTabEnum.roomsActive && isTravelersOpen) {
      setActiveInput(ActiveTabEnum.inactive);
      toggleTravelers();
      onOpenStateChange?.(false);
    } else {
      setActiveInput(ActiveTabEnum.roomsActive);
      if (!isTravelersOpen) {
        toggleTravelers();
        onOpenStateChange?.(true);
      }
    }
  }, [
    onBeforeInputClick,
    disableRoomsInputClickHandler,
    activeInput,
    isTravelersOpen,
    toggleTravelers,
    onOpenStateChange,
  ]);
  const onOutsideClickHandler = useCallback(() => {
    if (!isTravelersOpen) return;
    toggleTravelers();
    setActiveInput(ActiveTabEnum.inactive);
    onOpenStateChange?.(false);
  }, [isTravelersOpen, toggleTravelers, onOpenStateChange]);
  return (
    <>
      {withLabelWrapper && (
        <DoubleLabel
          leftLabel={travelerLabel}
          rightLabel={!onlyGuestSelection ? roomLabel : undefined}
        />
      )}
      <ContentDropdownStyled
        className={className}
        id="roomAndGuest"
        shouldDisplayArrowIcon={shouldDisplayArrowIcon}
        displayValue={
          <DisplayWrapper>
            <DisplayValueItem
              isActive={ActiveTabEnum.travelersActive === activeInput}
              onlyGuestSelection={onlyGuestSelection}
              onClick={onTravelersClick}
            >
              <TravelersIcon css={iconStyles} />
              <Value onlyGuestSelection={onlyGuestSelection}>
                <Trans
                  ns={namespace}
                  i18nKey="{numberOfTravelers} travelers"
                  defaults="{numberOfTravelers} travelers"
                  values={{
                    numberOfTravelers: totalGuests.numberOfAdults + totalGuests.childrenAges.length,
                  }}
                />
              </Value>
            </DisplayValueItem>
            {!onlyGuestSelection && (
              <>
                <Separator />
                <DisplayValueItem
                  isActive={ActiveTabEnum.roomsActive === activeInput}
                  onClick={onRoomsClick}
                >
                  <RoomIcon css={iconStyles} />
                  <Value>
                    <Trans
                      ns={namespace}
                      i18nKey="{numberOfRooms} rooms"
                      defaults="{numberOfRooms} rooms"
                      values={{ numberOfRooms: occupancies.length }}
                    />
                  </Value>
                </DisplayValueItem>
              </>
            )}
          </DisplayWrapper>
        }
        isContentOpen={isTravelersOpen}
        onOutsideClick={onOutsideClickHandler}
        toggleContent={() => {}}
      >
        {activeInput === ActiveTabEnum.roomsActive && !onlyGuestSelection ? (
          <DesktopRoomAndGuestPickerContent
            occupancies={occupancies}
            onSetOccupancies={onSetOccupancies}
            onSetRooms={onSetRooms}
            onlyRoomSelection={occupancies.length === 1}
            roomIncrementLimit={totalGuests.numberOfAdults}
            namespace={namespace}
            dataTestid={dataTestid}
          />
        ) : (
          <TotalGuestPicker
            occupancies={occupancies}
            onSetOccupancies={onSetOccupancies}
            namespace={namespace}
          />
        )}
      </ContentDropdownStyled>
    </>
  );
};

export default NewDesktopRoomAndGuestPicker;
