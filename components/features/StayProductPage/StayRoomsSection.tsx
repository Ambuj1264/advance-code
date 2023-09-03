import React from "react";

import StayRoomCard from "./StayRoomCard";
import { useStayBookingWidgetContext } from "./StayBookingWidget/StayBookingWidgetStateContext";
import StayRoomLoadingSection from "./StayRoomLoadingSection";
import StayStaticRoomCard from "./StayStaticRoomCard";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import { MobileContainer } from "components/ui/Grid/Container";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";

const StayRoomSectionContent = ({
  roomTypes,
  staticRooms,
}: {
  roomTypes: StayBookingWidgetTypes.RoomType[];
  staticRooms: StayBookingWidgetTypes.StaticRoom[];
}) => {
  if (roomTypes.length > 0) {
    return (
      <>
        {roomTypes.map((roomType, index) => {
          return (
            <StyledSimilarProductsColumn
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}${roomType.roomType}AvailableRoomsSection`}
              productsCount={roomTypes.length}
            >
              <StayRoomCard roomType={roomType} />
            </StyledSimilarProductsColumn>
          );
        })}
      </>
    );
  }
  return (
    <>
      {staticRooms.map(staticRoom => {
        return (
          <StyledSimilarProductsColumn
            key={`${staticRoom.roomType}AvailableRoomsSection`}
            productsCount={staticRooms.length}
          >
            <StayStaticRoomCard staticRoom={staticRoom} />
          </StyledSimilarProductsColumn>
        );
      })}
    </>
  );
};
const StayRoomsSection = ({
  staticRooms,
}: {
  staticRooms: StayBookingWidgetTypes.StaticRoom[];
}) => {
  const { roomTypes, isAvailabilityLoading } = useStayBookingWidgetContext();
  // TODO: add loading state
  if (isAvailabilityLoading) return <StayRoomLoadingSection sectionTitle="All available rooms" />;
  if (roomTypes.length === 0 && staticRooms.length === 0) return null;
  return (
    <Section id="roomSelection">
      <MobileContainer>
        <LeftSectionHeading>
          <Trans ns={Namespaces.accommodationNs}>
            {roomTypes.length > 0 ? "All available rooms" : "Room types"}
          </Trans>
        </LeftSectionHeading>
        <SectionContent>
          <ProductCardRow>
            <StayRoomSectionContent roomTypes={roomTypes} staticRooms={staticRooms} />
          </ProductCardRow>
        </SectionContent>
      </MobileContainer>
    </Section>
  );
};

export default StayRoomsSection;
