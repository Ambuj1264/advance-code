import React from "react";

import { useStayBookingWidgetContext } from "../StayBookingWidgetStateContext";

import RoomType from "./StayRoomType";

const StayRoomTypes = () => {
  const { roomTypes } = useStayBookingWidgetContext();
  return (
    <>
      {roomTypes.map((roomType, index) => {
        return (
          <RoomType
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}${roomType.roomTypeId}`}
            roomType={roomType}
          />
        );
      })}
    </>
  );
};

export default StayRoomTypes;
