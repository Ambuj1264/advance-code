/* eslint-disable react/no-danger */
import React, { ElementType } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import { constructUniqueIdentifier } from "@travelshift/ui/utils/utils";

import { getProductCardCurrencyConversionProps } from "../ProductsGrid/productGridUtils";

import {
  LinkWrapper,
  TileHeadline,
  TileProductCardWrapper,
  getProductClientRoute,
} from "./utils/sharedSearchUtils";
import TileProductCardFooter from "./TileProductCardFooter";
import { GridItemWrapper } from "./SearchList";
import EstablishmentInfo from "./EstablishmentInfo";

import { PageType } from "types/enums";
import { Trans } from "i18n";
import {
  borderRadius,
  borderRadiusSmall,
  boxShadowTileRegular,
  greyColor,
  gutters,
  loadingBlue,
} from "styles/variables";
import currencyFormatter, { roundPriceToInteger } from "utils/currencyFormatUtils";
import CardHeader from "components/ui/Search/CardHeader";
import ProductSpecs from "components/ui/Information/ProductSpecs";
import { mqMax, mqMin } from "styles/base";
import Button from "components/ui/Inputs/Button";
import { Namespaces } from "shared/namespaces";

export const StyledHeadline = styled(TileHeadline)`
  margin-top: ${gutters.small}px;
  height: 48px;
`;
const DivHeadline = StyledHeadline.withComponent("div");

export const ProductSpecsStyled = styled(ProductSpecs)`
  margin: ${gutters.small / 2}px ${gutters.small}px ${gutters.small}px ${gutters.small}px;
  border-radius: ${borderRadius};
  padding: 0px 0px ${gutters.large / 2}px 0px;

  ${mqMin.medium} {
    float: none;
    margin: 0 ${gutters.small}px 0 ${gutters.small}px;
    border-radius: ${borderRadius};
    width: calc(100% - ${gutters.small * 2}px);
  }

  ${mqMax.medium} {
    width: calc(100% - ${gutters.small * 2}px);
  }
  ${mqMin.large} {
    padding: 0 0 ${gutters.large / 2}px 0;
  }
`;

const SubtitleStyle = styled.div`
  margin: 0 ${gutters.small}px;
  color: ${rgba(greyColor, 0.7)};
`;

const SkeletonImage = styled.div`
  border-radius: ${borderRadiusSmall};
  height: 207px;
  background: ${loadingBlue};
`;

const SkeletonLinkWrapper = styled.a<{}>(
  ({ theme }) => css`
    position: relative;
    display: block;
    box-shadow: ${boxShadowTileRegular};
    border-radius: ${borderRadiusSmall};
    height: 455px;
    text-align: center;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      display: block;
      width: 100%;
      height: 45px;
      background-color: ${rgba(theme.colors.action, 0.05)};
    }

    ${TileHeadline} {
      margin: ${gutters.small}px ${gutters.small}px 0 ${gutters.small}px;
    }

    ${mqMin.medium} {
      height: 431px;
    }
  `
);

const ButtonWrapper = styled.div`
  margin: ${gutters.small / 2}px ${gutters.small}px;
`;

export const ProductCardLinkHeadline = styled(LinkWrapper)<{}>(
  ({ theme }) => css`
    display: block;
    margin: ${gutters.small / 2}px ${gutters.small}px 0 ${gutters.small}px;

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${theme.colors.primary};
    }
  `
);

export const TileProductCardSSRSkeleton = ({
  linkUrl,
  headline,
  useDivHeadline = false,
  className,
}: {
  linkUrl: string;
  headline: string;
  useDivHeadline?: boolean;
  className?: string;
}) => {
  const HeadLine = useDivHeadline ? DivHeadline : StyledHeadline;
  return (
    <SkeletonLinkWrapper href={linkUrl} className={className}>
      <SkeletonImage />
      <HeadLine
        dangerouslySetInnerHTML={{
          __html: headline,
        }}
        title={headline}
      />
    </SkeletonLinkWrapper>
  );
};

const TileProductCard = ({
  linkUrl,
  linkTarget,
  headline,
  city,
  price,
  priceDisplayValue,
  averageRating,
  reviewsCount,
  image,
  ribbonLabelText,
  productLabel,
  totalSaved,
  currency,
  productSpecs,
  productProps,
  clientRoute,
  priceSubtitle,
  imgixParams,
  hidePrice,
  onAvailabilityButtonClick,
  isMobile,
  isTotalPrice,
  shouldFormatPrice = true,
  establishment,
  imageHeight,
  isSellOut,
  useDefaultImageHeight = false,
  ProductCardWrapperElement,
  additionalProductProps,
  imageLeftBottomContent,
  className,
  forceOpenInSameWindowIfNoLinkTarget = false,
  fallBackImg,
  defaultImageWidth,
  shouldUseLazyImage,
  isPriceLoading,
  useDivHeadline = false,
  dataTestid,
}: {
  image: Image;
  linkUrl?: string;
  linkTarget?: string;
  headline: string;
  city?: string;
  averageRating?: number;
  reviewsCount?: number;
  price?: number;
  priceDisplayValue?: string;
  totalSaved?: number;
  productSpecs: SharedTypes.ProductSpec[];
  productProps: SharedTypes.ProductProp[];
  ribbonLabelText?: string;
  productLabel?: string;
  currency: string;
  clientRoute?: SharedTypes.ClientRoute;
  priceSubtitle?: string;
  imgixParams?: SharedTypes.ImgixParams;
  hidePrice?: boolean;
  onAvailabilityButtonClick?: () => void;
  isMobile: boolean;
  isTotalPrice?: boolean;
  shouldFormatPrice?: boolean;
  establishment?: SharedTypes.Establishment;
  imageHeight?: number;
  isSellOut?: boolean;
  useDefaultImageHeight?: boolean;
  ProductCardWrapperElement?: ElementType;
  additionalProductProps?: SearchPageTypes.SearchProductAdditionalProps;
  imageLeftBottomContent?: React.ReactNode;
  className?: string;
  forceOpenInSameWindowIfNoLinkTarget?: boolean;
  fallBackImg?: ImageWithSizes;
  defaultImageWidth?: number;
  shouldUseLazyImage?: boolean;
  isPriceLoading?: boolean;
  useDivHeadline?: boolean;
  dataTestid?: string;
}) => {
  const theme: Theme = useTheme();
  const Wrapper = ProductCardWrapperElement || TileProductCardWrapper;
  const openInSameWindowIfNoLinkTarget = isMobile || forceOpenInSameWindowIfNoLinkTarget;
  const HeadLine = useDivHeadline ? DivHeadline : StyledHeadline;
  return (
    <Wrapper
      onClick={!linkUrl ? onAvailabilityButtonClick : undefined}
      className={className}
      {...additionalProductProps}
    >
      <div>
        <LinkWrapper
          clientRoute={clientRoute}
          linkUrl={linkUrl}
          openInSameWindowIfNoLinkTarget={openInSameWindowIfNoLinkTarget}
          target={linkTarget}
          dataTestid={dataTestid}
        >
          <CardHeader
            averageRating={averageRating}
            reviewsCount={reviewsCount}
            image={image}
            shouldUseLazyImage={shouldUseLazyImage}
            productLabel={
              totalSaved ? (
                <Trans
                  values={{
                    amountToSave: shouldFormatPrice
                      ? currencyFormatter(totalSaved)
                      : roundPriceToInteger(totalSaved),
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
            ribbonLabelText={ribbonLabelText}
            isLoading={price === undefined}
            imgixParams={imgixParams}
            height={imageHeight}
            isSellOut={isSellOut}
            useDefaultImageHeight={useDefaultImageHeight}
            city={city}
            leftBottomContent={imageLeftBottomContent}
            fallBackImg={fallBackImg}
            defaultImageWidth={defaultImageWidth}
          />
        </LinkWrapper>
        <ProductCardLinkHeadline
          clientRoute={clientRoute}
          linkUrl={linkUrl}
          openInSameWindowIfNoLinkTarget={openInSameWindowIfNoLinkTarget}
          target={linkTarget}
          dataTestid={dataTestid}
        >
          <HeadLine
            dangerouslySetInnerHTML={{
              __html: headline,
            }}
            title={headline}
          />
        </ProductCardLinkHeadline>
        <LinkWrapper
          clientRoute={clientRoute}
          linkUrl={linkUrl}
          openInSameWindowIfNoLinkTarget={openInSameWindowIfNoLinkTarget}
          target={linkTarget}
          dataTestid={dataTestid}
        >
          <>
            {establishment && (
              <SubtitleStyle>
                <EstablishmentInfo name={establishment.name} image={establishment.image} />
              </SubtitleStyle>
            )}
            <ProductSpecsStyled
              id={`productSpecs${constructUniqueIdentifier(headline)}`}
              productSpecs={productSpecs.slice(0, 4)}
              fullWidth={false}
            />
          </>
        </LinkWrapper>
      </div>
      {hidePrice ? (
        <ButtonWrapper>
          <Button onClick={onAvailabilityButtonClick} inverted theme={theme}>
            <Trans ns={Namespaces.commonSearchNs}>Select dates for availability</Trans>
          </Button>
        </ButtonWrapper>
      ) : (
        <LinkWrapper
          clientRoute={clientRoute}
          linkUrl={linkUrl}
          openInSameWindowIfNoLinkTarget={openInSameWindowIfNoLinkTarget}
          target={linkTarget}
        >
          <TileProductCardFooter
            price={price}
            priceDisplayValue={priceDisplayValue}
            currency={currency}
            productProps={productProps.slice(0, 1)}
            priceSubtitle={priceSubtitle}
            isTotalPrice={isTotalPrice}
            shouldFormatPrice={shouldFormatPrice}
            isPriceLoading={isPriceLoading}
          />
        </LinkWrapper>
      )}
    </Wrapper>
  );
};

export const TileProductCardGridElement = ({
  product,
  currency,
  convertCurrency,
  pageType,
  priceSubtitle,
  onAvailabilityButtonClick,
  isTotalPrice,
  isMobile,
  imgixParams,
  isCurrencyFallback,
  isSellOut,
  additionalProductProps,
  forceOpenInSameWindowIfNoLinkTarget = false,
  fallBackImg,
}: {
  product: SharedTypes.Product & {
    clientRoute?: SharedTypes.ClientRoute;
  };
  currency: string;
  convertCurrency: (value: number) => number;
  pageType: PageType;
  priceSubtitle?: string;
  onAvailabilityButtonClick?: () => void;
  isTotalPrice?: boolean;
  isMobile: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  isCurrencyFallback: boolean;
  isSellOut?: boolean;
  forceOpenInSameWindowIfNoLinkTarget?: boolean;
  additionalProductProps?: SearchPageTypes.SearchProductAdditionalProps;
  fallBackImg?: ImageWithSizes;
}) => (
  <GridItemWrapper>
    <TileProductCard
      {...product}
      {...getProductCardCurrencyConversionProps(
        currency,
        convertCurrency,
        product.totalSaved,
        product.price,
        isCurrencyFallback
      )}
      forceOpenInSameWindowIfNoLinkTarget={forceOpenInSameWindowIfNoLinkTarget}
      clientRoute={getProductClientRoute(product, pageType)}
      productSpecs={product.specs}
      productProps={product.props}
      priceSubtitle={priceSubtitle}
      onAvailabilityButtonClick={onAvailabilityButtonClick}
      hidePrice={onAvailabilityButtonClick !== undefined}
      isTotalPrice={isTotalPrice}
      isMobile={isMobile}
      shouldFormatPrice={product.shouldFormatPrice}
      imgixParams={imgixParams}
      isSellOut={isSellOut}
      useDefaultImageHeight={product.useDefaultImageHeight}
      fallBackImg={fallBackImg}
      {...additionalProductProps}
    />
  </GridItemWrapper>
);

export default TileProductCard;
