import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { getSelectedRoomTypeCount } from "../utils/stayBookingWidgetUtils";

import RoomDropdown from "./StayRoomDropdown";
import StayRoomIncrementPicker from "./StayRoomIncrementPicker";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import { mqMax, mqMin } from "styles/base";

export const Wrapper = styled.div(
  ({ theme }) => css`
    margin: ${gutters.large}px -${gutters.large}px 0 -${gutters.large}px;
    padding: 0 ${gutters.large}px;
    ${mqMax.large} {
      margin: ${gutters.small}px -${gutters.small}px ${gutters.small}px -${gutters.small}px;
      padding: 0 ${gutters.small}px;
    }
    & + & {
      border-top: 8px solid ${rgba(theme.colors.primary, 0.05)};
      padding-top: ${gutters.large}px;
      ${mqMax.large} {
        padding-top: ${gutters.small}px;
      }
    }
  `
);

export const Separator = styled.div<{}>(
  ({ theme }) =>
    css`
      margin: ${gutters.small}px -${gutters.small}px 0 -${gutters.small}px;
      height: 6px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      ${mqMin.large} {
        margin: ${gutters.large}px -${gutters.large}px 0 -${gutters.large}px;
        height: 8px;
        padding: 0 ${gutters.large}px;
      }
    `
);

const StayRoomType = ({
  roomType,
  isInModal = false,
}: {
  roomType: StayBookingWidgetTypes.RoomType;
  isInModal?: boolean;
}) => {
  const isMobile = useIsMobile();
  const { roomTypeId, totalAvailableRooms, roomTypeName, roomOffers } = roomType;
  const totalRoomTypeSelectedCount = getSelectedRoomTypeCount(roomType);
  const canSelectMoreRooms = totalAvailableRooms
    ? totalRoomTypeSelectedCount < totalAvailableRooms!
    : true;
  if (isMobile || isInModal) {
    return (
      <>
        {!isInModal && (
          <MobileSectionHeading>
            <Trans ns={Namespaces.accommodationNs}>{roomTypeName}</Trans>
          </MobileSectionHeading>
        )}
        <Wrapper>
          {roomOffers.map((roomOffer, index) => {
            return (
              <>
                <StayRoomIncrementPicker
                  key={`${String(index)}${roomOffer.roomOfferName}IncrementPicker`}
                  room={roomOffer}
                  roomTypeId={roomTypeId}
                  canSelectMoreRooms={canSelectMoreRooms}
                />
                {index !== roomOffers.length - 1 && <Separator />}
              </>
            );
          })}
        </Wrapper>
      </>
    );
  }
  return (
    <Wrapper>
      <RoomDropdown
        roomType={roomType}
        selectedCount={totalRoomTypeSelectedCount}
        canSelectMoreRooms={canSelectMoreRooms}
      />
    </Wrapper>
  );
};

export default StayRoomType;
