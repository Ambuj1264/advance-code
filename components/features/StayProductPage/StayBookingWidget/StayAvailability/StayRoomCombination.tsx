import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { getIncludedMeal, getIncludedCancellation } from "../utils/stayBookingWidgetUtils";

import { Name, HeaderWrapper, NameWrapper, PriceWrapper } from "./StayRoomDropdown";
import StayRoomCombinationAvailability from "./StayRoomCombinationAvailability";
import { Separator } from "./StayRoomType";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Trans, useTranslation } from "i18n";
import { blackColor, borderRadius, greyColor, gutters, whiteColor } from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import BookingWidgetDropdown, {
  DisplayWrapper,
} from "components/ui/BookingWidget/BookingWidgetDropdown";
import Price from "components/ui/BookingWidget/Price/Price";
import { Price as PriceItem } from "components/ui/BookingWidget/Price/PriceItem";
import RoomIcon from "components/icons/bedroom-hotel.svg";
import { ExpandedInputContainer } from "components/ui/RoomAndGuestPicker/DesktopRoomAndGuestPicker";
import { DropdownContainer, ArrowIcon, DisplayValue } from "components/ui/Inputs/ContentDropdown";
import { Namespaces } from "shared/namespaces";
import useActiveLocale from "hooks/useActiveLocale";
import { gteImgixUrl } from "utils/imageUtils";

export const StyledExpandedInputContainer = styled(ExpandedInputContainer)`
  margin: ${gutters.small}px ${gutters.small}px 0px ${gutters.small}px;
  max-height: 340px;
`;

const Wrapper = styled.div<{ isInModal?: boolean }>(
  ({ isInModal = false }) => css`
    margin: ${isInModal ? 0 : gutters.large}px -${gutters.large}px 0 -${gutters.large}px;
    padding: 0 ${gutters.large}px;
    ${mqMax.large} {
      margin: ${gutters.small}px -${gutters.small}px 0 -${gutters.small}px;
      padding: 0 ${gutters.small}px;
    }
  `
);

const StyledBookingWidgetDropdown = styled(BookingWidgetDropdown)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => css`
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

const StyledSeparator = styled(Separator)`
  ${mqMin.large} {
    margin: 0 -${gutters.large}px 0 -${gutters.large}px;
  }
`;

const StyledMobileSectionHeading = styled(MobileSectionHeading)`
  ${mqMin.large} {
    margin: 0 -${gutters.large}px;
  }
`;
const StayRoomCombination = ({
  roomCombination,
  isInModal = false,
  onRoomCombinationSelect,
  isVP = false,
  isLoading = false,
}: {
  roomCombination: StayBookingWidgetTypes.RoomCombination;
  isInModal?: boolean;
  onRoomCombinationSelect: (roomCombinationId: string, availabilityId: string) => void;
  isVP?: boolean;
  isLoading?: boolean;
}) => {
  const isMobile = useIsMobile();
  const selectedAvailability = roomCombination.availabilities.find(
    availability => availability.isSelected
  );
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.accommodationNs);
  const defaultRoomImage: Image = {
    id: "roomDefaultImage",
    url: `${gteImgixUrl}/RrDTdjyRfuJRTgnDpxch`,
  };
  const includedMeal = selectedAvailability?.mealType
    ? getIncludedMeal(selectedAvailability!.mealType, t)?.[0].shortTitle ?? ""
    : "";
  const includedCancellation = selectedAvailability?.cancellationType
    ? getIncludedCancellation(
        activeLocale,
        t,
        selectedAvailability!.cancellationType,
        selectedAvailability!.freeCancellationUntil
      )?.[0].shortTitle ?? ""
    : "";
  const title =
    includedMeal || includedCancellation
      ? `${includedMeal}${includedMeal && includedCancellation ? " + " : ""}${includedCancellation}`
      : "";
  const cheapestOffer = roomCombination.availabilities.reduce(
    (lowestPriceOffer, currentAvailability) => {
      return currentAvailability.priceObject.price < lowestPriceOffer.priceObject.price
        ? currentAvailability
        : lowestPriceOffer;
    },
    roomCombination.availabilities[0] as StayBookingWidgetTypes.RoomCombinationAvailability
  );
  if (isMobile || isInModal) {
    return (
      <>
        <StyledMobileSectionHeading>
          <Trans ns={Namespaces.accommodationNs}>{roomCombination.title}</Trans>
        </StyledMobileSectionHeading>
        <Wrapper isInModal>
          {roomCombination.availabilities.map((availability, index) => {
            const imageIndex = index % roomCombination.images.length;
            const image =
              roomCombination.images.length > 0 && isInModal
                ? roomCombination.images[imageIndex]
                : defaultRoomImage;
            return (
              <Fragment
                key={`${String(roomCombination.title)}MobileBWRoomCombinationAvailability${String(
                  index
                )}`}
              >
                <StayRoomCombinationAvailability
                  availability={availability}
                  roomCombinationId={roomCombination.roomCombinationId}
                  onRoomCombinationSelect={onRoomCombinationSelect}
                  image={image}
                  isVP={isVP}
                  isLoading={isLoading}
                  isInModal={isInModal}
                />
                {index < roomCombination.availabilities.length - 1 && <StyledSeparator />}
              </Fragment>
            );
          })}
        </Wrapper>
      </>
    );
  }
  return (
    <Wrapper>
      <HeaderWrapper>
        <NameWrapper>
          <Name isSelected={Boolean(selectedAvailability)}>
            <Trans ns={Namespaces.accommodationNs}>{roomCombination.title}</Trans>
          </Name>
        </NameWrapper>
        <PriceWrapper>
          <StyledPrice
            price={
              selectedAvailability
                ? selectedAvailability.priceObject.price
                : cheapestOffer.priceObject.price
            }
            priceDisplayValue={
              selectedAvailability
                ? selectedAvailability.priceObject.priceDisplayValue
                : cheapestOffer.priceObject.priceDisplayValue
            }
            currency={
              selectedAvailability
                ? selectedAvailability.priceObject.currency
                : cheapestOffer.priceObject.currency
            }
            isTotal={selectedAvailability !== undefined}
            skipConvertingCurrency
            isSelected={Boolean(selectedAvailability)}
          />
        </PriceWrapper>
      </HeaderWrapper>
      <StyledBookingWidgetDropdown
        id="specialOffersDropdown"
        isSelected={selectedAvailability !== undefined}
        selectedTitle={selectedAvailability ? title : ""}
        Icon={RoomIcon}
      >
        <StyledExpandedInputContainer>
          {roomCombination.availabilities.map((availability, index) => {
            return (
              <StayRoomCombinationAvailability
                key={`${String(roomCombination.title)}MobileBWRoomCombinationAvailability${String(
                  index
                )}`}
                availability={availability}
                roomCombinationId={roomCombination.roomCombinationId}
                onRoomCombinationSelect={onRoomCombinationSelect}
                isVP={isVP}
                isLoading={isLoading}
                isInModal={isInModal}
              />
            );
          })}
        </StyledExpandedInputContainer>
      </StyledBookingWidgetDropdown>
      <Separator />
    </Wrapper>
  );
};

export default StayRoomCombination;
