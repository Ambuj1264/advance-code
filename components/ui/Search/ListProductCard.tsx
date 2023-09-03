import React, { ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";

import { getProductCardCurrencyConversionProps } from "../ProductsGrid/productGridUtils";
import ClientLinkPrefetch from "../ClientLinkPrefetch";

import { Price as LoadingPrice } from "./ListProductCardSkeleton";
import {
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
  getProductClientRoute,
} from "./utils/sharedSearchUtils";
import EstablishmentInfo from "./EstablishmentInfo";

import { PageType } from "types/enums";
import ProductSpecs from "components/ui/Information/ProductSpecs";
import LazyImage from "components/ui/Lazy/LazyImage";
import { clampLines, mqMin } from "styles/base";
import { Trans } from "i18n";
import { borderRadius, greyColor, gutters, borderRadiusSmall } from "styles/variables";
import { typographyBody1, typographyCaptionSmall } from "styles/typography";
import CardHeader, {
  LazyImageComponentStyled,
  LazyImageWrapper,
} from "components/ui/Search/CardHeader";
import ProductFeaturesList from "components/ui/Search/ProductFeaturesList";
import currencyFormatter, { roundPrice } from "utils/currencyFormatUtils";
import Price from "components/ui/Search/Price";

export const StyledCardHeader = styled(CardHeader)`
  max-width: 330px;
  ${LazyImageWrapper} {
    &:before {
      border-radius: ${borderRadiusSmall} 0 0 0;
    }
  }
  ${LazyImageComponentStyled} {
    border-radius: ${borderRadiusSmall} 0 0 0;
  }
`;

export const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceSubtitleWrapper = styled.div`
  ${typographyCaptionSmall};
  margin-top: -${gutters.large / 4}px;
  color: ${rgba(greyColor, 0.7)};
`;

const ReviewsLogo = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  vertical-align: middle;
`;

const imageStyles = css`
  border-radius: 50%;
`;

export const ListProductCardDescription = styled.p([
  typographyBody1,
  clampLines(4),
  css`
    position: relative;
    top: -5px; /* compensate text line height to align with content on the right side */
    width: 50%;
    padding-right: ${gutters.large / 2}px;
    color: ${greyColor};
  `,
]);

export const ListCardRowTitle = styled(InnerRow)`
  align-items: flex-start;
`;

const ProductSpecsStyled = styled(ProductSpecs)<{ fullWidth: boolean }>(
  ({ fullWidth }) => css`
    margin-top: 0;
    border-radius: ${borderRadius};
    width: ${fullWidth ? "100%" : "50%"};

    ${mqMin.medium} {
      padding-bottom: ${gutters.small / 2}px;
    }

    &:only-child {
      margin-top: -${gutters.large / 2}px;
    }
  `
);

const ListProductCard = ({
  namespace = "",
  linkUrl,
  linkTarget,
  headline,
  price,
  priceDisplayValue,
  averageRating,
  reviewsCount,
  image,
  ribbonLabelText,
  productLabel,
  currency,
  description,
  totalSaved,
  productSpecs,
  productProps,
  clientRoute,
  priceSubtitle,
  reviewsLogo,
  reviewsCountText,
  imgixParams,
  isTotalPrice,
  shouldFormatPrice,
  establishment,
  isSellOut,
  ListCardWrapperElement,
  useDefaultImageHeight,
  isVPResults = false,
  fallBackImg,
  ...additionalProductProps
}: {
  id?: number;
  namespace?: string;
  image: Image;
  linkUrl: string;
  linkTarget?: string;
  headline: string;
  averageRating?: number;
  reviewsCount?: number;
  price?: number;
  priceDisplayValue?: string;
  productLabelText?: string;
  productSpecs: SharedTypes.ProductSpec[];
  description?: string;
  ribbonLabelText?: string;
  productLabel?: string;
  productProps: SharedTypes.ProductProp[];
  totalSaved?: number;
  currency: string;
  clientRoute?: SharedTypes.ClientRoute;
  priceSubtitle?: string;
  reviewsLogo?: Image;
  reviewsCountText?: string;
  imgixParams?: SharedTypes.ImgixParams;
  isTotalPrice?: boolean;
  shouldFormatPrice?: boolean;
  establishment?: SharedTypes.Establishment;
  ListCardWrapperElement?: ElementType;
  isSellOut?: boolean;
  useDefaultImageHeight?: boolean;
  isVPResults?: boolean;
  fallBackImg?: ImageWithSizes;
}) => {
  const hasReviews = Boolean(reviewsCount && averageRating);
  const theme: Theme = useTheme();

  const Wrapper = ListCardWrapperElement || ListCardWrapper;

  return (
    <Wrapper {...additionalProductProps}>
      <ListRowContent>
        <ListCardLinkHeader clientRoute={clientRoute} linkUrl={linkUrl} target={linkTarget}>
          <StyledCardHeader
            image={image}
            ribbonLabelText={ribbonLabelText}
            productLabel={
              totalSaved ? (
                <Trans
                  values={{
                    amountToSave: shouldFormatPrice
                      ? currencyFormatter(totalSaved)
                      : roundPrice(totalSaved),
                    currency,
                  }}
                  i18nKey="Save {amountToSave}"
                  defaults="Save <0>{amountToSave}</0> {currency}"
                  components={[<>amountToSave</>]}
                />
              ) : (
                productLabel
              )
            }
            imgixParams={imgixParams}
            isSellOut={isSellOut}
            useDefaultImageHeight={useDefaultImageHeight}
            fallBackImg={fallBackImg}
          />
        </ListCardLinkHeader>
        <ListCardRightColumn>
          <ListCardRowTitle>
            <ListCardLinkHeadline clientRoute={clientRoute} linkUrl={linkUrl} target={linkTarget}>
              <ListCardHeadline
                dangerouslySetInnerHTML={{
                  __html: headline,
                }}
                title={headline}
              />
              {establishment && (
                <EstablishmentInfo name={establishment.name} image={establishment.image} />
              )}
            </ListCardLinkHeadline>
            {hasReviews && (
              <ListCardReviewsWrapper>
                {reviewsLogo && (
                  <ReviewsLogo>
                    <LazyImage
                      src={reviewsLogo.url}
                      imgixParams={{ fit: "clamp" }}
                      width={24}
                      height={24}
                      alt={reviewsLogo.name}
                      styles={imageStyles}
                    />
                  </ReviewsLogo>
                )}
                <ReviewSummaryWhiteStyled
                  reviewTotalCount={reviewsCount!}
                  reviewTotalScore={averageRating!}
                  reviewsCountText={reviewsCountText}
                  isLink={false}
                />
              </ListCardReviewsWrapper>
            )}
          </ListCardRowTitle>
          <ListCardRowDescription>
            {description && (
              <ListProductCardDescription
                id={`description-${linkUrl}`}
                dangerouslySetInnerHTML={{
                  __html: description.replace(/<p>/gm, "").replace(/<\/p>/gm, "<br>"),
                }}
              />
            )}
            <ProductSpecsStyled
              id={`productSpecs${constructUniqueIdentifier(headline)}`}
              productSpecs={productSpecs.slice(0, 8)}
              fullWidth={!description}
            />
          </ListCardRowDescription>
        </ListCardRightColumn>
      </ListRowContent>
      <ListCardFooter data-testid="cardFooter">
        {productProps.length > 0 && (
          <ProductFeaturesList productProps={productProps} isVPResults={isVPResults} />
        )}

        <ListCardFooterRightColumn>
          {price ? (
            <PriceWrapper>
              <Price
                displayValue={priceDisplayValue}
                value={price}
                currency={currency}
                isTotalPrice={isTotalPrice}
                shouldFormatPrice={shouldFormatPrice}
              />
              {priceSubtitle && <PriceSubtitleWrapper>{priceSubtitle}</PriceSubtitleWrapper>}
            </PriceWrapper>
          ) : (
            <LoadingPrice />
          )}
          <ClientLinkPrefetch
            title={headline}
            clientRoute={clientRoute}
            linkUrl={linkUrl}
            target={linkTarget}
          >
            <ListCardButtonStyled theme={theme} color="action">
              <Trans ns={namespace}>See more</Trans>
            </ListCardButtonStyled>
          </ClientLinkPrefetch>
        </ListCardFooterRightColumn>
      </ListCardFooter>
    </Wrapper>
  );
};

export const ListProductRowElement = ({
  product,
  currency,
  convertCurrency,
  pageType,
  priceSubtitle,
  isTotalPrice,
  imgixParams,
  isCurrencyFallback,
  isSellOut,
  isVPResults = false,
  ...additionalProductPros
}: {
  product: SharedTypes.Product & {
    clientRoute?: SharedTypes.ClientRoute;
  };
  currency: string;
  convertCurrency: (value: number) => number;
  pageType: PageType;
  priceSubtitle?: string;
  isTotalPrice?: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  isCurrencyFallback: boolean;
  isSellOut?: boolean;
  isVPResults?: boolean;
}) => (
  <ItemsWrapper key={product.id}>
    <ListProductCard
      {...getProductCardCurrencyConversionProps(
        currency,
        convertCurrency,
        product.totalSaved,
        product.price,
        isCurrencyFallback
      )}
      clientRoute={getProductClientRoute(product, pageType)}
      linkUrl={product.linkUrl}
      headline={product.headline}
      image={product.image}
      imgixParams={imgixParams}
      ribbonLabelText={product.ribbonLabelText}
      description={product.description}
      averageRating={product.averageRating}
      reviewsCount={product.reviewsCount}
      productSpecs={product.specs}
      productProps={product.props}
      priceSubtitle={priceSubtitle}
      isTotalPrice={isTotalPrice}
      establishment={product.establishment}
      shouldFormatPrice={product.shouldFormatPrice}
      isSellOut={isSellOut}
      useDefaultImageHeight={product.useDefaultImageHeight}
      isVPResults={isVPResults}
      fallBackImg={product.fallBackImg}
      {...additionalProductPros}
    />
  </ItemsWrapper>
);

export default ListProductCard;
