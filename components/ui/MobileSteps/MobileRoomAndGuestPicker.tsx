import React from "react";
import styled from "@emotion/styled";

import ChildrenAges from "components/ui/Inputs/TravellerPicker/ChildrenAges";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { gutters } from "styles/variables";
import BaseIncrementPicker from "components/ui/Inputs/IncrementPicker";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const RoomSectionWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const IncrementPicker = styled(BaseIncrementPicker)`
  :not(:first-of-type) {
    margin-top: ${gutters.large}px;
  }
`;

const StyledMobileSectionHeading = styled(MobileSectionHeading)`
  margin-top: ${gutters.small}px;
`;

const MobileRoomAndGuestPicker = ({
  onSetNumberOfGuests,
  numberOfGuests,
  onSetNumberOfRooms,
  numberOfRooms,
  updateChildrenAges,
  onlyGuestSelection = false,
}: {
  numberOfGuests: SharedTypes.NumberOfGuests;
  onSetNumberOfGuests: (adults: number, children: number) => void;
  numberOfRooms: number;
  onSetNumberOfRooms: (numberOfRooms: number) => void;
  updateChildrenAges: (value: number, index: number) => void;
  onlyGuestSelection?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  return (
    <>
      <StyledMobileSectionHeading>{t("Guests")}</StyledMobileSectionHeading>
      {Object.entries(numberOfGuests).map(([guest, itemCount]) => {
        const count = typeof itemCount === "number" ? itemCount : itemCount.length;
        const canDecrement = () => {
          if (guest === "adults") return numberOfGuests.adults > 1;
          return numberOfGuests.children.length > 0;
        };
        const onChange = (number: number) => {
          const adults = guest === "adults" ? number : numberOfGuests.adults;
          const children = guest === "children" ? number : numberOfGuests.children.length;
          return onSetNumberOfGuests(adults, children);
        };
        return (
          <IncrementPicker
            key={guest}
            id={guest}
            canDecrement={canDecrement()}
            canIncrement
            count={count}
            title={guest === "adults" ? t("Adults") : t("Children")}
            onChange={onChange}
          />
        );
      })}
      {numberOfGuests.children.length > 0 && (
        <ChildrenAges
          childrenAges={numberOfGuests.children}
          updateChildrenAges={updateChildrenAges}
        />
      )}
      {!onlyGuestSelection && (
        <>
          <RoomSectionWrapper>
            <MobileSectionHeading>{t("Number of rooms")}</MobileSectionHeading>
          </RoomSectionWrapper>
          <IncrementPicker
            id="rooms"
            canDecrement={numberOfRooms > 1}
            canIncrement
            count={numberOfRooms}
            title={t("Rooms")}
            onChange={number => onSetNumberOfRooms(number)}
          />
        </>
      )}
    </>
  );
};

export default MobileRoomAndGuestPicker;
