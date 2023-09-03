import React, { useCallback } from "react";

import { useStayBookingWidgetContext } from "../StayBookingWidgetStateContext";
import { useOnSelectRoomCombinationAvailability } from "../stayHooks";

import StayRoomCombination from "./StayRoomCombination";

const StayRoomCombinations = () => {
  const { roomCombinations } = useStayBookingWidgetContext();
  const onSelectRoomCombinationAvailability = useOnSelectRoomCombinationAvailability();
  const onRoomCombinationSelect = useCallback(
    (roomCombinationId: string, availabilityId: string) => {
      onSelectRoomCombinationAvailability(roomCombinationId, availabilityId);
    },
    [onSelectRoomCombinationAvailability]
  );
  return (
    <>
      {roomCombinations.map(roomCombination => {
        return (
          <StayRoomCombination
            key={`${roomCombination.title}`}
            roomCombination={roomCombination}
            onRoomCombinationSelect={onRoomCombinationSelect}
          />
        );
      })}
    </>
  );
};

export default StayRoomCombinations;
