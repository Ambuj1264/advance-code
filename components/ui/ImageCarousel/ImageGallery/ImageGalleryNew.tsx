import React, { useRef, useEffect, useCallback, useState, MouseEvent } from "react";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import Slider from "react-slick";
import CloseIcon from "@travelshift/ui/icons/close.svg";

import ImageCarouselArrow, { Direction } from "../ImageCarouselArrow";
import ImageSlide from "../ImageSlide";
import ImageThumbnail from "../ImageThumbnail";

import { mqMin } from "styles/base";
import { breakpointsMin, blackColor, gutters, whiteColor, greyColor } from "styles/variables";
import BaseModal from "components/ui/Modal/BaseModal";
import { useModalHistoryContext } from "contexts/ModalHistoryContext";

const thumbnailsContainerHeight = 150;

const CarouselContainer = styled.div`
  position: fixed;
  top: calc(50% - 75px);
  left: ${gutters.large}px;
  width: calc(100% - ${gutters.large * 2}px);
  height: calc(100% - 200px);
  transform: translateY(-50%);
`;

const ImageSlideWrapper = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const StyledCloseIcon = styled(CloseIcon)`
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const CloseButton = styled.button`
  position: fixed;
  top: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: ${rgba(blackColor, 0.1)};
`;

const StyledImageThumbnail = styled(ImageThumbnail)`
  margin-right: ${gutters.large}px;
  background: ${blackColor};
  img {
    transition: opacity 0.2s ease;
  }
`;

const StyledBaseModal = styled(BaseModal)`
  ${mqMin.large} {
    width: 100%;
    height: 100%;
  }
`;

const ThumbnailsContainer = styled.div<{ hideThumbnails: boolean }>(({ hideThumbnails }) => [
  css`
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: ${thumbnailsContainerHeight}px;
    padding: 0 ${gutters.large}px;
    background: ${rgba(blackColor, 0.7)};
    overflow-x: scroll;
  `,
  hideThumbnails &&
    css`
      ${StyledImageThumbnail} {
        pointer-events: none;
        opacity: 0.5;
        img {
          background: ${greyColor};
          opacity: 0.5;
        }
      }
    `,
]);

const id = "imageGalleryNew";

const ImageGalleryNew = ({
  images,
  onClose,
  setPhotoIndex,
  currentPhotoIndex,
}: {
  images: Image[];
  onClose: () => void;
  setPhotoIndex: (index: number) => void;
  currentPhotoIndex: number;
}) => {
  const { resetState } = useModalHistoryContext();
  const [isThumbnailsShown, setThumbnailsShown] = useState(false);
  const imageThumbnailRefs = useRef(images.map(() => React.createRef<HTMLDivElement>()));
  const settings = {
    initialSlide: currentPhotoIndex,
    arrows: true,
    infinite: true,
    draggable: false,
    speed: 300,
    slidesToShow: 1,
    lazyLoad: "progressive" as const,
    swipe: true,
    beforeChange: (_: number, next: number) => {
      setTimeout(() => setPhotoIndex(next), 0);
    },
    nextArrow: <ImageCarouselArrow id={`${id}NextImage`} direction={Direction.Right} inModal />,
    prevArrow: <ImageCarouselArrow id={`${id}PreviousImage`} direction={Direction.Left} inModal />,
  };
  const sliderRef = useRef<Slider>(null);
  useEffect(() => {
    // @ts-ignore Property 'innerSlider' does not exist on type 'Slider'.
    sliderRef?.current?.innerSlider.list.setAttribute("tabindex", 0);
    // @ts-ignore Property 'innerSlider' does not exist on type 'Slider'.
    sliderRef?.current?.innerSlider.list.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        sliderRef?.current?.slickGoTo(currentPhotoIndex - 1, true);
      }
      if (event.key === "ArrowRight") {
        sliderRef?.current?.slickGoTo(currentPhotoIndex + 1, true);
      }
    };
    document?.addEventListener("keydown", onKeyDown);
    const { current: currentThumbnail } = imageThumbnailRefs.current[currentPhotoIndex];
    if (currentThumbnail) {
      currentThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    return () => {
      document?.removeEventListener("keydown", onKeyDown);
    };
  }, [currentPhotoIndex, sliderRef]);

  const onCurrentImageLoad = useCallback(() => {
    setThumbnailsShown(true);
  }, [setThumbnailsShown]);

  const onSliderClose = useCallback(() => {
    setThumbnailsShown(false);
    resetState();
    onClose();
  }, [resetState, onClose, setThumbnailsShown]);

  const closeOnOutsideImageClick = (e: MouseEvent<HTMLButtonElement>): void => {
    const isTargetImageWrapper = (e.target as HTMLButtonElement).getAttribute("data-image-wrapper");

    if (isTargetImageWrapper) {
      onSliderClose();
      resetState();
    }
  };

  const imageSliderHeight =
    typeof window !== "undefined"
      ? window.innerHeight - (isThumbnailsShown ? thumbnailsContainerHeight : 0)
      : undefined;

  return (
    <StyledBaseModal id="imageGalleryNewModal" onClose={onSliderClose} isAnimationEnabled={false}>
      <>
        <CarouselContainer>
          <Slider ref={sliderRef} {...settings}>
            {images.map((imageUrl, imageIndex) => (
              <ImageSlideWrapper key={imageUrl.id}>
                <ImageSlide
                  onClick={closeOnOutsideImageClick}
                  onImageLoad={imageIndex === currentPhotoIndex ? onCurrentImageLoad : undefined}
                  id={`${imageIndex}${id}`}
                  imageUrl={imageUrl}
                  sizes={`(min-width: ${breakpointsMin.max}px) ${
                    (breakpointsMin.max * 8) / 12
                  }px, 100vw`}
                  useGradientOverlay={false}
                  useAutoWidth
                  height={imageSliderHeight}
                />
              </ImageSlideWrapper>
            ))}
          </Slider>
        </CarouselContainer>
        <CloseButton onClick={onSliderClose} id="closeImageGalleryButton">
          <StyledCloseIcon />
        </CloseButton>
        <ThumbnailsContainer hideThumbnails={!isThumbnailsShown}>
          {images.map((image, index) => (
            <div ref={imageThumbnailRefs.current[index]} key={`wrapper-${image.id}`}>
              <StyledImageThumbnail
                key={image.id}
                imageUrl={image}
                onClick={() => {
                  setPhotoIndex(index);
                  sliderRef?.current?.slickGoTo(index, true);
                }}
                isActive={index === currentPhotoIndex}
                index={index}
                width={150}
                height={100}
              />
            </div>
          ))}
        </ThumbnailsContainer>
      </>
    </StyledBaseModal>
  );
};

export default ImageGalleryNew;
