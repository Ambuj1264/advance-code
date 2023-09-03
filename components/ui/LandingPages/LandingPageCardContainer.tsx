import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { StyledTeaserImageCard } from "../Teaser/variants/TeaserImageCardWithAction";

import LandingPageCard from "./LandingPageCard";
import { getSectionLandingPageType, constructPlaceNames } from "./utils/landingPageUtils";

import TileItemCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import { typographyBody1, typographyH5 } from "styles/typography";
import {
  borderRadiusSmall,
  fontWeightBold,
  gutters,
  guttersPx,
  lightGreyColor,
  loadingBlue,
  teaserHeight,
  textColorLight,
  whiteColor,
} from "styles/variables";
import { mqMax, mqMin } from "styles/base";
import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import { urlToRelative } from "utils/apiUtils";
import { GraphCMSDisplayType } from "types/enums";
import { useTranslation } from "i18n";

const imageStyles = (isLargeImage: boolean) => css`
  ${typographyBody1};
  position: relative;
  display: flex;
  flex-direction: column;
  margin: ${gutters.small / 2}px;
  border-radius: ${borderRadiusSmall};
  height: ${isLargeImage ? teaserHeight.large : teaserHeight.small}px;
  padding-bottom: ${gutters.small / 2}px;
  background-color: ${lightGreyColor};
  color: ${textColorLight};
  font-weight: ${fontWeightBold};
  text-align: center;

  ${mqMin.large} {
    margin: 0;
  }
  ${mqMax.large} {
    width: 190px;
  }

  &::before {
    content: "";
    flex-grow: 1;
  }
`;

export const landingPageCardSkeletonStyles = {
  [GraphCMSDisplayType.PRODUCT_CARD]: TileItemCardSkeleton,
  [GraphCMSDisplayType.TG_CARD]: TileItemCardSkeleton,
  [GraphCMSDisplayType.IMAGE]: styled.h3(() => imageStyles(false)),
  [GraphCMSDisplayType.IMAGE_WITH_SVG_ICON]: styled.h3(() => imageStyles(false)),
  [GraphCMSDisplayType.LARGE_IMAGE]: styled.h3(() => imageStyles(true)),
  [GraphCMSDisplayType.IMAGE_WITH_ACTION]: styled(StyledTeaserImageCard)([
    typographyH5,
    css`
      padding-top: ${gutters.large + gutters.small / 4}px;
      padding-left: ${guttersPx.smallHalf};
      background-color: ${loadingBlue};
      color: ${whiteColor};

      /* stylelint-disable-next-line order/order */
      @supports (content: attr(title)) {
        font-size: 0;
        /* stylelint-disable-next-line selector-max-type */
        &::after {
          ${typographyH5};
          content: attr(title);
          position: relative;
          z-index: 1;
        }
      }
    `,
  ]),
  [GraphCMSDisplayType.SIDE_IMAGE]: styled.h3(
    ({ theme }) => css`
      display: flex;
      align-items: center;
      margin: ${gutters.small / 2}px;
      height: 67px;
      color: ${theme.colors.primary};

      ${mqMin.large} {
        margin: 0;
      }

      &::before {
        content: "";
        float: left;
        margin-right: ${gutters.large}px;
        border-radius: ${borderRadiusSmall};
        width: 26.5%;
        height: 67px;
        background-color: ${loadingBlue};
        ${mqMax.large} {
          width: 87px;
        }
      }
    `
  ),
};

const LandingPageCardContainer = ({
  cardContent,
  isVisible,
  displayType,
  disablePrefetch,
  shortTitle,
  className,
  shouldUseLazyImage,
  index,
}: {
  cardContent: LandingPageTypes.LandingPageSectionCard;
  isVisible?: boolean;
  displayType: GraphCMSDisplayType;
  disablePrefetch?: boolean;
  shortTitle?: string;
  className?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  key?: string;
  shouldUseLazyImage?: boolean;
  index: number;
}) => {
  const { t } = useTranslation();
  const { title, country, linkUrl, slug, pageType, prefetchParams } = cardContent;
  const placeNames = constructPlaceNames(
    cardContent?.origin,
    cardContent?.destination,
    cardContent?.subtype,
    cardContent?.pluralType,
    cardContent?.parentType,
    cardContent?.pluralParentType,
    cardContent?.subTypeModifier
  );
  const dynamicTitle = t(shortTitle || title, placeNames);
  const landingPageType = getSectionLandingPageType(pageType);
  const SkeletonComp = landingPageCardSkeletonStyles[displayType];
  const clientRoute = {
    query: {
      slug,
      country,
      ...prefetchParams,
    },
    as: urlToRelative(linkUrl),
    route: `/${landingPageType}`,
  };
  return (
    <ClientLinkPrefetch
      linkUrl={urlToRelative(linkUrl)}
      key={title}
      clientRoute={clientRoute}
      title={dynamicTitle}
      disablePrefetch={disablePrefetch}
      className={className}
    >
      {isVisible ? (
        <LandingPageCard
          displayType={displayType}
          cardContent={cardContent}
          title={dynamicTitle}
          clientRoute={clientRoute}
          className={className}
          shouldUseLazyImage={shouldUseLazyImage}
          index={index}
        />
      ) : (
        <SkeletonComp
          dangerouslySetInnerHTML={{
            // eslint-disable-next-line react/no-danger
            __html: dynamicTitle,
          }}
          title={dynamicTitle}
        />
      )}
    </ClientLinkPrefetch>
  );
};

export default memo(LandingPageCardContainer, (prevProps, nextProps) => {
  return prevProps.key === nextProps.key && prevProps.isVisible === nextProps.isVisible;
});
