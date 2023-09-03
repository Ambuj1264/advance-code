import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { DoubleLabel } from "../MobileSteps/AutocompleteModalHelpers";

import DesktopRoomAndGuestPickerContent from "./DesktopRoomAndGuestPickerContent";
import {
  DisplayWrapper,
  Separator,
  ActiveTabEnum,
  iconStyles,
  DisplayValueItem,
  Value,
} from "./NewDesktopRoomAndGuestPicker";
import TotalGuestPicker from "./TotalGuestPicker";
import { getTotalGuests } from "./utils/roomAndGuestUtils";

import { DisplayValue } from "components/ui/Inputs/ContentDropdown";
import { gutters } from "styles/variables";
import TravelersIcon from "components/icons/travellers.svg";
import RoomIcon from "components/icons/hotel-bedroom.svg";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";

export const StyledDisplayValue = styled(DisplayValue)(
  ({ theme }) => css`
    padding: 0;
    border-color: ${theme.colors.primary};
  `
);

const ContentWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const NewMobileRoomAndGuestPicker = ({
  occupancies,
  onSetOccupancies,
  onlyGuestSelection = false,
  onSetRooms,
  className,
  namespace = Namespaces.accommodationNs,
}: {
  occupancies: StayBookingWidgetTypes.Occupancy[];
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onSetRooms?: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onlyGuestSelection?: boolean;
  className?: string;
  namespace?: Namespaces;
}) => {
  const { t } = useTranslation(namespace);

  const totalGuests = getTotalGuests(occupancies);
  const [activeInput, setActiveInput] = useState<ActiveTabEnum>(ActiveTabEnum.travelersActive);
  const onTravelersClick = useCallback(() => {
    setActiveInput(ActiveTabEnum.travelersActive);
  }, []);
  const onRoomsClick = useCallback(() => {
    setActiveInput(ActiveTabEnum.roomsActive);
  }, []);
  return (
    <>
      <DoubleLabel
        leftLabel={t("Travelers")}
        rightLabel={onlyGuestSelection ? undefined : t("Rooms")}
      />
      <StyledDisplayValue className={className}>
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
      </StyledDisplayValue>
      <ContentWrapper>
        {activeInput === ActiveTabEnum.roomsActive && !onlyGuestSelection ? (
          <DesktopRoomAndGuestPickerContent
            occupancies={occupancies}
            onSetOccupancies={onSetOccupancies}
            onlyRoomSelection={occupancies.length === 1}
            roomIncrementLimit={totalGuests.numberOfAdults}
            onSetRooms={onSetRooms}
            namespace={namespace}
          />
        ) : (
          <TotalGuestPicker
            occupancies={occupancies}
            onSetOccupancies={onSetOccupancies}
            namespace={namespace}
          />
        )}
      </ContentWrapper>
    </>
  );
};

export default NewMobileRoomAndGuestPicker;
