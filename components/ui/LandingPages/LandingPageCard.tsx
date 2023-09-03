import React from "react";
import styled from "@emotion/styled";

import TeaserTitleAndSvgIconOnly from "../Teaser/variants/TeaserTitleAndSvgIconOnly";

import LandingPageCardOverlay from "./LandingPageCardOverlay";

import { capitalize } from "utils/globalUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import TileProductCard, { StyledHeadline } from "components/ui/Search/TileProductCard";
import TeaserSideImageCard from "components/ui/Teaser/variants/TeaserSideImageCard";
import { mqMax, mqMin } from "styles/base";
import { gutters, teaserHeight } from "styles/variables";
import { TeaserVariant, GraphCMSDisplayType, PageType } from "types/enums";
import TeaserImageTitleOnly from "components/ui/Teaser/variants/TeaserImageTitleOnly";
import TeaserImageCardWithAction from "components/ui/Teaser/variants/TeaserImageCardWithAction";
import { useIsSmallDevice, useIsTabletStrict } from "hooks/useMediaQueryCustom";
import TGLandingGridCard from "components/features/TravelGuideLanding/TGLandingGridCard";

const StyledTeaserImageTitleOnly = styled(TeaserImageTitleOnly)`
  margin: ${gutters.small / 2}px ${gutters.small}px;
  &::before {
    background: linear-gradient(360deg, rgba(0, 0, 0, 0) 69.02%, rgba(0, 0, 0, 0.2) 100%),
      linear-gradient(0deg, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0) 45.44%);
  }
  ${mqMin.large} {
    margin: 0;
  }
`;

const StyledTeaserImageCardWithAction = styled(TeaserImageCardWithAction)`
  margin: ${gutters.small / 2}px ${gutters.small}px;
  ${mqMin.large} {
    margin: 0;
  }
`;

export const StyledTeaserSideImageCard = styled(TeaserSideImageCard)`
  margin: ${gutters.small / 2}px ${gutters.small}px;
  ${mqMin.large} {
    margin: 0;
  }
`;

const StyledTeaserTitleAndSVG = styled(TeaserTitleAndSvgIconOnly)`
  margin: ${gutters.small / 2}px ${gutters.small}px;
  ${mqMin.large} {
    margin: 0;
  }
`;

const StyledTGLandingGridCard = styled(TGLandingGridCard)`
  ${mqMax.large} {
    margin: 8px -8px 8px 16px;
  }
`;

const StyledTileProductCard = styled(TileProductCard)`
  margin: ${gutters.small / 2}px -${gutters.small / 2}px ${gutters.small / 2}px ${gutters.small}px;
  ${mqMin.large} {
    margin: 0;
    ${StyledHeadline} {
      padding: 0 ${gutters.large}px;
    }
  }
`;

export const LandingPageTileProductCardWithCurrency = ({
  isSmallDevice,
  clientRoute,
  cardContent,
  shouldUseLazyImage,
  useDivHeadline = false,
}: {
  isSmallDevice: boolean;
  clientRoute?: SharedTypes.ClientRoute;
  cardContent: LandingPageTypes.LandingPageSectionCard;
  shouldUseLazyImage?: boolean;
  useDivHeadline?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const {
    title,
    price,
    image,
    review,
    productProps,
    productSpecs,
    country,
    originFlag,
    destinationFlag,
  } = cardContent;

  return (
    <StyledTileProductCard
      headline={capitalize(title)}
      price={price ? convertCurrency(price) : 0}
      image={image}
      shouldUseLazyImage={shouldUseLazyImage}
      reviewsCount={review?.totalCount ?? 0}
      averageRating={review?.totalScore ?? 0}
      currency={currencyCode}
      isMobile={isSmallDevice}
      productProps={productProps || []}
      productSpecs={productSpecs || []}
      imageHeight={184}
      linkTarget=""
      clientRoute={clientRoute}
      imageLeftBottomContent={
        <LandingPageCardOverlay
          country={country}
          originFlag={originFlag}
          destinationFlag={destinationFlag}
          onBottom
        />
      }
      useDivHeadline={useDivHeadline}
    />
  );
};

const LandingPageCard = ({
  displayType,
  cardContent,
  title,
  clientRoute,
  className,
  shouldUseLazyImage,
  index,
}: {
  displayType: GraphCMSDisplayType;
  cardContent: LandingPageTypes.LandingPageSectionCard;
  title: string;
  clientRoute?: SharedTypes.ClientRoute;
  className?: string;
  shouldUseLazyImage?: boolean;
  index: number;
}) => {
  const {
    linkUrl,
    country,
    city,
    originFlag,
    destinationFlag,
    action,
    subtitle,
    smallTitle,
    image,
    pageType,
  } = cardContent;

  const isSmallDevice = useIsSmallDevice();
  const isTablet = useIsTabletStrict();
  const isLargeImage = displayType === GraphCMSDisplayType.LARGE_IMAGE;
  const styledTeaserWidth = (() => {
    if (isLargeImage) return 334;
    if (isTablet) return 254;
    if (isSmallDevice) return 174;
    return 218;
  })();
  switch (displayType) {
    case GraphCMSDisplayType.IMAGE:
    case GraphCMSDisplayType.LARGE_IMAGE:
      return (
        <StyledTeaserImageTitleOnly
          variant={TeaserVariant.IMAGE_TITLE_ONLY}
          url={linkUrl}
          title={title}
          smallTitle
          height={isLargeImage ? teaserHeight.large : teaserHeight.small}
          width={styledTeaserWidth}
          image={image}
          shouldUseLazyImage={shouldUseLazyImage}
          overlay={
            (country || city) && (
              <LandingPageCardOverlay
                country={country}
                city={city}
                originFlag={originFlag}
                destinationFlag={destinationFlag}
                shouldUseLazyImage={shouldUseLazyImage}
              />
            )
          }
        />
      );
    case GraphCMSDisplayType.IMAGE_WITH_ACTION:
      return (
        <StyledTeaserImageCardWithAction
          title={title}
          smallTitle={smallTitle}
          action={action}
          imageAlt={image.name}
          imageUrl={image.url}
          shouldUseLazyImage={shouldUseLazyImage}
          width={330}
          overlay={
            country && (
              <LandingPageCardOverlay
                originFlag={originFlag}
                destinationFlag={destinationFlag}
                shouldUseLazyImage={shouldUseLazyImage}
                onRightSide
              />
            )
          }
        />
      );
    case GraphCMSDisplayType.PRODUCT_CARD:
      return (
        <LandingPageTileProductCardWithCurrency
          clientRoute={clientRoute}
          cardContent={cardContent}
          isSmallDevice={isSmallDevice}
          shouldUseLazyImage={shouldUseLazyImage}
        />
      );
    case GraphCMSDisplayType.TG_CARD:
      return (
        <StyledTGLandingGridCard
          product={{
            id: index,
            ...cardContent,
            flag: cardContent.destinationFlag,
            headline: cardContent.title,
            clientRoute,
          }}
        />
      );
    case GraphCMSDisplayType.IMAGE_WITH_SVG_ICON:
      return (
        <StyledTeaserTitleAndSVG
          title={title}
          url={linkUrl}
          variant={TeaserVariant.IMAGE_TITLE_ONLY}
          height={isLargeImage ? teaserHeight.large : teaserHeight.small}
          pageType={pageType as PageType}
        />
      );
    default:
      return (
        <StyledTeaserSideImageCard
          title={capitalize(title)}
          subtitle={subtitle}
          imageAlt={image.name}
          imageUrl={image.url}
          shouldUseLazyImage={shouldUseLazyImage}
          overlay={
            <LandingPageCardOverlay
              destinationFlag={destinationFlag}
              shouldUseLazyImage={shouldUseLazyImage}
            />
          }
          className={className}
          imageHeight={image.height}
          imageWidth={image.width}
        />
      );
  }
};

export default LandingPageCard;
