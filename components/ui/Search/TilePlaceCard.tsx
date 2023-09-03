/* eslint-disable react/no-danger */
import React, { ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { Leaf, Wrapper } from "../ReviewSummary/ReviewSummaryScore";

import {
  Address,
  AddressIconWrapper,
  LinkWrapper,
  ListCardWrapper,
  TileHeadline,
  TopRightIconWrapper,
} from "./utils/sharedSearchUtils";
import { GridItemWrapper } from "./SearchList";

import { PageType } from "types/enums";
import { getProductSlugFromHref } from "utils/routerUtils";
import { urlToRelative } from "utils/apiUtils";
import { greyColor, gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import CardHeader from "components/ui/Search/CardHeader";
import { clampLines, mqIE, mqMin } from "styles/base";
import StyleThreePinNavigationLocation from "components/icons/style-three-pin-navigation-location-1.svg";

const StyledHeadline = styled(TileHeadline)`
  flex-grow: 1;
`;

const TileDescription = styled.div([
  clampLines(4),
  typographyBody2,
  css`
    margin: ${gutters.large / 2}px ${gutters.large}px;
    margin-top: 0;
    color: ${rgba(greyColor, 0.7)};
  `,
]);

const SkeletonLinkWrapper = styled.a`
  display: block;
  height: 334px;

  ${mqMin.medium} {
    height: 334px;
  }
`;

const ProductCardLinkHeadline = styled(LinkWrapper)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: ${gutters.small / 2}px ${gutters.small}px 0 ${gutters.small}px;
  height: 48px;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledCardHeader = styled(CardHeader)`
  ${Leaf} {
    width: 17px;
    min-width: 17px;

    ${mqIE} {
      height: 42px;
    }
  }

  ${Wrapper} {
    font-size: 20px;
  }
`;

const StyledListCardWrapper = styled(ListCardWrapper)`
  min-height: 334px;
`;

export const TilePlaceCardSSRSkeleton = ({
  linkUrl,
  headline,
  description,
}: {
  linkUrl: string;
  headline: string;
  description?: string;
}) => {
  return (
    <SkeletonLinkWrapper href={linkUrl}>
      <h3
        dangerouslySetInnerHTML={{
          __html: headline,
        }}
      />
      {description && <div>{description}</div>}
    </SkeletonLinkWrapper>
  );
};

const TilePlaceCard = ({
  linkUrl,
  linkTarget,
  headline,
  averageRating,
  reviewsCount,
  image,
  TopRightIcon,
  topRightBackground,
  description,
  address,
  clientRoute,
  imgixParams,
  isMobile,
  nofollow = false,
}: SharedTypes.PlaceProduct & {
  linkTarget?: string;
  TopRightIcon?: ElementType;
  topRightBackground?: string;
  clientRoute?: SharedTypes.ClientRoute;
  imgixParams?: SharedTypes.ImgixParams;
  isMobile: boolean;
  nofollow?: boolean;
}) => {
  return (
    <StyledListCardWrapper>
      <LinkWrapper
        clientRoute={clientRoute}
        linkUrl={linkUrl}
        nofollow={nofollow}
        openInSameWindowIfNoLinkTarget={isMobile}
        target={linkTarget}
      >
        <StyledCardHeader
          height={170}
          averageRating={averageRating}
          reviewsCount={reviewsCount}
          image={image}
          imgixParams={imgixParams}
        >
          {TopRightIcon && (
            <TopRightIconWrapper backgroundColor={topRightBackground}>
              <TopRightIcon />
            </TopRightIconWrapper>
          )}
          {address && (
            <Address>
              <AddressIconWrapper>
                <StyleThreePinNavigationLocation />
              </AddressIconWrapper>
              {address}
            </Address>
          )}
        </StyledCardHeader>
      </LinkWrapper>
      <ProductCardLinkHeadline
        clientRoute={clientRoute}
        linkUrl={linkUrl}
        nofollow={nofollow}
        openInSameWindowIfNoLinkTarget={isMobile}
      >
        <StyledHeadline
          dangerouslySetInnerHTML={{
            __html: headline,
          }}
        />
      </ProductCardLinkHeadline>
      <LinkWrapper
        clientRoute={clientRoute}
        linkUrl={linkUrl}
        nofollow={nofollow}
        openInSameWindowIfNoLinkTarget={isMobile}
        target={linkTarget}
      >
        {description && <TileDescription>{description}</TileDescription>}
      </LinkWrapper>
    </StyledListCardWrapper>
  );
};

export const TilePlaceCardGridElement = ({
  product,
  pageType,
  isMobile,
  TopRightIcon,
  topRightBackground,
}: {
  product: SharedTypes.PlaceProduct;
  pageType: PageType;
  isMobile: boolean;
  TopRightIcon?: ElementType;
  topRightBackground?: string;
}) => (
  <GridItemWrapper>
    <TilePlaceCard
      {...product}
      TopRightIcon={TopRightIcon}
      topRightBackground={topRightBackground}
      linkTarget={isMobile ? "" : "_blank"}
      clientRoute={{
        query: {
          slug: product.slug || getProductSlugFromHref(product.linkUrl),
        },
        route: `/${pageType}`,
        as: urlToRelative(product.linkUrl),
      }}
      isMobile={isMobile}
    />
  </GridItemWrapper>
);

export default TilePlaceCard;
