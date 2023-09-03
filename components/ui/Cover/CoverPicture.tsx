import React, { useRef, useState, memo, useMemo, useCallback } from "react";
import { Source, buildURL } from "react-imgix";
import Head from "next/head";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { last } from "fp-ts/lib/Array";
import { toUndefined } from "fp-ts/lib/Option";

import { getDeviceDpr } from "../utils/uiUtils";
import ImageComponent from "../ImageComponent";
import ImagePlaceholder from "../Image/ImagePlaceholder";

import { CoverVariant } from "types/enums";
import useEffectOnce from "hooks/useEffectOnce";
import { useGlobalContext } from "contexts/GlobalContext";
import { breakpointsMin } from "styles/variables";

export type SourceList = {
  minWidth: number;
  width: number;
  type?: "desktop" | "large";
};

// keep this sorted by minWidth in desc order
export const SOURCE_LIST_SORTED: SourceList[] = [
  {
    minWidth: breakpointsMin.desktop,
    width: 1392,
    type: "desktop",
  },
  {
    minWidth: breakpointsMin.large,
    width: 960,
    type: "large",
  },
  {
    minWidth: 720,
    width: 720,
  },
];

// keep this sorted by minWidth in desc order
const HERO_SOURCE_LIST_SORTED: SourceList[] = [
  {
    minWidth: breakpointsMin.desktop,
    width: 1038,
    type: "desktop",
  },
  {
    minWidth: breakpointsMin.medium,
    width: 282,
  },
];

const imageStyles = css`
  width: auto;
  height: auto;
  min-height: 200px;
  max-height: 100%;
`;

const StyledImg = styled.img<{ shouldResizeImage: boolean }>(({ shouldResizeImage }) =>
  shouldResizeImage
    ? css`
        height: 100%;
        object-fit: cover;
      `
    : imageStyles
);

const StyledLazyImageComponent = styled(ImageComponent, {
  shouldForwardProp: () => true,
})<{}>`
  min-height: 100%;
  & > img {
    object-fit: cover;
  }
`;

const StyledImagePlaceholder = styled(ImagePlaceholder)`
  margin: auto;
  height: 100%;
  background: none;
`;

const centeredWrapperStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  & > img {
    min-width: 220px;
    object-fit: cover;
  }
`;

export const StyledPicture = styled.picture([centeredWrapperStyles]);
const StyledWrapper = styled.div([centeredWrapperStyles]);

const CoverPicture = ({
  variant,
  src,
  height,
  desktopHeight,
  defaultWidth,
  alt,
  reduceMobileQuality,
  isLazy,
  flexibleHeight,
  crop,
  shouldResizeImage,
  customSourceList,
  fallBackImg,
  gteFrontPageMobileImageUrl,
}: {
  variant: CoverVariant;
  src: string;
  height: number;
  desktopHeight?: number;
  defaultWidth: number;
  alt: string;
  reduceMobileQuality?: boolean;
  isLazy?: boolean;
  flexibleHeight: boolean;
  crop?: string;
  shouldResizeImage: boolean;
  customSourceList?: SourceList[];
  fallBackImg?: ImageWithSizes;
  gteFrontPageMobileImageUrl?: string;
}) => {
  const [lazyCoverWidth, setCoverWidth] = useState(defaultWidth);
  const coverRef = useRef<HTMLDivElement>(null);
  const { isClientNavigation } = useGlobalContext();
  const dpr = getDeviceDpr(isClientNavigation.current || undefined);
  const [imageHasError, setImageHasError] = useState(false);
  const handleOnImageError = useCallback(() => {
    setImageHasError(true);
  }, []);

  useEffectOnce(() => {
    const width = coverRef.current?.offsetWidth;
    if (width && width > lazyCoverWidth) setCoverWidth(width);
  });

  const sourceList = variant === CoverVariant.HERO ? HERO_SOURCE_LIST_SORTED : SOURCE_LIST_SORTED;
  const finalSourceList = customSourceList || sourceList;
  const imgixSourceParams = {
    fit: "crop",
    crop: crop ?? "faces,entropy,center",
    auto: "format,compress",
    q: 35,
    "min-h": height,
    ...(!shouldResizeImage
      ? {
          fit: "fillmax",
        }
      : null),
  };
  const imgixImageParams = {
    ...imgixSourceParams,
    ...(reduceMobileQuality
      ? {
          q: 10,
          blur: 15,
        }
      : null),
  };

  const lazyImage = (
    <StyledWrapper ref={coverRef}>
      <StyledLazyImageComponent
        imageUrl={src}
        imgixParams={imgixImageParams}
        height={!flexibleHeight ? height : undefined}
        width={lazyCoverWidth}
        imageAlt={alt}
        onImageError={handleOnImageError}
        fallBackImg={fallBackImg}
      />
    </StyledWrapper>
  );

  const mobileImageUrl = useMemo(
    () => {
      return buildURL(gteFrontPageMobileImageUrl || src, {
        w: defaultWidth,
        dpr,
        ...(!flexibleHeight && { h: height }),
        ...imgixImageParams,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [src, gteFrontPageMobileImageUrl]
  );
  const lastSourceListElement = toUndefined(last(finalSourceList));
  const mobileImageMaxWidth = lastSourceListElement && lastSourceListElement.minWidth - 1;

  const staticPicture = (
    <StyledPicture ref={coverRef}>
      {finalSourceList.map(({ width, minWidth, type }) => {
        const finalHeight = type === "desktop" || type === "large" ? desktopHeight : height;
        const mediaAttributes = { media: `(min-width: ${minWidth}px)` };
        return (
          <Source
            key={width}
            height={finalHeight}
            width={width}
            src={src}
            imgixParams={imgixSourceParams}
            htmlAttributes={mediaAttributes}
            srcSetOptions={{ devicePixelRatios: [1, 2, 3] }}
          />
        );
      })}
      {!isClientNavigation.current && mobileImageMaxWidth && (
        <Head>
          <link
            rel="preload"
            as="image"
            href={mobileImageUrl}
            media={`(max-width: ${mobileImageMaxWidth}px)`}
          />
        </Head>
      )}
      <StyledImg
        src={mobileImageUrl}
        alt={alt}
        height={height}
        width={defaultWidth}
        shouldResizeImage={shouldResizeImage}
        onError={handleOnImageError}
      />
    </StyledPicture>
  );

  // eslint-disable-next-line no-nested-ternary
  return imageHasError ? (
    <StyledImagePlaceholder imageWidth={SOURCE_LIST_SORTED[0].width} fallBackImg={fallBackImg} />
  ) : isLazy ? (
    lazyImage
  ) : (
    staticPicture
  );
};

export default memo(CoverPicture);
