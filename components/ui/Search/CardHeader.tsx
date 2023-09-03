import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Wrapper } from "../ReviewSummary/ReviewSummaryScore";
import LandingPageCardOverlayCity from "../LandingPages/LandingPageCardOverlayCity";
import ImageComponent from "../ImageComponent";

import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import ProductLabelOverlay, { ProductLabelValue } from "components/ui/Search/ProductLabelOverlay";
import ReviewSummary from "components/ui/ReviewSummary/ReviewSummary";
import RibbonLabel from "components/ui/Search/RibbonLabel";
import { gutters, loadingBlue, borderRadiusSmall } from "styles/variables";

export const ImageWrapper = styled.div`
  position: relative;
`;

export const LazyImageWrapper = styled.div<{
  cssHeight?: number;
  isLoading?: boolean;
}>(({ cssHeight, isLoading }) => [
  isLoading &&
    css`
      background-color: ${loadingBlue};
    `,
  cssHeight &&
    css`
      height: ${cssHeight}px;
    `,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: ${borderRadiusSmall} ${borderRadiusSmall} 0 0;
      background: linear-gradient(360deg, rgba(0, 0, 0, 0) 56.89%, rgba(0, 0, 0, 0.25) 100%);
    }
  `,
]);

export const LazyImageComponentStyled = styled(ImageComponent)<{
  cssHeight?: number;
  width: number;
}>(({ cssHeight, width }) => [
  css`
    border-radius: ${borderRadiusSmall} ${borderRadiusSmall} 0 0;
    background: transparent;
    object-fit: cover;

    img {
      object-fit: cover;
    }
  `,
  cssHeight
    ? css`
        height: ${cssHeight}px;
      `
    : css`
        width: auto;
        min-width: 220px;
        max-width: ${width}px;
        height: auto;
      `,
]);

export const ProductLabelOverlayStyled = styled(ProductLabelOverlay)`
  top: -${gutters.small - gutters.small / 4}px;
`;

export const TopWidgetsWrapper = styled.div`
  position: absolute;
  top: ${gutters.small - gutters.small / 4}px;
  right: 0;
  left: ${gutters.small - gutters.small / 4}px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const StyledReviewSummary = styled(ReviewSummary)`
  ${Wrapper} {
    width: fit-container;
  }
`;

export const RibbonLabelStyled = styled(RibbonLabel)`
  position: static;
  margin-left: auto;

  height: 26px;
  line-height: 26px;
  ${StyledReviewSummary} + & {
    max-width: 50%;
  }
`;

const StyledSellOutLabel = styled(SellOutLabel)`
  max-width: 50%;
  line-height: 1.2;
`;

const StyledCity = styled(LandingPageCardOverlayCity)`
  top: auto;
  bottom: ${gutters.small / 2}px;
`;

export const LeftBottomContent = styled.div`
  position: absolute;
  right: 0;
  bottom: ${gutters.large}px;
  left: 0;
`;

export const RightBottomContent = styled.div`
  position: absolute;
  right: ${gutters.small / 2}px;
  bottom: ${gutters.small / 2}px;
`;

export const RightTopContent = styled.div`
  position: absolute;
  top: ${gutters.small / 2}px;
  right: ${gutters.small / 2}px;
`;

const LeftTopContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

// if the image width > default + delta, we will be applying the new width
const DEFAULT_IMG_WIDTH_DELTA = 50;

const CardHeader = ({
  className,
  height = 207,
  image,
  averageRating,
  reviewsCount,
  ribbonLabelText,
  productLabel,
  isLoading = false,
  imgixParams,
  children,
  isSellOut,
  useDefaultImageHeight = false,
  leftBottomContent,
  rightBottomContent,
  city,
  leftTopContent,
  rightTopContent,
  includeReviews = true,
  fallBackImg,
  defaultImageWidth = 380,
  shouldUseLazyImage,
}: {
  className?: string;
  height?: number;
  image?: Image;
  averageRating?: number;
  reviewsCount?: number;
  ribbonLabelText?: string;
  productLabel?: React.ReactNode;
  isLoading?: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  children?: ReactNode;
  isSellOut?: boolean;
  useDefaultImageHeight?: boolean;
  leftBottomContent?: React.ReactNode;
  rightBottomContent?: React.ReactNode;
  leftTopContent?: React.ReactNode;
  rightTopContent?: React.ReactNode;
  city?: string;
  includeReviews?: boolean;
  fallBackImg?: ImageWithSizes;
  defaultImageWidth?: number;
  shouldUseLazyImage?: boolean;
}) => {
  const hasReviews = Boolean(averageRating && reviewsCount && includeReviews);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [imageWidth, setImageWidth] = useState(defaultImageWidth);

  useEffect(() => {
    const width = wrapperRef.current?.offsetWidth;
    if (width && width > imageWidth + DEFAULT_IMG_WIDTH_DELTA) {
      setImageWidth(width);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageHeight = useDefaultImageHeight ? undefined : height;
  return (
    <ImageWrapper className={className} ref={wrapperRef} data-testid="imageWrapper">
      <LazyImageWrapper cssHeight={height} isLoading={isLoading}>
        {image && (
          <LazyImageComponentStyled
            imageUrl={image.url ? image.url.split("?")[0] : ""}
            imageAlt={image.name}
            width={imageWidth}
            imgixParams={{
              fit: "crop",
              crop: "focalpoint",
              h: height,
              "fp-z": 1.14,
              "min-w": imageWidth,
              ...imgixParams,
            }}
            height={imageHeight}
            cssHeight={imageHeight}
            fallBackImg={fallBackImg}
            lazy={shouldUseLazyImage}
          />
        )}
        {city && <StyledCity city={city} />}
      </LazyImageWrapper>
      <TopWidgetsWrapper>
        {hasReviews && (
          <StyledReviewSummary
            reviewTotalScore={averageRating!}
            reviewTotalCount={reviewsCount!}
            isLink={false}
          />
        )}
        {ribbonLabelText && productLabel ? (
          <ProductLabelOverlayStyled>{ribbonLabelText}</ProductLabelOverlayStyled>
        ) : (
          ribbonLabelText && !isLoading && <RibbonLabelStyled>{ribbonLabelText}</RibbonLabelStyled>
        )}
      </TopWidgetsWrapper>
      {leftBottomContent && <LeftBottomContent>{leftBottomContent}</LeftBottomContent>}
      {rightBottomContent && <RightBottomContent>{rightBottomContent}</RightBottomContent>}
      {leftTopContent && <LeftTopContent>{leftTopContent}</LeftTopContent>}
      {rightTopContent && <RightTopContent>{rightTopContent}</RightTopContent>}
      {productLabel && <ProductLabelValue>{productLabel}</ProductLabelValue>}
      {isSellOut && <StyledSellOutLabel />}
      {children}
    </ImageWrapper>
  );
};

export default CardHeader;
