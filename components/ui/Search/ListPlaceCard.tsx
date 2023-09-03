import React, { ElementType } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TeaserOverlayBanner from "../Teaser/TeaserOverlayBanner";
import ClientLinkPrefetch from "../ClientLinkPrefetch";

import {
  Address,
  AddressIconWrapper,
  InnerRow,
  ItemsWrapper,
  ListCardButtonStyled,
  ListCardFooter,
  ListCardFooterRightColumn,
  ListCardHeadline,
  ListCardLinkHeader,
  ListCardLinkHeadline,
  ListCardReviewsWrapper,
  ListCardRightColumn,
  ListCardRowDescription,
  ListCardWrapper,
  ListRowContent,
  ReviewSummaryWhiteStyled,
  TopRightIconWrapper,
} from "./utils/sharedSearchUtils";
import Author from "./Author";

import { PageType } from "types/enums";
import { getProductSlugFromHref } from "utils/routerUtils";
import { urlToRelative } from "utils/apiUtils";
import { Namespaces } from "shared/namespaces";
import StyleThreePinNavigationLocation from "components/icons/style-three-pin-navigation-location-1.svg";
import { Trans } from "i18n";
import CardHeader from "components/ui/Search/CardHeader";
import { clampLines } from "styles/base";
import { gutters, greyColor } from "styles/variables";
import { typographyBody1 } from "styles/typography";

const ListPlaceCardDescription = styled.p([
  typographyBody1,
  clampLines(3),
  css`
    margin-top: -${gutters.large / 2}px;
    padding-right: ${gutters.large / 2}px;
    color: ${greyColor};
  `,
]);

const ListPlaceCardRowTitle = styled(InnerRow)`
  align-items: center;
`;

const ListPlaceCard = ({
  linkUrl,
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
  author,
  bannerId,
  nofollow = false,
}: SharedTypes.PlaceProduct & {
  TopRightIcon?: ElementType;
  topRightBackground?: string;
  clientRoute?: SharedTypes.ClientRoute;
  imgixParams?: SharedTypes.ImgixParams;
  author?: SharedTypes.Author;
  bannerId?: TeaserTypes.TeaserOverlayBannerIcon;
}) => {
  const hasReviews = Boolean(reviewsCount && averageRating);
  const theme: Theme = useTheme();
  return (
    <ListCardWrapper>
      <ListRowContent>
        <ListCardLinkHeader
          clientRoute={clientRoute}
          linkUrl={linkUrl}
          target="_blank"
          nofollow={nofollow}
        >
          <CardHeader height={170} image={image} imgixParams={imgixParams}>
            {TopRightIcon && (
              <TopRightIconWrapper backgroundColor={topRightBackground}>
                <TopRightIcon />
              </TopRightIconWrapper>
            )}
            {address && (
              <Address title={address}>
                <AddressIconWrapper>
                  <StyleThreePinNavigationLocation />
                </AddressIconWrapper>
                {address}
              </Address>
            )}
          </CardHeader>
        </ListCardLinkHeader>
        {bannerId ? <TeaserOverlayBanner icon={bannerId} /> : null}
        <ListCardRightColumn>
          <ListPlaceCardRowTitle>
            <ListCardLinkHeadline
              nofollow={nofollow}
              clientRoute={clientRoute}
              linkUrl={linkUrl}
              target="_blank"
            >
              <ListCardHeadline
                dangerouslySetInnerHTML={{
                  __html: headline,
                }}
              />
              {author && <Author name={author.name} imageUrl={author.image.url} />}
            </ListCardLinkHeadline>
            {hasReviews && (
              <ListCardReviewsWrapper>
                <ReviewSummaryWhiteStyled
                  reviewTotalCount={reviewsCount!}
                  reviewTotalScore={averageRating!}
                  isLink={false}
                />
              </ListCardReviewsWrapper>
            )}
          </ListPlaceCardRowTitle>
          <ListCardRowDescription>
            {description && (
              <ListPlaceCardDescription
                id={`description-${linkUrl}`}
                dangerouslySetInnerHTML={{
                  __html: description!,
                }}
              />
            )}
          </ListCardRowDescription>
        </ListCardRightColumn>
      </ListRowContent>
      <ListCardFooter>
        <ListCardFooterRightColumn>
          <ClientLinkPrefetch
            title={headline}
            clientRoute={clientRoute}
            linkUrl={linkUrl}
            nofollow={nofollow}
            target="_blank"
          >
            <ListCardButtonStyled theme={theme} color="action">
              <Trans ns={Namespaces.commonNs}>Read more</Trans>
            </ListCardButtonStyled>
          </ClientLinkPrefetch>
        </ListCardFooterRightColumn>
      </ListCardFooter>
    </ListCardWrapper>
  );
};

export const ListPlaceRowElement = ({
  product,
  pageType,
  TopRightIcon,
  topRightBackground,
  imgixParams,
}: {
  product: SharedTypes.PlaceProduct;
  pageType: PageType;
  TopRightIcon?: ElementType;
  topRightBackground?: string;
  imgixParams?: SharedTypes.ImgixParams;
}) => (
  <ItemsWrapper key={product.id}>
    <ListPlaceCard
      {...product}
      TopRightIcon={TopRightIcon}
      topRightBackground={topRightBackground}
      clientRoute={{
        query: {
          slug: product.slug || getProductSlugFromHref(product.linkUrl),
        },
        route: `/${pageType}`,
        as: urlToRelative(product.linkUrl),
      }}
      imgixParams={imgixParams}
    />
  </ItemsWrapper>
);

export default ListPlaceCard;
