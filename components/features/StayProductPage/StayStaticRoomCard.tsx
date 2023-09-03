import React from "react";
import styled from "@emotion/styled";

import RoomCard from "./RoomCard";
import RoomDetails from "./RoomDetails";

import { gutters } from "styles/variables";

const RoomInfoWrapper = styled.div`
  margin: ${gutters.large / 2}px 0 ${gutters.large}px 0;
`;

const StayStaticRoomCard = ({ staticRoom }: { staticRoom: StayBookingWidgetTypes.StaticRoom }) => {
  const { roomTypeId, roomTypeName, images, productSpecs, roomDetails } = staticRoom;
  return (
    <RoomCard
      id={roomTypeId}
      title={roomTypeName}
      images={images}
      price={0}
      productSpecs={productSpecs}
      checkboxValue=""
      isCardSelected={false}
      onSelectCard={() => {}}
      skipFooter
      infoContent={
        <RoomInfoWrapper>
          <RoomDetails
            id={roomTypeId}
            roomTypeName={roomTypeName}
            images={images}
            productSpecs={productSpecs}
            roomDetails={roomDetails}
          />
        </RoomInfoWrapper>
      }
    />
  );
};

export default StayStaticRoomCard;
