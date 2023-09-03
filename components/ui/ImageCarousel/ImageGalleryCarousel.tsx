import React, { useState, useCallback, useMemo } from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import ArrowRight from "@travelshift/ui/icons/arrow.svg";
import cover from "polished/lib/mixins/cover";
import { some } from "fp-ts/lib/Option";

import CoverPicture, { SourceList } from "../Cover/CoverPicture";
import { ProductLabelWrapper } from "../ProductLabels/ProductLabels";

import SliderExt from "./SliderExt";
import { useOnSliderInteracted } from "./sliderExtHooks";

import { isBrowser } from "utils/helperUtils";
import useEffectOnce from "hooks/useEffectOnce";
import AffiliateButtonContainer from "components/features/AffiliateButton/AffiliateButtonContainer";
import ImageGallery from "components/ui/ImageCarousel/ImageGallery";
import { mqMin } from "styles/base";
import {
  boxShadowTileRegular,
  whiteColor,
  zIndex,
  lightGreyColor,
  greyColor,
  blackColor,
  borderRadius,
  greyTopAndBottomGradient,
  gutters,
  loadingBlue,
} from "styles/variables";
import ErrorBoundary from "components/ui/ErrorBoundary";
import { CoverVariant } from "types/enums";

export const Wrapper = styled.div`
  position: relative;
  margin: 0 ${gutters.small}px;
  .slick-list {
    border-radius: ${borderRadius};
    height: 210px;
    ${mqMin.large} {
      height: 359px;
    }
  }
  ${mqMin.large} {
    margin: 0;
  }
`;

const CoverImageWrapper = styled.div<{
  shouldShowModalGallery: boolean;
  disabled?: boolean;
  backgroundColor?: string;
}>(({ disabled = false, shouldShowModalGallery, backgroundColor = loadingBlue }) => [
  css`
    position: relative;
    height: 100%;
    overflow: hidden;
    &::after {
      content: "";
      background: ${greyTopAndBottomGradient};
      opacity: 0.5;
      ${cover()};
    }
    img {
      background-color: ${backgroundColor};
    }
  `,
  disabled &&
    css`
      opacity: 0.5;
    `,
  shouldShowModalGallery && !disabled
    ? css`
        &:hover {
          cursor: pointer;
        }
      `
    : "",
]);

const RightTopContent = styled.div`
  position: absolute;
  top: ${gutters.small}px;
  right: ${gutters.small}px;
`;

const RightBottomContent = styled.div`
  position: absolute;
  right: ${gutters.small}px;
  bottom: ${gutters.small}px;
`;

const LeftTopContent = styled.div`
  position: absolute;
  top: ${gutters.small}px;
  left: ${gutters.small}px;
`;

const LeftBottomContent = styled.div`
  position: absolute;
  bottom: ${gutters.small}px;
  left: ${gutters.small}px;

  ${ProductLabelWrapper} {
    min-width: 100%;
    line-height: inherit;
  }
`;

const ArrowIcon = styled(ArrowRight, { shouldForwardProp: () => false })<{
  isBack: boolean;
  isDisabled: boolean;
}>(
  ({ isBack, isDisabled }) =>
    css`
      position: absolute;
      top: 0;
      right: ${isBack ? 16 : 12}px;
      bottom: 0;
      left: ${isBack ? 12 : 16}px;
      margin: auto;
      width: 12px;
      height: auto;
      transform: rotate(${isBack ? "180deg" : "0deg"});
      fill: ${isDisabled ? rgba(greyColor, 0.5) : whiteColor};
    `
);

const getArrowPosition = (isBack: boolean, isRight: boolean) => {
  if (isRight && isBack) return "unset";
  if (isRight) return "0px";
  if (isBack) return "0px";
  return "unset";
};

const ArrowButtonWrapper = styled.div<{
  isBack: boolean;
  isDisabled: boolean;
}>(({ isBack, isDisabled }) => [
  css`
    position: absolute;
    top: calc(50% - 30px);
    right: ${getArrowPosition(isBack, true)};
    left: ${getArrowPosition(isBack, false)};
    z-index: ${zIndex.z2};
    display: flex;
    align-items: center;
    box-shadow: ${boxShadowTileRegular};
    border-radius: ${isBack
      ? `0 ${borderRadius} ${borderRadius} 0`
      : `${borderRadius} 0 0 ${borderRadius}`};
    width: 40px;
    height: 40px;
    background-color: ${rgba(blackColor, 0.5)};
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    &:hover {
      background-color: ${rgba(blackColor, 0.7)};
    }
  `,
  isDisabled &&
    `
    background-color: ${lightGreyColor};
    cursor: default;
    &:hover {
      background-color: ${lightGreyColor};
    }
`,
]);

const AffiliateButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

export const sourceList: SourceList[] = [
  {
    minWidth: 920,
    width: 920,
    type: "desktop",
  },
  {
    minWidth: 860,
    width: 860,
  },
  {
    minWidth: 567,
    width: 567,
  },
];

const ArrowButton = ({
  isBack = false,
  onClick,
  isDisabled,
}: {
  isBack?: boolean;
  onClick?: () => void;
  isDisabled: boolean;
}) => {
  return (
    <ArrowButtonWrapper
      isBack={isBack}
      onClick={isDisabled ? undefined : onClick}
      isDisabled={isDisabled}
    >
      <ArrowIcon isBack={isBack} isDisabled={isDisabled} />
    </ArrowButtonWrapper>
  );
};

const ImageGalleryCarousel = ({
  images = [],
  fallBackImg,
  shouldLoop = true,
  leftBottomContent,
  leftTopContent,
  rightBottomContent,
  rightTopContent,
  affiliateURl,
  className,
  isFullWidth = true,
  isDisabled,
  crop,
  shouldShowModalGallery = true,
  backgroundColor,
}: {
  images?: ImageWithSizes[];
  fallBackImg?: ImageWithSizes;
  leftBottomContent?: React.ReactNode;
  leftTopContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
  rightTopContent?: React.ReactNode;
  affiliateURl?: string;
  className?: string;
  shouldLoop?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  crop?: string;
  shouldShowModalGallery?: boolean;
  backgroundColor?: string;
}) => {
  const totalImages = images.length;
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { onGalleryInteraction, slickInstance } = useOnSliderInteracted();
  const [slidesToShow, setSlidesToShow] = useState(totalImages > 0 ? [images[0]] : []);

  useEffectOnce(() => setSlidesToShow(images));

  const settings = useMemo(
    () => ({
      outerRef: slickInstance,
      initialSlide: currentImageIndex,
      arrows: totalImages > 1,
      infinite: shouldLoop,
      draggable: false,
      speed: 500,
      slidesToShow: 1,
      lazyLoad: isBrowser ? ("ondemand" as const) : undefined,
      swipe: true,
      accessibility: false,
      nextArrow: <ArrowButton isDisabled={currentImageIndex >= totalImages && !shouldLoop} />,
      prevArrow: <ArrowButton isBack isDisabled={currentImageIndex <= 1 && !shouldLoop} />,
    }),
    [currentImageIndex, shouldLoop, slickInstance, totalImages]
  );

  const showModalGallery = useCallback((imageIndex: number) => {
    setShowGallery(true);
    setCurrentImageIndex(imageIndex);
  }, []);
  return (
    <ErrorBoundary>
      <Wrapper
        className={className}
        onMouseEnter={onGalleryInteraction}
        onTouchStart={onGalleryInteraction}
        suppressHydrationWarning
      >
        <SliderExt {...settings}>
          {slidesToShow.map((image, index) => {
            return (
              <CoverImageWrapper
                onClick={() => (shouldShowModalGallery ? showModalGallery(index) : undefined)}
                disabled={isDisabled}
                key={`wrapper-${image.id}`}
                shouldShowModalGallery={shouldShowModalGallery}
                backgroundColor={backgroundColor}
              >
                <CoverPicture
                  key={`image-${image.id}`}
                  variant={CoverVariant.DEFAULT}
                  src={image.url}
                  height={210}
                  desktopHeight={359}
                  defaultWidth={360}
                  alt={image.name || ""}
                  flexibleHeight={false}
                  shouldResizeImage={isFullWidth}
                  customSourceList={sourceList}
                  crop={crop}
                  fallBackImg={fallBackImg}
                />
              </CoverImageWrapper>
            );
          })}
        </SliderExt>
        {showGallery && totalImages > 0 && (
          <ImageGallery
            images={images}
            onClose={() => setShowGallery(false)}
            photoIndex={some(currentImageIndex)}
          />
        )}
        {rightTopContent && <RightTopContent>{rightTopContent}</RightTopContent>}
        {rightBottomContent && <RightBottomContent>{rightBottomContent}</RightBottomContent>}
        {leftTopContent && <LeftTopContent>{leftTopContent}</LeftTopContent>}
        {leftBottomContent && <LeftBottomContent>{leftBottomContent}</LeftBottomContent>}
        {affiliateURl && (
          <AffiliateButtonWrapper>
            <AffiliateButtonContainer url={affiliateURl} />
          </AffiliateButtonWrapper>
        )}
      </Wrapper>
    </ErrorBoundary>
  );
};

export default ImageGalleryCarousel;
