import React, { useContext, useCallback } from "react";

import { VPActionCallbackContext } from "../contexts/VPActionStateContext";
import { VPPriceStateContext } from "../contexts/VPPriceStateContext";

import StayRoomCombination from "components/features/StayProductPage/StayBookingWidget/StayAvailability/StayRoomCombination";

const VPStaysEditModalContent = ({
  day,
  productId,
  roomCombinations,
}: {
  day: number;
  productId: number;
  roomCombinations: StayBookingWidgetTypes.RoomCombination[];
}) => {
  const { onSelectVPStayProductRooms } = useContext(VPActionCallbackContext);
  const { vpPriceLoading } = useContext(VPPriceStateContext);
  const onSelectRoomCombination = useCallback(
    (roomCombinationId: string, availabilityId: string) =>
      onSelectVPStayProductRooms(day, productId, roomCombinationId, availabilityId),
    [day, productId, onSelectVPStayProductRooms]
  );
  return (
    <>
      {roomCombinations.map(roomCombination => {
        return (
          <StayRoomCombination
            key={`${roomCombination.title}`}
            roomCombination={roomCombination}
            onRoomCombinationSelect={onSelectRoomCombination}
            isInModal
            isVP
            isLoading={vpPriceLoading}
          />
        );
      })}
    </>
  );
};

export default VPStaysEditModalContent;
