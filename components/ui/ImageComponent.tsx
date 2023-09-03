import React, { AllHTMLAttributes, useCallback, useState } from "react";
import { SerializedStyles } from "@emotion/core";

import FailedImagePlaceholder from "./Image/ImagePlaceholder";

import useOnDidUpdate from "hooks/useOnDidUpdate";
import LazyImage from "components/ui/Lazy/LazyImage";

const ImageComponent = ({
  className,
  imageUrl,
  imageAlt,
  height,
  width,
  imageStyles,
  imgixParams,
  backgroundColor,
  onImageError,
  placeHolderImageHeight = 300,
  placeHolderImageWidth = 800,
  imgixSizes,
  imageHtmlAttributes,
  lazy = true,
  fallBackImg,
}: {
  className?: string;
  imageUrl?: string;
  imageAlt?: string;
  height?: number;
  width?: number;
  imageStyles?: SerializedStyles;
  imgixParams?: SharedTypes.ImgixParams;
  backgroundColor?: string;
  imgixSizes?: string;
  onImageError?: () => void;
  placeHolderImageHeight?: number;
  placeHolderImageWidth?: number;
  imageHtmlAttributes?: Pick<AllHTMLAttributes<HTMLImageElement>, "alt" | "onLoad" | "title">;
  lazy?: boolean;
  fallBackImg?: ImageWithSizes;
}) => {
  const [isBrokenImage, setIsBrokenImage] = useState(false);
  const handleOnImageError = useCallback(() => {
    if (onImageError) {
      onImageError();
      return;
    }
    setIsBrokenImage(true);
  }, [onImageError]);

  useOnDidUpdate(() => {
    if (imageUrl) {
      setIsBrokenImage(false);
    }
  }, [imageUrl]);

  if (!imageUrl) return null;
  return !isBrokenImage ? (
    <LazyImage
      className={className}
      src={imageUrl}
      height={height}
      width={width}
      styles={imageStyles}
      imgixParams={imgixParams}
      alt={imageAlt}
      sizes={imgixSizes}
      imageHtmlAttributes={imageHtmlAttributes}
      onImageError={handleOnImageError}
      lazy={lazy}
      backgroundColor={backgroundColor}
    />
  ) : (
    <FailedImagePlaceholder
      imageHeight={height ?? placeHolderImageHeight}
      imageWidth={width ?? placeHolderImageWidth}
      backgroundColor={backgroundColor}
      fallBackImg={fallBackImg}
    />
  );
};

export default ImageComponent;
