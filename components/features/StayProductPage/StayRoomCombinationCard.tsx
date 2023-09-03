import React, { useCallback } from "react";
import styled from "@emotion/styled";

import RoomDetails from "./RoomDetails";
import {
  useOnSelectRoomCombination,
  useOnSelectRoomCombinationAvailability,
} from "./StayBookingWidget/stayHooks";
import RoomCard from "./RoomCard";
import StayRoomCombination from "./StayBookingWidget/StayAvailability/StayRoomCombination";

import { gutters } from "styles/variables";
import { SupportedCurrencies } from "types/enums";

const RoomDetailsWrapper = styled.div`
  margin-top: ${gutters.large / 2}px;
`;

const RoomInfoWrapper = styled.div`
  margin-bottom: ${gutters.large}px;
`;

const RoomEditWrapper = styled.div`
  margin: 0 0 ${gutters.large * 3}px 0;
  min-height: 300px;
`;

const StayRoomCombinationCard = ({
  roomCombination,
}: {
  roomCombination: StayBookingWidgetTypes.RoomCombination;
}) => {
  const { roomCombinationId, title, images, availabilities, rooms, productSpecs } = roomCombination;
  const selectedAvailability = availabilities.find(availability => availability.isSelected);
  const cheapestAvailability = availabilities.reduce((lowestPriceOffer, currentAvailability) => {
    return currentAvailability.priceObject.price < lowestPriceOffer.priceObject.price
      ? currentAvailability
      : lowestPriceOffer;
  }, availabilities[0] as StayBookingWidgetTypes.RoomCombinationAvailability);
  const currentAvailability = selectedAvailability || cheapestAvailability;
  const { price, currency, priceDisplayValue } = currentAvailability.priceObject;
  const onSelectCard = useOnSelectRoomCombination();
  const onSelectRoomCombinationAvailability = useOnSelectRoomCombinationAvailability();
  const onRoomCombinationSelect = useCallback(
    (stayRoomCombinationId: string, availabilityId: string) => {
      onSelectRoomCombinationAvailability(stayRoomCombinationId, availabilityId);
    },
    [onSelectRoomCombinationAvailability]
  );
  return (
    <RoomCard
      id={roomCombinationId}
      checkboxValue={roomCombinationId}
      title={title}
      isCardSelected={selectedAvailability !== undefined}
      images={images}
      productSpecs={productSpecs}
      mealType={selectedAvailability?.mealType}
      cancellationType={selectedAvailability?.cancellationType}
      freeCancellationUntil={selectedAvailability?.freeCancellationUntil}
      price={price}
      currency={currency as SupportedCurrencies}
      priceDisplayValue={priceDisplayValue}
      onSelectCard={onSelectCard}
      isTotalPrice={Boolean(selectedAvailability)}
      infoContent={
        <RoomInfoWrapper>
          {rooms.map((room, index) => (
            <RoomDetailsWrapper key={`${String(index)}${room.roomName}RoomCombinationRoomDetails`}>
              <RoomDetails
                id={`${String(index)}${room.roomName}RoomCombinationRoomDetails`}
                roomTypeName={room.roomName}
                images={room.images}
                productSpecs={room.productSpecs}
                roomDetails={room.roomDetails}
              />
            </RoomDetailsWrapper>
          ))}
        </RoomInfoWrapper>
      }
      editContent={
        <RoomEditWrapper>
          <StayRoomCombination
            roomCombination={roomCombination}
            isInModal
            onRoomCombinationSelect={onRoomCombinationSelect}
          />
        </RoomEditWrapper>
      }
    />
  );
};

export default StayRoomCombinationCard;
