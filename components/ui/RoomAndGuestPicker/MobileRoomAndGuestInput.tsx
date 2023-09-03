import React from "react";

import {
  DisplayWrapper,
  DisplayValueItem,
  Value,
  Separator,
  iconStyles,
} from "./NewDesktopRoomAndGuestPicker";
import { StyledDisplayValue } from "./NewMobileRoomAndGuestPicker";
import { getTotalNumberOfGuests } from "./utils/roomAndGuestUtils";

import TravelersIcon from "components/icons/travellers.svg";
import RoomIcon from "components/icons/hotel-bedroom.svg";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

const MobileRoomAndGuestInput = ({
  onInputClick,
  occupancies,
  className,
  namespace = Namespaces.accommodationNs,
}: {
  onInputClick?: () => void;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  className?: string;
  namespace?: Namespaces;
}) => {
  const numberOfTravelers = getTotalNumberOfGuests(occupancies);
  return (
    <StyledDisplayValue onClick={onInputClick} className={className}>
      <DisplayWrapper>
        <DisplayValueItem>
          <TravelersIcon css={iconStyles} />
          <Value>
            <Trans
              ns={namespace}
              i18nKey="{numberOfTravelers} travelers"
              defaults="{numberOfTravelers} travelers"
              values={{
                numberOfTravelers,
              }}
            />
          </Value>
        </DisplayValueItem>
        <Separator />
        <DisplayValueItem>
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
      </DisplayWrapper>
    </StyledDisplayValue>
  );
};

export default MobileRoomAndGuestInput;
