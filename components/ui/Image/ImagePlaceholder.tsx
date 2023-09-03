import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import LazyImage from "../Lazy/LazyImage";

import PlaceholderImageIcon from "components/icons/common-file-horizontal-image.svg";
import { loadingBlue } from "styles/variables";

export const PlaceholderImageWrapper = styled.span<{
  imageHeight?: number;
  imageWidth?: number;
  backgroundColor?: string;
}>(
  ({ imageHeight, imageWidth, backgroundColor }) =>
    css`
      display: flex;
      flex-direction: column;
      width: ${imageWidth ? `${imageWidth}px` : "auto"};
      max-width: 100%;
      height: ${imageHeight ? `${imageHeight}px` : "auto"};
      max-height: 100%;
      background-color: ${backgroundColor ?? loadingBlue};
    `
);

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
`;

const StyledPlaceholderImageIcon = styled(PlaceholderImageIcon)(
  ({ theme }) =>
    css`
      width: 50%;
      min-width: 24px;
      max-width: 80px;
      height: 50%;
      min-height: 24px;
      fill: ${theme.colors.primary};
    `
);

const ImagePlaceholder = ({
  className,
  imageHeight,
  imageWidth,
  backgroundColor,
  fallBackImg,
}: {
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
  backgroundColor?: string;
  fallBackImg?: ImageWithSizes;
}) => {
  return (
    <PlaceholderImageWrapper
      className={className}
      imageHeight={imageHeight}
      imageWidth={fallBackImg?.width ?? imageWidth}
      backgroundColor={backgroundColor === "none" ? "transparent" : backgroundColor}
    >
      <IconContainer>
        {fallBackImg ? (
          <LazyImage
            src={fallBackImg.url ? fallBackImg.url.split("?")[0] : ""}
            alt={fallBackImg.name}
            width={fallBackImg.width ?? imageWidth}
            height={fallBackImg.height ?? imageHeight}
            imgixParams={{
              crop: "focalpoint",
              "fp-z": 1.14,
              "min-w": fallBackImg.width,
              bg: "#fff",
              fit: "clamp",
            }}
            lazy
          />
        ) : (
          <StyledPlaceholderImageIcon />
        )}
      </IconContainer>
    </PlaceholderImageWrapper>
  );
};

export default ImagePlaceholder;
