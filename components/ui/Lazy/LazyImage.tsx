import React, { AllHTMLAttributes, useMemo } from "react";
import Imgix from "react-imgix";
import { css, SerializedStyles } from "@emotion/core";
import styled from "@emotion/styled";

import { imageLoadingPixel } from "../utils/uiUtils";

import { loadingBlue } from "styles/variables";

export type Props = {
  className?: string;
  styles?: SerializedStyles;
  src: string;
  alt?: string;
  sizes?: string;
  width?: number;
  height?: number;
  imgixParams?: SharedTypes.ImgixParams;
  role?: string;
  title?: string;
  backgroundColor?: string;
  onImageError?: () => void;
  imageHtmlAttributes?: Pick<AllHTMLAttributes<HTMLImageElement>, "alt" | "onLoad">;
  lazy?: boolean;
};

const ImgixStyled = styled(Imgix, { shouldForwardProp: () => true })<
  {
    backgroundColor?: string;
  } & SharedTypes.ImgixProps
>(({ backgroundColor }) => [
  css`
    background: ${backgroundColor || loadingBlue};
    color: rgba(0, 0, 0, 0);
  `,
]);

const LazyImage = ({
  className,
  styles,
  src,
  sizes,
  width,
  height,
  imgixParams,
  alt = "",
  role,
  title,
  backgroundColor,
  onImageError,
  imageHtmlAttributes,
  lazy = true,
}: Props) => {
  const htmlAttributes: AllHTMLAttributes<HTMLImageElement> = imageHtmlAttributes || {
    alt,
    role,
    src: imageLoadingPixel,
    title,
  };

  // https://github.com/imgix/react-imgix#8x-to-90
  // since in v8.x fit:crop was always added by default, in v9.0 - it isn't
  const adjustedImgixParams = useMemo(
    () =>
      imgixParams?.fit
        ? imgixParams
        : {
            ...imgixParams,
            fit: "crop",
          },
    [imgixParams]
  );

  return (
    <>
      <ImgixStyled
        disableLibraryParam
        className={lazy ? `lazy-img lazyload ${className}` : className}
        css={styles}
        src={src}
        sizes={sizes}
        attributeConfig={
          lazy
            ? {
                src: "data-src",
                srcSet: "data-srcset",
                sizes: "data-sizes",
              }
            : undefined
        }
        htmlAttributes={{
          ...htmlAttributes,
          onError: onImageError || undefined,
        }}
        width={width}
        height={height}
        imgixParams={{ auto: "format,compress", ...adjustedImgixParams }}
        backgroundColor={backgroundColor}
        srcSetOptions={{
          devicePixelRatios: [1, 2, 3],
        }}
      />
      <noscript>
        <img
          alt={alt}
          className={`lazy-img lazyload ${className}`}
          src={`${src}${
            src.includes("graphassets")
              ? ""
              : `${src.includes("?") ? "&" : "?"}auto=format%2Ccompress&fit=crop&h=${height}`
          }`}
          width={width}
          height={height}
          title={title}
          onError={onImageError && onImageError}
        />
      </noscript>
    </>
  );
};

export default LazyImage;
