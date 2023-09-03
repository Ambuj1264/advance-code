import React, { useState, useCallback } from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import isPropValid from "@emotion/is-prop-valid";

import ImagePlaceholder from "../Image/ImagePlaceholder";

import CoverThumbnailButton from "components/ui/Inputs/CoverThumbnailButton";
import { borderRadius, gutters, blackColor, whiteColor } from "styles/variables";
import LazyImage from "components/ui/Lazy/LazyImage";

type Props = {
  imageUrl: Image;
  isActive: boolean;
  onClick: (index: number) => void;
  index: number;
  width: number;
  height: number;
  className?: string;
};

type ThumbnailProps = {
  isActive: boolean;
  width: number;
  height: number;
};

const Wrapper = styled("div", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "width" && prop !== "height",
})<ThumbnailProps>(
  ({ isActive, width, height }) =>
    css`
      position: relative;
      display: inline-block;
      margin-right: ${gutters.small / 2}px;
      margin-left: ${gutters.small / 2}px;
      box-shadow: 0 0 0 1px ${isActive ? whiteColor : rgba(blackColor, 0.6)};
      border-radius: ${borderRadius};
      min-width: ${width}px;
      height: ${height}px;
      cursor: pointer;
      overflow: hidden;
      :hover {
        box-shadow: 0 0 0 1px ${whiteColor};
      }
    `
);

const ImageThumbnail = ({
  imageUrl,
  isActive,
  onClick,
  index,
  width,
  height,
  className,
}: Props) => {
  const [imageHasError, setImageHasError] = useState(false);
  const handleOnImageError = useCallback(() => {
    setImageHasError(true);
  }, []);

  return (
    <Wrapper isActive={isActive} width={width} height={height} className={className}>
      <CoverThumbnailButton onClick={() => onClick(index)} title={imageUrl.name}>
        {imageHasError ? (
          <ImagePlaceholder imageHeight={height} imageWidth={width} />
        ) : (
          <LazyImage
            src={imageUrl.url}
            width={width}
            height={height}
            alt={imageUrl.name}
            onImageError={handleOnImageError}
          />
        )}
      </CoverThumbnailButton>
    </Wrapper>
  );
};

export default ImageThumbnail;
