import React, { memo, useState } from "react";
import { none, Option, some } from "fp-ts/lib/Option";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import cover from "polished/lib/mixins/cover";

import ErrorBoundary from "../ErrorBoundary";

import CoverSkeleton from "./CoverSkeleton";
import CoverPicture from "./CoverPicture";

import CustomNextDynamic from "lib/CustomNextDynamic";
import ImageGallery from "components/ui/ImageCarousel/ImageGallery";
import ImageGalleryButton from "components/ui/ImageCarousel/ImageGalleryButton";
import AffiliateButtonContainer from "components/features/AffiliateButton/AffiliateButtonContainer";
import { borderRadius, greyBottomGradient, gutters, zIndex } from "styles/variables";
import { mediaQuery, mqMin } from "styles/base";
import { CoverVariant } from "types/enums";

export const DEFAULT_HEIGHT = 360;
export const TABLET_HEIGHT = 369;
export const DESKTOP_HEIGHT = 432;

const DEFAULT_IMAGE_WIDTH = 360;

const ImageThumbnails = CustomNextDynamic(() => import("../ImageCarousel/ImageThumbnails"), {
  ssr: false,
  loading: () => null,
});

export const CarouselContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  ${mqMin.large} {
    border-radius: ${borderRadius};
  }
`;

export const LeftContent = styled.div`
  position: absolute;
  bottom: ${gutters.small}px;
  left: ${gutters.small}px;
`;

export const LeftTopContent = styled.div`
  position: absolute;
  top: ${gutters.small}px;
  left: ${gutters.small}px;
`;

const RightContent = styled.div`
  position: absolute;
  right: ${gutters.small}px;
  bottom: ${gutters.small}px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
`;

export const RightTopContent = styled.div`
  position: absolute;
  top: ${gutters.small}px;
  right: ${gutters.small}px;
  bottom: auto;
  z-index: ${zIndex.z10};
`;

export const RightBottomContent = styled.div`
  position: absolute;
  top: auto;
  right: ${gutters.small}px;
  bottom: ${gutters.small}px;
  z-index: ${zIndex.z10};
`;

export const coverHeightStyles = ({
  variant,
  coverHeight,
}: {
  variant?: CoverVariant;
  coverHeight: number;
}) =>
  variant === CoverVariant.HERO
    ? mediaQuery({
        minHeight: [coverHeight / 2, coverHeight],
      })
    : css`
        min-height: ${coverHeight}px;
      `;

export const CoverWrapper = styled.div<{
  variant?: CoverVariant;
  coverHeight: number;
}>([
  css`
    position: relative;
  `,
  ({ variant, coverHeight }) => coverHeightStyles({ variant, coverHeight }),
]);

const AffiliateButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const RightContentWrapper = styled.div<{ showGallery: boolean }>(
  ({ showGallery }) =>
    css`
      margin-bottom: ${showGallery ? gutters.small / 2 : 0}px;
      pointer-events: auto;
      ${mqMin.desktop} {
        margin-bottom: 0;
      }
    `
);

export const CoverImageWrapper = styled.div<{
  variant?: CoverVariant;
  coverHeight: number;
  disabled?: boolean;
  showShadow?: boolean;
}>([
  css`
    height: 100%;
  `,
  ({ showShadow }) =>
    showShadow &&
    css`
      &::after {
        content: "";
        background: ${greyBottomGradient};
        opacity: 0.6;
        ${cover()};
      }
    `,
  ({ disabled }) =>
    disabled
      ? css`
          opacity: 0.5;
        `
      : undefined,
]);

const Cover = ({
  id,
  affiliateURl,
  imageUrls,
  leftContent,
  leftTopContent,
  rightContent,
  rightTopContent,
  ribbonComponent,
  headerComponent,
  height = DEFAULT_HEIGHT,
  desktopHeight,
  variant = CoverVariant.DEFAULT,
  className,
  flexibleHeight = false,
  crop,
  responsiveThumbnails,
  reduceMobileQuality,
  alt = "",
  isLazy,
  loading = false,
  disabled = false,
  shouldResizeImage = true,
  showShadow = true,
  shouldKeepQueryParams,
  gteFrontPageMobileImageUrl,
}: {
  id?: string;
  height?: number;
  desktopHeight?: number;
  affiliateURl?: string;
  imageUrls: Image[];
  leftContent?: React.ReactNode;
  leftTopContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  rightTopContent?: React.ReactNode;
  headerComponent?: React.ReactNode;
  ribbonComponent?: React.ReactNode;
  variant?: CoverVariant;
  className?: string;
  flexibleHeight?: boolean;
  crop?: string;
  responsiveThumbnails?: SharedTypes.ResponsiveThumbnails;
  reduceMobileQuality?: boolean;
  alt?: string;
  isLazy?: boolean;
  loading?: boolean;
  disabled?: boolean;
  shouldResizeImage?: boolean;
  showShadow?: boolean;
  shouldKeepQueryParams?: boolean;
  gteFrontPageMobileImageUrl?: string;
}) => {
  const [galleryImageIndex, setGalleryImageIndex] = useState<Option<number>>(none);

  if (loading) return <CoverSkeleton className={className} coverHeight={height} />;

  const redactedImageUrls = imageUrls.filter(image => !image.url.includes("-gif"));

  if (!redactedImageUrls.length) {
    return null;
  }

  const isSingleImage = redactedImageUrls.length === 1;
  const showGallery = Boolean(responsiveThumbnails) && !isSingleImage;
  const imageSrc = shouldKeepQueryParams
    ? redactedImageUrls[0].url
    : redactedImageUrls[0].url.split("?")[0];
  const pictureAlt = alt || redactedImageUrls[0].name || "";

  return (
    <ErrorBoundary>
      <CoverWrapper
        className={className}
        suppressHydrationWarning
        id={id}
        variant={variant}
        coverHeight={height}
      >
        <CarouselContainer {...(id ? { id: `coverCarousel${id}` } : {})}>
          <CoverImageWrapper
            onClick={() => setGalleryImageIndex(some(0))}
            disabled={disabled}
            showShadow={showShadow}
            coverHeight={height}
          >
            <CoverPicture
              variant={variant}
              src={imageSrc}
              defaultWidth={DEFAULT_IMAGE_WIDTH}
              height={height}
              desktopHeight={desktopHeight}
              reduceMobileQuality={reduceMobileQuality}
              crop={crop}
              alt={pictureAlt}
              isLazy={isLazy}
              flexibleHeight={flexibleHeight}
              shouldResizeImage={shouldResizeImage}
              gteFrontPageMobileImageUrl={gteFrontPageMobileImageUrl}
            />
          </CoverImageWrapper>
          {showGallery && (
            <ImageThumbnails
              variant={variant}
              onClick={thumbnailIndex => setGalleryImageIndex(some(thumbnailIndex))}
              imageUrls={responsiveThumbnails ? redactedImageUrls : redactedImageUrls.slice(0, 5)}
              responsiveThumbnails={responsiveThumbnails}
            />
          )}
          {showGallery && (
            <ImageGallery
              images={redactedImageUrls}
              onClose={() => setGalleryImageIndex(none)}
              photoIndex={galleryImageIndex}
            />
          )}
        </CarouselContainer>
        {headerComponent}
        <div>{ribbonComponent}</div>
        {leftTopContent && <LeftTopContent>{leftTopContent}</LeftTopContent>}
        {leftContent && <LeftContent>{leftContent}</LeftContent>}
        <RightContent>
          <RightContentWrapper showGallery={showGallery}>{rightContent}</RightContentWrapper>
          {showGallery && (
            <ImageGalleryButton id="amp" responsiveThumbnails={responsiveThumbnails} />
          )}
        </RightContent>
        {rightTopContent && <RightTopContent>{rightTopContent}</RightTopContent>}
        {affiliateURl && (
          <AffiliateButtonWrapper>
            <AffiliateButtonContainer url={affiliateURl} />
          </AffiliateButtonWrapper>
        )}
      </CoverWrapper>
    </ErrorBoundary>
  );
};

export default memo(Cover);
