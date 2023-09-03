import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { getRoomTypePrice } from "../utils/stayBookingWidgetUtils";
import StayRoomModal, { RoomInfoModalWrapper } from "../../StayRoomModal";
import RoomDetails from "../../RoomDetails";

import StayRoomIncrementPicker from "./StayRoomIncrementPicker";
import {
  StyledInformationIcon,
  StyledInformationIconWrapper,
} from "./StayAvailabilitySharedComponents";

import { DropdownContainer, DisplayValue, ArrowIcon } from "components/ui/Inputs/ContentDropdown";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import InformationTooltip, {
  InformationCircleIcon,
} from "components/ui/Tooltip/InformationTooltip";
import { TooltipWrapper } from "components/ui/Tooltip/Tooltip";
import BookingWidgetDropdown, {
  DisplayWrapper,
} from "components/ui/BookingWidget/BookingWidgetDropdown";
import Price from "components/ui/BookingWidget/Price/Price";
import RoomIcon from "components/icons/bedroom-hotel.svg";
import { ExpandedInputContainer } from "components/ui/RoomAndGuestPicker/DesktopRoomAndGuestPicker";
import {
  gutters,
  borderRadiusSmall,
  boxShadowTileRegular,
  whiteColor,
  greyColor,
  borderRadius,
  blackColor,
} from "styles/variables";
import { singleLineTruncation } from "styles/base";
import { typographySubtitle2 } from "styles/typography";
import ItemCard from "components/ui/ContentTemplates/ItemCard/ItemCard";
import ItemCardContent from "components/ui/ContentTemplates/ItemCard/ItemCardContent";
import { ImageSliderContainer } from "components/ui/ImageCarousel/ImageCarousel";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";
import useToggle from "hooks/useToggle";
import { Price as PriceItem } from "components/ui/BookingWidget/Price/PriceItem";

export const StyledExpandedInputContainer = styled(ExpandedInputContainer)`
  margin: ${gutters.small}px;
  max-height: 340px;
`;

export const Name = styled.div<{ isSelected: boolean }>(({ theme, isSelected }) => [
  singleLineTruncation,
  css`
    color: ${isSelected ? theme.colors.action : theme.colors.primary};
  `,
]);

export const HeaderWrapper = styled.div([
  typographySubtitle2,
  css`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  `,
]);

export const NameWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: auto;
  max-width: 70%;
`;

export const PriceWrapper = styled.div`
  display: flex;
`;

export const InformationTooltipWrapper = styled.div`
  padding-right: ${gutters.small / 2}px;

  .infoButton {
    margin-left: 0;
    height: 100%;
  }
`;

export const StyledInformationTooltip = styled(InformationTooltip)<{
  itemHeight: number;
}>(({ theme, itemHeight }) => [
  css`
    ${InformationCircleIcon} {
      fill: ${theme.colors.primary};
    }
    ${TooltipWrapper} {
      box-shadow: ${boxShadowTileRegular};
      max-height: ${itemHeight}px;
      padding: 0;
      background-color: ${whiteColor};
      overflow: hidden;
    }
  `,
]);

const ItemCardWrapper = styled.div`
  border-radius: ${borderRadiusSmall};
  width: 100%;
`;

const StyledItemCard = styled(ItemCard)`
  box-shadow: none;
  ${ImageSliderContainer} {
    height: 100%;
  }
`;

const StyledBookingWidgetDropdown = styled(BookingWidgetDropdown)<{ isSelected: boolean }>(
  ({ isSelected, theme }) => css`
    ${DropdownContainer} {
      top: 50px;
    }
    ${DisplayWrapper} {
      border-radius: ${borderRadius};
      background-color: ${whiteColor};
      color: ${greyColor};
      svg {
        fill: ${isSelected ? theme.colors.action : theme.colors.primary};
      }
    }
    ${DisplayValue} {
      border: ${isSelected ? 1 : 1}px solid
        ${isSelected ? theme.colors.action : rgba(greyColor, 0.5)};
      filter: ${isSelected ? `drop-shadow(0 4px 4px ${rgba(blackColor, 0.25)})` : "none"};
    }
    ${ArrowIcon} {
      fill: ${greyColor};
    }
  `
);

const StyledPrice = styled(Price)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => css`
    ${PriceItem} {
      color: ${isSelected ? theme.colors.action : theme.colors.primary};
    }
  `
);

export const ItemCardTooltip = ({
  id,
  images,
  roomFacts,
  name,
}: {
  id: string;
  roomFacts: SharedTypes.ProductSpec[];
  images: Image[];
  name: string;
}) => {
  return (
    <ItemCardWrapper>
      <StyledItemCard id={id} images={images} hideModalGallery lazyLoading={false} name={name}>
        <ItemCardContent content={roomFacts} />
      </StyledItemCard>
    </ItemCardWrapper>
  );
};

export const TOOLTIP_ITEM_CARD_HEIGHT = 390;

const StayRoomDropdown = ({
  roomType,
  canSelectMoreRooms,
  selectedCount,
  className,
}: {
  roomType: StayBookingWidgetTypes.RoomType;
  canSelectMoreRooms: boolean;
  selectedCount: number;
  className?: string;
}) => {
  const [isInfomodalOpen, toggleInfoModal] = useToggle(false);
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const isMobile = useIsMobile();
  const isSelected = selectedCount > 0;
  const {
    roomTypeId,
    images,
    roomDetails,
    productSpecs,
    roomTypeName,
    roomOffers,
    fromPriceObject,
    totalPriceObject,
  } = roomType;
  return (
    <>
      <HeaderWrapper>
        <NameWrapper>
          {!isMobile && (
            <StyledInformationIconWrapper onClick={toggleInfoModal}>
              <StyledInformationIcon isSelected={isSelected} />
            </StyledInformationIconWrapper>
          )}
          <Name isSelected={isSelected}>{roomTypeName}</Name>
        </NameWrapper>
        <PriceWrapper>
          <StyledPrice
            price={getRoomTypePrice(fromPriceObject.price, roomType)}
            priceDisplayValue={
              isGTE
                ? totalPriceObject?.priceDisplayValue || fromPriceObject.priceDisplayValue
                : undefined
            }
            currency={isGTE ? fromPriceObject.currency : undefined}
            isTotal={isSelected}
            skipConvertingCurrency={isGTE}
            isSelected={isSelected}
          />
        </PriceWrapper>
      </HeaderWrapper>
      <StyledBookingWidgetDropdown
        id="roomDropdown"
        className={className}
        isSelected={isSelected}
        selectedTitle={`${selectedCount}x ${roomTypeName}`}
        Icon={RoomIcon}
      >
        <StyledExpandedInputContainer>
          {roomOffers.map((roomOffer, index) => {
            return (
              <StayRoomIncrementPicker
                key={`${String(index)}${roomOffer.roomOfferName}DropdownIncrementPicker`}
                room={roomOffer}
                roomTypeId={roomTypeId}
                canSelectMoreRooms={canSelectMoreRooms}
              />
            );
          })}
        </StyledExpandedInputContainer>
      </StyledBookingWidgetDropdown>
      {isInfomodalOpen && (
        <StayRoomModal
          modalId={`${roomTypeName}InfoModal`}
          onToggleModal={toggleInfoModal}
          modalTitle={roomTypeName}
        >
          <RoomInfoModalWrapper>
            <RoomDetails
              id={roomTypeId}
              roomTypeName={roomTypeName}
              images={images}
              productSpecs={productSpecs}
              roomDetails={roomDetails}
            />
          </RoomInfoModalWrapper>
        </StayRoomModal>
      )}
    </>
  );
};

export default StayRoomDropdown;
