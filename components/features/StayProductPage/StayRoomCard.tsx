import React, { useCallback } from "react";

import RoomCard from "./RoomCard";
import RoomDetails from "./RoomDetails";
import StayRoomType from "./StayBookingWidget/StayAvailability/StayRoomType";
import {
  getSelectedRoomTypeCount,
  getRoomTypePrice,
} from "./StayBookingWidget/utils/stayBookingWidgetUtils";
import { useOnSelectRoomType } from "./StayBookingWidget/stayHooks";
import { RoomEditModalWrapper, RoomInfoModalWrapper } from "./StayRoomModal";

import { Marketplace, SupportedCurrencies } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const StayRoomCard = ({ roomType }: { roomType: StayBookingWidgetTypes.RoomType }) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { roomTypeId, roomTypeName, images, fromPriceObject, productSpecs, roomDetails } = roomType;
  const numberOfSelectedRooms = getSelectedRoomTypeCount(roomType);
  const isCardSelected = numberOfSelectedRooms > 0;
  const price = getRoomTypePrice(fromPriceObject.price, roomType);
  const onSelectCard = useOnSelectRoomType();
  const handleSelectCard = useCallback(
    (id: string) => {
      onSelectCard?.(id, isCardSelected);
    },
    [onSelectCard, isCardSelected]
  );

  return (
    <RoomCard
      id={roomTypeId}
      title={roomTypeName}
      images={images}
      price={price}
      currency={isGTE ? (fromPriceObject.currency as SupportedCurrencies) : undefined}
      productSpecs={productSpecs}
      checkboxValue={String(numberOfSelectedRooms)}
      isCardSelected={isCardSelected}
      onSelectCard={handleSelectCard}
      isCheckboxFooter
      infoContent={
        <RoomInfoModalWrapper>
          <RoomDetails
            id={roomTypeId}
            roomTypeName={roomTypeName}
            images={images}
            productSpecs={productSpecs}
            roomDetails={roomDetails}
          />
        </RoomInfoModalWrapper>
      }
      editContent={
        <RoomEditModalWrapper>
          <StayRoomType roomType={roomType} isInModal />
        </RoomEditModalWrapper>
      }
    />
  );
};

export default StayRoomCard;
