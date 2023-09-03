import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import {
  getIncludedMeal,
  getIncludedCancellation,
} from "./StayBookingWidget/utils/stayBookingWidgetUtils";
import StayRoomModal from "./StayRoomModal";
import StayRoomCardFooter from "./StayRoomCardFooter";
import StayRoomBanner from "./StayRoomBanner";
import { MealType, OrderStayCancellationType } from "./StayBookingWidget/types/enums";

import useToggle from "hooks/useToggle";
import ImageCarousel from "components/ui/ImageCarousel/ImageCarousel";
import { StyledEditIcon } from "components/features/VacationPackageProductPage/VPProductCardFooter";
import {
  borderRadius,
  borderRadiusTiny,
  gutters,
  whiteColor,
  blackColor,
  loadingBlue,
  breakpointsMin,
  borderRadiusCircle,
  borderRadiusSmall,
} from "styles/variables";
import { TileHeadline, TileProductCardWrapper } from "components/ui/Search/utils/sharedSearchUtils";
import { ProductSpecsStyled } from "components/ui/Search/TileProductCard";
import InformationIcon from "components/icons/information-circle.svg";
import { typographySubtitle1 } from "styles/typography";
import { QuickFact } from "components/ui/Information/ProductSpecs";
import { mqMin } from "styles/base";
import FileIcon from "components/icons/file-text-remove.svg";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useActiveLocale from "hooks/useActiveLocale";
import { SupportedCurrencies } from "types/enums";
import ImagePlaceholder from "components/ui/Image/ImagePlaceholder";

export const StyledTileProductCardWrapper = styled(TileProductCardWrapper)`
  min-height: 451px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: ${gutters.small / 2}px ${gutters.small}px 0 ${gutters.small}px;
`;

export const ProductTitle = styled(TileHeadline)`
  height: 48px;
  padding: 0 ${gutters.small / 4}px;
`;

export const StyledInformationIcon = styled(InformationIcon)`
  width: 20px;
  height: 20px;
`;

export const InfoButtonWrapper = styled.div<{
  isCardSelected: boolean;
  hasTopBanner: boolean;
}>(({ theme, isCardSelected, hasTopBanner }) => [
  typographySubtitle1,
  css`
    position: absolute;
    top: ${hasTopBanner ? gutters.small * 2 : gutters.small / 2}px;
    right: ${gutters.small / 2}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid ${borderRadiusTiny} ${whiteColor};
    border-radius: ${borderRadiusCircle};
    width: 24px;
    height: 24px;
    background-color: ${whiteColor};
    cursor: pointer;

    ${StyledInformationIcon} {
      fill: ${isCardSelected ? theme.colors.action : theme.colors.primary};
    }
  `,
]);

export const EditButtonWrapper = styled.div<{}>(({ theme }) => [
  typographySubtitle1,
  css`
    position: absolute;
    right: ${gutters.small / 2}px;
    bottom: ${gutters.small / 2}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid ${borderRadiusTiny} ${whiteColor};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background-color: ${theme.colors.action};
    cursor: pointer;
  `,
]);

export const Carousel = styled.div<{ hasSelectedBanner: boolean }>(
  ({ hasSelectedBanner }) => css`
    position: relative;
    border-radius: ${borderRadiusSmall} ${borderRadiusSmall} 0 0;
    height: 207px;
    background-color: ${loadingBlue};
    overflow: ${hasSelectedBanner ? "visible" : "hidden"};
    img {
      height: 207px;
    }
  `
);

export const BorderWrapper = styled.div<{
  isCardSelected: boolean;
  canSelectCard: boolean;
}>(({ isCardSelected, canSelectCard, theme }) => [
  css`
    margin-bottom: ${gutters.small / 4}px;
    border-radius: ${borderRadius};
    &:hover {
      cursor: ${canSelectCard ? "pointer" : "default"};
    }
    ${mqMin.large} {
      margin-bottom: 10px;
    }
    ${QuickFact} {
      svg {
        fill: ${theme.colors.primary};
      }
    }
  `,
  isCardSelected
    ? css`
        border: solid ${borderRadiusTiny} ${theme.colors.action};
        color: ${theme.colors.action};
        filter: drop-shadow(0 4px 4px ${rgba(blackColor, 0.25)});
        ${ProductTitle} {
          color: ${theme.colors.action};
        }
        ${QuickFact} {
          svg {
            fill: ${theme.colors.action};
          }
        }
      `
    : css`
        border: solid ${borderRadiusTiny} transparent;
      `,
]);

const RoomCard = ({
  id,
  title,
  images,
  priceDisplayValue,
  price,
  currency,
  productSpecs,
  editContent,
  infoContent,
  isCardSelected,
  onSelectCard,
  mealType,
  cancellationType,
  freeCancellationUntil,
  checkboxValue,
  className,
  imageSizes = `(min-width: ${breakpointsMin.max}px) ${(breakpointsMin.max * 3) / 12}px, 100vw`,
  isCheckboxFooter = false,
  skipFooter = false,
  isTotalPrice = true,
}: {
  id: string;
  title: string;
  images: Image[];
  priceDisplayValue?: string;
  price: number;
  currency?: SupportedCurrencies;
  productSpecs: SharedTypes.ProductSpec[];
  editContent?: React.ReactNode;
  infoContent: React.ReactNode;
  isCardSelected: boolean;
  onSelectCard: (id: string) => void;
  mealType?: MealType;
  cancellationType?: OrderStayCancellationType;
  freeCancellationUntil?: Date;
  checkboxValue: string;
  className?: string;
  imageSizes?: string;
  isCheckboxFooter?: boolean;
  skipFooter?: boolean;
  isTotalPrice?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.accommodationNs);
  const [isInfoModalActive, toggleInfoModal] = useToggle();
  const [editModalActive, toggleEditModal] = useToggle();
  const includedMeal = mealType ? getIncludedMeal(mealType, t)?.[0] : undefined;
  const includedCancellation = cancellationType
    ? getIncludedCancellation(activeLocale, t, cancellationType, freeCancellationUntil)?.[0]
    : undefined;
  const showCancellationBanner = includedCancellation !== undefined;
  const handleSelectCard = useCallback(() => {
    if (isCheckboxFooter) {
      onSelectCard(id);
    } else if (!isCardSelected) {
      onSelectCard(id);
    }
  }, [onSelectCard, id, isCheckboxFooter, isCardSelected]);
  const onInfoClickHandler = useCallback(
    e => {
      e.stopPropagation();
      toggleInfoModal();
    },
    [toggleInfoModal]
  );
  const onEditClickHandler = useCallback(
    e => {
      e.stopPropagation();
      toggleEditModal();
    },
    [toggleEditModal]
  );
  return (
    <>
      <BorderWrapper
        isCardSelected={isCardSelected}
        className={className}
        canSelectCard={!isCheckboxFooter}
      >
        <StyledTileProductCardWrapper onClick={handleSelectCard}>
          <div>
            <Carousel hasSelectedBanner={showCancellationBanner && isCardSelected}>
              {images.length > 0 ? (
                <ImageCarousel
                  id={id}
                  imageUrls={images}
                  showThumbnails={false}
                  sizes={imageSizes}
                  hideModalGallery
                  lazy
                />
              ) : (
                <ImagePlaceholder imageHeight={207} />
              )}
              <InfoButtonWrapper
                onClick={onInfoClickHandler}
                isCardSelected={isCardSelected}
                hasTopBanner={showCancellationBanner}
              >
                <StyledInformationIcon />
              </InfoButtonWrapper>
              {isCheckboxFooter && isCardSelected && editContent && (
                <EditButtonWrapper onClick={onEditClickHandler}>
                  <StyledEditIcon />
                </EditButtonWrapper>
              )}
              {includedMeal && (
                <StayRoomBanner
                  bannerContent={includedMeal.title}
                  Icon={includedMeal.Icon}
                  isSelected={isCardSelected && includedMeal.isIncluded}
                />
              )}
              {showCancellationBanner && (
                <StayRoomBanner
                  bannerContent={includedCancellation.title}
                  Icon={FileIcon}
                  isSelected={isCardSelected && includedCancellation.isIncluded}
                  isTopBanner
                />
              )}
            </Carousel>
            <TitleWrapper>
              <ProductTitle>{title}</ProductTitle>
            </TitleWrapper>
            {productSpecs.length > 0 && (
              <ProductSpecsStyled
                id={`productSpecs${constructUniqueIdentifier(title)}`}
                productSpecs={productSpecs.slice(0, 4)}
                fullWidth={false}
                predominantColor={isCardSelected ? "action" : "primary"}
              />
            )}
          </div>
          <StayRoomCardFooter
            price={price}
            priceDisplayValue={priceDisplayValue}
            currency={currency}
            className={className}
            checkboxValue={checkboxValue}
            isSelected={isCardSelected}
            roomTypeId={id}
            onSelectCard={handleSelectCard}
            isCheckbox={isCheckboxFooter}
            skipFooter={skipFooter}
            isTotalPrice={isTotalPrice}
            toggleEditModal={onEditClickHandler}
            editModalContent={editContent}
          />
        </StyledTileProductCardWrapper>
      </BorderWrapper>
      {isInfoModalActive && (
        <StayRoomModal
          modalId={`${id}InfoModal`}
          onToggleModal={toggleInfoModal}
          modalTitle={title}
        >
          {infoContent}
        </StayRoomModal>
      )}
      {editModalActive && editContent && (
        <StayRoomModal
          modalId={`${id}EditModal`}
          onToggleModal={toggleEditModal}
          onSubmit={toggleEditModal}
          modalTitle={title}
        >
          {editContent}
        </StayRoomModal>
      )}
    </>
  );
};

export default RoomCard;
