import React, { ElementType, useState, useRef, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { VPModalTitle } from "../VPProductCardModal";

import TravelStopModalSkeleton from "./TravelStopModalSkeleton";
import {
  ContentWrapper,
  Holster,
  ImagePulseSkeleton,
  ImageWrapper,
  StyledRow,
} from "./VPTravelStopModalShared";

import { lightBlueColor, fontWeightBold, fontSizeH5, gutters } from "styles/variables";
import Modal, {
  CloseButton,
  ModalContentWrapper,
  ModalHeader,
  TitleWrapper,
} from "components/ui/Modal/Modal";
import { mqMax, mqMin } from "styles/base";
import { ArrowButton } from "components/ui/ContentCarousel";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import CoverPicture from "components/ui/Cover/CoverPicture";
import { CoverVariant } from "types/enums";
import { sourceList } from "components/ui/ImageCarousel/ImageGalleryCarousel";
import Information from "components/ui/Information/Information";

export const StyledArrow = styled(ArrowButton)<{
  isBack?: boolean;
  isDisabled: boolean;
}>(({ isBack, isDisabled }) => [
  `
  display: ${isDisabled ? "none" : "block"};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${mqMin.large}{
    top: 375px;
  }
`,
  isBack
    ? css`
        left: 8px;
      `
    : css`
        right: 8px;
      `,
]);

export const StyledModalContentWrapper = styled(ModalContentWrapper)`
  ${mqMax.large} {
    display: flex;
    flex-flow: row nowrap;
    max-width: unset;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
  }
  ${mqMin.large} {
    position: relative;
  }
`;

const MobileTitle = styled.h5`
  min-height: 62px;
  padding: ${gutters.small}px 0;
  color: ${lightBlueColor};
  font-size: ${fontSizeH5};
  font-weight: ${fontWeightBold};
  text-align: center;
  ${mqMin.large} {
    display: none;
  }
`;

const StyledModalHeaderWithDesktopTitle = styled(ModalHeader)(
  () => css`
    ${mqMax.large} {
      ${TitleWrapper} {
        display: none;
      }
    }
  `
);

const MobileLoadHolster = styled(Holster)`
  padding: 0 ${gutters.small}px 0;
  ${mqMin.large} {
    display: none;
  }
`;

const MobileSwipeLoadSkeleton = () => {
  return (
    <MobileLoadHolster>
      <MobileTitle />
      <StyledRow>
        <ImageWrapper>
          <ImagePulseSkeleton />
        </ImageWrapper>
      </StyledRow>
      <TravelStopModalSkeleton />
    </MobileLoadHolster>
  );
};

const VPTravelStopModal = ({
  onToggleModal,
  modalTitle,
  modalIcon,
  modalContent,
  onSetNextContent,
  onSetPreviousContent,
  isCarouselDisabled,
  className,
  mobileBackButtonIcon,
}: {
  modalTitle: string;
  modalIcon: React.ElementType;
  onToggleModal: () => void;
  modalContent: TravelStopTypes.TravelStops;
  onSetNextContent: () => void;
  onSetPreviousContent: () => void;
  isCarouselDisabled: boolean;
  className?: string;
  mobileBackButtonIcon?: ElementType<SVGElement>;
}) => {
  const { image, description } = modalContent.info;
  const { productSpecs, isLoading } = modalContent;
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const isMobile = useIsMobile();

  const handleMobileSwipe = useCallback(() => {
    const { current: container } = modalContainerRef;
    const { current: content } = modalContentRef;

    if (isMobile && content && container) {
      const mobileContentWidth = content.offsetWidth * 2 + gutters.large * 4;

      if (hasScrolledIntoView && container.scrollLeft === mobileContentWidth) {
        onSetNextContent();
      }
      if (hasScrolledIntoView && container.scrollLeft <= gutters.small * 2) {
        onSetPreviousContent();
      }
    }
  }, [hasScrolledIntoView, isMobile, onSetNextContent, onSetPreviousContent]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const { current: container } = modalContainerRef;
    const { current: content } = modalContentRef;
    if (content && container && container.scrollWidth > 0) {
      content.scrollIntoView();
      content.scrollTo(0, 0);
      if (container.scrollLeft > gutters.small) {
        setHasScrolledIntoView(!!isMobile);
      }
      container.addEventListener("scroll", handleMobileSwipe);
      return () => container.removeEventListener("scroll", handleMobileSwipe);
    }
  }, [handleMobileSwipe, modalContainerRef?.current?.scrollWidth, isMobile]);

  const desktopTitle = { Icon: modalIcon, title: modalTitle };

  return (
    <Modal
      id="vpTravelStopModal"
      onClose={onToggleModal}
      variant="info"
      wide
      noMinHeight={false}
      className={className}
    >
      <StyledModalHeaderWithDesktopTitle
        rightButton={<CloseButton onClick={onToggleModal} />}
        title={<VPModalTitle modalTitle={desktopTitle} />}
        mobileBackButtonIcon={mobileBackButtonIcon}
      />
      <StyledModalContentWrapper ref={modalContainerRef}>
        <MobileSwipeLoadSkeleton />
        <Holster ref={modalContentRef}>
          <ContentWrapper>
            <MobileTitle>{isLoading ? "" : modalTitle}</MobileTitle>
            <StyledArrow isBack onClick={onSetPreviousContent} isDisabled={isCarouselDisabled} />
            <StyledRow>
              <ImageWrapper>
                {image && !isLoading ? (
                  <CoverPicture
                    key={`image-${image.id}`}
                    variant={CoverVariant.DEFAULT}
                    src={image.url}
                    height={270}
                    desktopHeight={350}
                    defaultWidth={410}
                    alt={image.name || ""}
                    flexibleHeight={false}
                    shouldResizeImage
                    customSourceList={sourceList}
                  />
                ) : (
                  <ImagePulseSkeleton />
                )}
              </ImageWrapper>
            </StyledRow>
            {description ? (
              <Information
                information={description || ""}
                productSpecs={productSpecs}
                id={`${modalContent.info.id}-destinationInfo`}
                autoExpand
              />
            ) : (
              <TravelStopModalSkeleton />
            )}
            <StyledArrow onClick={onSetNextContent} isDisabled={isCarouselDisabled} />
          </ContentWrapper>
        </Holster>
        <MobileSwipeLoadSkeleton />
      </StyledModalContentWrapper>
    </Modal>
  );
};

export default VPTravelStopModal;
