import React, { MutableRefObject, useState } from "react";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import { useMediaQuery } from "react-responsive";
import styled from "@emotion/styled";
import { fromNullable } from "fp-ts/lib/Option";
// eslint-disable-next-line no-restricted-imports
import { LoaderComponent } from "next/dynamic";

import Player from "../Player";

import ImageCarouselArrow, { Direction } from "./ImageCarouselArrow";
import ImageSlide from "./ImageSlide";
import ImageGallery from "./ImageGallery";
import ImageGalleryButton from "./ImageGalleryButton";
import { useOnSliderInteracted } from "./sliderExtHooks";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { typographyCaptionSmall } from "styles/typography";
import {
  breakpointsMax,
  breakpointsMin,
  whiteColor,
  gutters,
  borderRadiusSmall,
  blackColor,
} from "styles/variables";
import LazyComponent from "components/ui/Lazy/LazyComponent";

const ImageThumbnails = CustomNextDynamic(() => import("./ImageThumbnails"), {
  ssr: false,
  loading: () => null,
});

const SliderExt = CustomNextDynamic(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => import("./SliderExt") as LoaderComponent<any>,
  {
    ssr: false,
    loading: () => null,
  }
);

type Props = {
  id: string;
  imageUrls: Image[];
  sizes: string;
  showThumbnails?: boolean;
  showArrows?: boolean;
  useGradientOverlay?: boolean;
  lazy?: boolean;
  showImageCaption?: boolean;
  videoUrls?: ReadonlyArray<string>;
  videoHeight?: number;
  height?: number;
  quality?: number;
  hideModalGallery?: boolean;
  className?: string;
  imgixParams?: SharedTypes.ImgixParams;
};

const settings = (
  imageUrls: Image[],
  showThumbnails: boolean,
  showArrows: boolean,
  onThumbnailClick: (thumbnailIndex: number) => void,
  id: string,
  isMobile: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slickInstance: MutableRefObject<any>
) => {
  const thumbnailClickHandler = (thumbnailIndex: number) => onThumbnailClick(thumbnailIndex);

  const appendDots = (dots: Array<React.ReactElement>) =>
    typeof window !== "undefined" && !isMobile ? (
      <ImageThumbnails onClick={thumbnailClickHandler} imageUrls={imageUrls}>
        {dots.slice(0, 5)}
      </ImageThumbnails>
    ) : null;

  return {
    outerRef: slickInstance,
    dots: showThumbnails,
    arrows: showArrows,
    infinite: true,
    draggable: false,
    speed: 500,
    slidesToShow: 1,
    lazyLoad: "ondemand" as const,
    swipe: true,
    appendDots,
    nextArrow: <ImageCarouselArrow id={`${id}NextImage`} direction={Direction.Right} />,
    prevArrow: <ImageCarouselArrow id={`${id}PreviousImage`} direction={Direction.Left} />,
    responsive: [
      {
        breakpoint: breakpointsMin.desktop,
        settings: { dots: false },
      },
    ],
  };
};

export const ImageSliderContainer = styled.div``;

const ImageCaption = styled.div([
  typographyCaptionSmall,
  css`
    position: absolute;
    bottom: ${gutters.small}px;
    left: ${gutters.small}px;
    display: flex;
    align-items: center;
    border-radius: ${borderRadiusSmall};
    padding: ${gutters.small / 2}px;
    background-color: ${rgba(blackColor, 0.4)};
    color: ${whiteColor};
  `,
]);

export const ImageSlideWrapper = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const ImageSlider = ({
  id,
  imageUrls,
  sizes,
  showThumbnails = false,
  showArrows = true,
  useGradientOverlay,
  setGalleryImageIndex,
  showImageCaption,
  videoUrls,
  videoHeight,
  hideModalGallery = false,
  className,
  height,
  quality,
  imgixParams,
}: Props & {
  setGalleryImageIndex: (index: number) => void;
}) => {
  const onThumbnailClick = (thumbnailIndex: number) => setGalleryImageIndex(thumbnailIndex);
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const { onGalleryInteraction, slickInstance } = useOnSliderInteracted();

  return (
    <ImageSliderContainer onMouseEnter={onGalleryInteraction} onTouchStart={onGalleryInteraction}>
      <SliderExt
        {...settings(
          imageUrls,
          showThumbnails,
          showArrows,
          onThumbnailClick,
          id,
          isMobile,
          slickInstance
        )}
      >
        {imageUrls.map((imageItem, imageIndex) => (
          <ImageSlideWrapper key={imageItem.url} className={className}>
            <ImageSlide
              id={`${imageIndex}${id}`}
              imageUrl={imageItem}
              sizes={sizes}
              onClick={() => setGalleryImageIndex(imageIndex)}
              useGradientOverlay={useGradientOverlay}
              disableClick={hideModalGallery}
              height={height}
              imgixParams={imgixParams}
              q={quality}
            />
            {showImageCaption && <ImageCaption>{imageItem.name}</ImageCaption>}
          </ImageSlideWrapper>
        ))}
        {videoUrls &&
          videoUrls.map(videoUrl => (
            <Player key={videoUrl} videoUrl={videoUrl} height={videoHeight} />
          ))}
      </SliderExt>
      {showThumbnails && <ImageGalleryButton id="amp" onClick={() => setGalleryImageIndex(0)} />}
    </ImageSliderContainer>
  );
};

const ImageCarousel = (props: Props) => {
  const { imageUrls, lazy = true, hideModalGallery = false } = props;
  const [galleryImageIndex, setGalleryImageIndex] = useState<number | undefined>(undefined);

  if (lazy) {
    return (
      <>
        <LazyComponent loadingElement={null}>
          <ImageSlider {...props} setGalleryImageIndex={setGalleryImageIndex} />
        </LazyComponent>
        {!hideModalGallery && (
          <ImageGallery
            images={imageUrls}
            onClose={() => setGalleryImageIndex(undefined)}
            photoIndex={fromNullable(galleryImageIndex)}
          />
        )}
      </>
    );
  }
  return (
    <>
      <ImageSlider {...props} setGalleryImageIndex={setGalleryImageIndex} />
      {!hideModalGallery && (
        <ImageGallery
          images={imageUrls}
          onClose={() => setGalleryImageIndex(undefined)}
          photoIndex={fromNullable(galleryImageIndex)}
        />
      )}
    </>
  );
};

export default ImageCarousel;
