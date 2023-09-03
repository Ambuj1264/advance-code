import React, { MouseEvent, useCallback, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import cover from "polished/lib/mixins/cover";

import ImageComponent from "../ImageComponent";
import FailedImagePlaceholder from "../Image/ImagePlaceholder";

import { mqIE } from "styles/base";
import { whiteColor } from "styles/variables";

export const ImageWrapper = styled.span<{
  useGradientOverlay?: boolean;
  isClickable: boolean;
}>(
  ({ useGradientOverlay, isClickable }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    &::after {
      content: "";
      background: ${useGradientOverlay
        ? `linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.5) 0%,
                rgba(0, 0, 0, 0) 35%
              )`
        : "transparent"};
      opacity: 0.5;
      ${cover()};
    }
    img {
      cursor: ${isClickable ? "pointer" : "default"};
    }
  `
);

const Button = styled.button([
  css`
    width: 100%;
    height: 100%;
  `,
]);

const ImageSlide = ({
  id,
  imageUrl,
  sizes,
  onClick,
  onImageLoad,
  useGradientOverlay,
  useAutoWidth = false,
  height,
  q,
  disableClick = false,
  imgixParams,
}: {
  id: string;
  imageUrl: Image;
  sizes: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onImageLoad?: () => void;
  useGradientOverlay?: boolean;
  useAutoWidth?: boolean;
  height?: number;
  q?: number;
  disableClick?: boolean;
  imgixParams?: SharedTypes.ImgixParams;
}) => {
  const defaultImgixParams = {
    crop: "faces,edges,center",
    auto: "format,compress",
    bg: whiteColor,
    q: q || 35,
    ...imgixParams,
  };
  const htmlAttributes = {
    alt: imageUrl.name,
    onLoad: onImageLoad || undefined,
  };
  const cssStyles = css`
    z-index: 1;
    width: ${useAutoWidth ? "auto" : "100%"};
    height: 100%;
    object-fit: cover;

    ${mqIE} {
      position: absolute;
      top: 50%;
      left: 50%;
      height: auto;
      transform: translate(-50%, -50%);
    }
  `;
  const [imageHasError, setImageHasError] = useState(false);
  const handleOnImageError = useCallback(() => {
    setImageHasError(true);
  }, []);

  return (
    <Button
      data-testid={`${id}Image`}
      onClick={disableClick ? undefined : onClick}
      disabled={disableClick}
    >
      <ImageWrapper
        useGradientOverlay={useGradientOverlay}
        data-image-wrapper
        isClickable={!disableClick}
      >
        {imageHasError ? (
          <FailedImagePlaceholder imageHeight={height} />
        ) : (
          <ImageComponent
            css={cssStyles}
            imageUrl={imageUrl.url}
            imgixSizes={sizes}
            backgroundColor="none"
            imageHtmlAttributes={htmlAttributes}
            height={height}
            imgixParams={defaultImgixParams}
            onImageError={handleOnImageError}
          />
        )}
      </ImageWrapper>
    </Button>
  );
};

export default ImageSlide;
