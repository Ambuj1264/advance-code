import React from "react";
import styled from "@emotion/styled";

import NewMobileRoomAndGuestPicker from "../RoomAndGuestPicker/NewMobileRoomAndGuestPicker";

import MobileStepLocation from "components/ui/MobileSteps/MobileStepLocation";
import MobileRoomAndGuestPicker from "components/ui/MobileSteps/MobileRoomAndGuestPicker";
import { gutters } from "styles/variables";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const MobileRoomAndGuestPickerWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;
const MobileStepLocationAndGuests = ({
  startingLocationItems,
  onInputChange,
  onItemClick,
  locationPlaceholder,
  locationLabel,
  locationDefaultValue,
  numberOfGuests,
  onSetNumberOfGuests,
  numberOfRooms,
  onSetNumberOfRooms,
  onUpdateChildrenAges,
  forceLocationFocus,
  occupancies,
  onSetOccupancies,
  useNewGuestPicker = false,
}: {
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onItemClick: (item?: SharedTypes.AutocompleteItem | undefined) => void;
  locationPlaceholder?: string;
  locationLabel: string;
  locationDefaultValue?: string;
  numberOfGuests: SharedTypes.NumberOfGuests;
  onSetNumberOfGuests: (adults: number, children: number) => void;
  onSetOccupancies: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  numberOfRooms: number;
  onSetNumberOfRooms: (numberOfRooms: number) => void;
  onUpdateChildrenAges: (value: number, index: number) => void;
  forceLocationFocus?: boolean;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  useNewGuestPicker?: boolean;
}) => {
  return (
    <>
      <MobileSectionHeading>
        <Trans ns={Namespaces.tourSearchNs}>Select details</Trans>
      </MobileSectionHeading>
      <MobileStepLocation
        onInputChange={onInputChange}
        onItemClick={onItemClick}
        startingLocationItems={startingLocationItems}
        locationPlaceholder={locationPlaceholder}
        label={locationLabel}
        defaultValue={locationDefaultValue}
        forceFocus={forceLocationFocus}
      />
      <MobileRoomAndGuestPickerWrapper>
        {useNewGuestPicker ? (
          <NewMobileRoomAndGuestPicker
            occupancies={occupancies}
            onSetOccupancies={onSetOccupancies}
          />
        ) : (
          <MobileRoomAndGuestPicker
            numberOfGuests={numberOfGuests}
            onSetNumberOfGuests={onSetNumberOfGuests}
            numberOfRooms={numberOfRooms}
            onSetNumberOfRooms={onSetNumberOfRooms}
            updateChildrenAges={onUpdateChildrenAges}
          />
        )}
      </MobileRoomAndGuestPickerWrapper>
    </>
  );
};

export default MobileStepLocationAndGuests;
