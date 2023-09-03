import React from "react";

import StayRoomCombinationCard from "./StayRoomCombinationCard";
import { useStayBookingWidgetContext } from "./StayBookingWidget/StayBookingWidgetStateContext";
import StayRoomLoadingSection from "./StayRoomLoadingSection";
import StayStaticRoomCard from "./StayStaticRoomCard";

import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { MobileContainer } from "components/ui/Grid/Container";

const StayRoomCombinationSectionContent = ({
  roomCombinations,
  staticRooms,
  isModalView = false,
}: {
  roomCombinations: StayBookingWidgetTypes.RoomCombination[];
  staticRooms: StayBookingWidgetTypes.StaticRoom[];
  isModalView?: boolean;
}) => {
  if (roomCombinations.length > 0 && !isModalView) {
    return (
      <>
        {roomCombinations.map(roomCombination => {
          return (
            <StyledSimilarProductsColumn
              key={`${roomCombination.title}SpecialOffersSection`}
              productsCount={roomCombinations.length}
            >
              <StayRoomCombinationCard roomCombination={roomCombination} />
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

const StayRoomCombinationsSection = ({
  isModalView = false,
  staticRooms,
}: {
  isModalView?: boolean;
  staticRooms: StayBookingWidgetTypes.StaticRoom[];
}) => {
  const { roomCombinations, isAvailabilityLoading, occupancies } = useStayBookingWidgetContext();
  const title = occupancies.length > 1 ? "Room combinations" : "Rooms";
  if (isAvailabilityLoading) return <StayRoomLoadingSection sectionTitle={title} />;
  const sectionDataIsMissing =
    roomCombinations.length === 0 && !isModalView && staticRooms.length === 0;
  const modalDataIsMissing = isModalView && staticRooms.length === 0;
  if (sectionDataIsMissing || modalDataIsMissing) return null;
  return (
    <Section id="specialOffersSelection">
      <MobileContainer>
        <LeftSectionHeading>
          <Trans ns={Namespaces.accommodationNs}>{title}</Trans>
        </LeftSectionHeading>
        <SectionContent>
          <ProductCardRow withScrollOverlay={false}>
            <StayRoomCombinationSectionContent
              roomCombinations={roomCombinations}
              staticRooms={staticRooms}
              isModalView={isModalView}
            />
          </ProductCardRow>
        </SectionContent>
      </MobileContainer>
    </Section>
  );
};

export default StayRoomCombinationsSection;
