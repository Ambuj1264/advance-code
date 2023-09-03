import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { imageLoadingPixel } from "../utils/uiUtils";

import LandingPageCardOverlayCity from "./LandingPageCardOverlayCity";
import { CountryTitle, Country } from "./LandingPageCardOverlayShared";

import { borderRadiusTiny, whiteColor } from "styles/variables";
import PlaneIcon from "components/icons/plane-1.svg";

const CountryWithName = styled(Country)`
  max-width: 90%;
  background-color: ${rgba(0, 0, 0, 0.6)};
`;

const MultiCountry = styled(Country)`
  width: 68px;
`;

const planeIconStyles = css`
  height: 12px;
  fill: ${whiteColor};
`;

const FlagImage = styled.img`
  border-radius: ${borderRadiusTiny};
  width: auto;
  min-width: 24px;
  height: 16px;
  font-size: 8px;
  overflow: hidden;
`;

export const FlagComp = ({
  url,
  width,
  height,
  alt,
  shouldUseLazyImage = true,
}: {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  shouldUseLazyImage?: boolean;
}) => (
  <FlagImage
    width={width}
    height={height}
    alt={alt}
    src={shouldUseLazyImage ? imageLoadingPixel : url}
    data-src={shouldUseLazyImage ? url : undefined}
    className={shouldUseLazyImage ? "lazy-img lazyload" : undefined}
  />
);

const LandingPageCardOverlay = ({
  country,
  city,
  originFlag,
  destinationFlag,
  onRightSide = false,
  onBottom = false,
  allowSameFlag = false,
  className,
  shouldUseLazyImage,
}: {
  country?: string;
  city?: string;
  originFlag?: Image;
  destinationFlag?: Image;
  onRightSide?: boolean;
  onBottom?: boolean;
  allowSameFlag?: boolean;
  className?: string;
  shouldUseLazyImage?: boolean;
}) => {
  const isBothFlagAvailable = originFlag && destinationFlag;
  const isDifferentFlags = isBothFlagAvailable && originFlag!.id !== destinationFlag!.id;

  if (isBothFlagAvailable && (isDifferentFlags || allowSameFlag)) {
    return (
      <MultiCountry
        displayOnRightSide={onRightSide}
        displayOnBottom={onBottom}
        className={className}
      >
        <FlagComp shouldUseLazyImage={shouldUseLazyImage} {...originFlag!} />
        <PlaneIcon css={planeIconStyles} />
        <FlagComp shouldUseLazyImage={shouldUseLazyImage} {...destinationFlag!} />
      </MultiCountry>
    );
  }
  if (country && (destinationFlag || originFlag)) {
    return (
      <CountryWithName
        displayOnRightSide={onRightSide}
        displayOnBottom={onBottom}
        className={className}
      >
        {destinationFlag && (
          <FlagComp shouldUseLazyImage={shouldUseLazyImage} {...destinationFlag} />
        )}
        {originFlag && !destinationFlag && (
          <FlagComp shouldUseLazyImage={shouldUseLazyImage} url={originFlag.url} />
        )}
        <CountryTitle>{country}</CountryTitle>
      </CountryWithName>
    );
  }
  if (city) {
    return (
      <LandingPageCardOverlayCity
        city={city}
        onRightSide={onRightSide}
        onBottom={onBottom}
        className={className}
      />
    );
  }
  if (destinationFlag) {
    return (
      <Country displayOnRightSide={onRightSide} displayOnBottom={onBottom} className={className}>
        <FlagComp shouldUseLazyImage={shouldUseLazyImage} {...destinationFlag} />
      </Country>
    );
  }
  return null;
};

export default LandingPageCardOverlay;
