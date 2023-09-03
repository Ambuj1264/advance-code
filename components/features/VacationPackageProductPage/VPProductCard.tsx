import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";
import { css, keyframes } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { useOnToggleModal } from "./contexts/VPStateHooks";
import VPProductCardModal from "./VPProductCardModal";
import VPProductCardFooter from "./VPProductCardFooter";
import { VPActiveModalTypes } from "./contexts/VPModalStateContext";

import { borderRadius, borderRadiusTiny, gutters, whiteColor, blackColor } from "styles/variables";
import { TileHeadline, TileProductCardWrapper } from "components/ui/Search/utils/sharedSearchUtils";
import CardHeader, { LeftBottomContent } from "components/ui/Search/CardHeader";
import { ProductSpecsStyled } from "components/ui/Search/TileProductCard";
import InformationIcon from "components/icons/information-circle.svg";
import { typographySubtitle1 } from "styles/typography";
import { QuickFact } from "components/ui/Information/ProductSpecs";
import { mqMin } from "styles/base";

const fadeInCard = keyframes`
  100% {
    opacity: 1;
  }
`;

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
}>(({ theme, isCardSelected }) => [
  typographySubtitle1,
  css`
    position: absolute;
    top: ${gutters.small / 2}px;
    right: ${gutters.small / 2}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid ${borderRadiusTiny} ${whiteColor};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background-color: ${whiteColor};

    ${StyledInformationIcon} {
      fill: ${isCardSelected ? theme.colors.action : theme.colors.primary};
    }
  `,
]);

export const BorderWrapper = styled.div<{
  isCardDisabled: boolean;
  isCardSelected: boolean;
  canSelectCard: boolean;
}>(({ isCardSelected, isCardDisabled, canSelectCard, theme }) => [
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
  !isCardDisabled
    ? css`
        opacity: 0;
        animation: ${fadeInCard} 0.3s ease-out forwards;
      `
    : "",
]);

const StyledCardHeader = styled(CardHeader)`
  ${LeftBottomContent} {
    bottom: 0;
  }
`;

const VPProductCard = ({
  productId,
  modalProductId,
  averageRating,
  reviewsCount,
  image,
  fallBackImg,
  imageHeight,
  useDefaultImageHeight,
  headline,
  productSpecs,
  onSelectCard,
  isCardSelected = false,
  infoModalContent,
  editModalContent,
  className,
  isCardDisabled = false,
  price,
  radioButtonValue,
  imageLeftBottomContent,
  imageLeftTopContent,
  imageBottomRightContent,
  includedFooterTextContent,
  editModalTitle,
  isFormEditModal = false,
  infoModalTitle,
  editModalId,
  infoModalId,
  includeReviews,
  customFooter,
  imgixParams,
  formError,
  onEditModalClose,
}: {
  productId: string;
  modalProductId?: string;
  averageRating?: number;
  reviewsCount?: number;
  image?: Image;
  fallBackImg?: ImageWithSizes;
  imageHeight?: number;
  useDefaultImageHeight?: boolean;
  imageLeftBottomContent?: React.ReactNode;
  headline: string;
  productSpecs: SharedTypes.ProductSpec[];
  onSelectCard?: (productId: string) => void;
  isCardSelected?: boolean;
  infoModalContent: React.ReactNode;
  editModalContent?: React.ReactNode;
  className?: string;
  isCardDisabled?: boolean;
  price?: number;
  radioButtonValue?: string | number;
  imageLeftTopContent?: React.ReactNode;
  imageBottomRightContent?: React.ReactNode;
  includedFooterTextContent: string | React.ReactNode;
  editModalTitle?: { Icon: React.ElementType; title: string };
  isFormEditModal?: boolean;
  infoModalTitle?: { Icon: React.ElementType; title: string };
  includeReviews?: boolean;
  editModalId?: VPActiveModalTypes;
  infoModalId: VPActiveModalTypes;
  customFooter?: React.ReactNode;
  imgixParams?: SharedTypes.ImgixParams;
  formError?: string;
  onEditModalClose?: () => void;
}) => {
  const modalToggleProductId = modalProductId ?? productId;
  const [isInfoModalActive, toggleInfoModal] = useOnToggleModal(infoModalId, modalToggleProductId);
  const handleSelectCard = useCallback(() => {
    onSelectCard?.(productId);
  }, [onSelectCard, productId]);

  const onInfoClickHandler = useCallback(
    e => {
      e.stopPropagation();
      toggleInfoModal();
    },
    [toggleInfoModal]
  );

  return (
    <>
      <BorderWrapper
        isCardSelected={isCardSelected}
        className={className}
        isCardDisabled={isCardDisabled}
        canSelectCard={onSelectCard !== undefined}
      >
        <StyledTileProductCardWrapper onClick={handleSelectCard}>
          <div>
            <StyledCardHeader
              averageRating={averageRating}
              reviewsCount={reviewsCount}
              image={image}
              fallBackImg={fallBackImg}
              height={imageHeight}
              useDefaultImageHeight={useDefaultImageHeight}
              leftBottomContent={imageLeftBottomContent}
              leftTopContent={imageLeftTopContent}
              rightBottomContent={imageBottomRightContent}
              includeReviews={includeReviews}
              imgixParams={imgixParams}
            />
            {infoModalContent && !isCardDisabled && (
              <InfoButtonWrapper onClick={onInfoClickHandler} isCardSelected={isCardSelected}>
                <StyledInformationIcon />
              </InfoButtonWrapper>
            )}
            <TitleWrapper>
              <ProductTitle>{headline}</ProductTitle>
            </TitleWrapper>
            {productSpecs?.length > 0 && (
              <ProductSpecsStyled
                id={`productSpecs${constructUniqueIdentifier(headline)}`}
                productSpecs={productSpecs.slice(0, 4)}
                fullWidth={false}
                predominantColor={isCardSelected ? "action" : "primary"}
              />
            )}
          </div>
          {customFooter ||
            (editModalId && radioButtonValue ? (
              <VPProductCardFooter
                productId={modalToggleProductId}
                editModalId={editModalId}
                price={price}
                radioButtonValue={radioButtonValue}
                isSelected={isCardSelected}
                editModalContent={editModalContent}
                includedFooterTextContent={includedFooterTextContent}
                isCardDisabled={isCardDisabled}
                editModalTitle={editModalTitle}
                isFormEditModal={isFormEditModal}
                formError={formError}
                onModalClose={onEditModalClose}
              />
            ) : null)}
        </StyledTileProductCardWrapper>
      </BorderWrapper>
      {isInfoModalActive && infoModalContent !== undefined && (
        <VPProductCardModal
          modalContent={infoModalContent}
          modalId="infoVPCardModal"
          onToggleModal={toggleInfoModal}
          withModalFooter={false}
          isForm={false}
          modalTitle={infoModalTitle}
        />
      )}
    </>
  );
};

export default VPProductCard;
