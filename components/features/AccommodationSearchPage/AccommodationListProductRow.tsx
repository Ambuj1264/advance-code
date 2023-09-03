import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { greenColor, redCinnabarColor, whiteColor } from "styles/variables";
import { LazyImageWrapper, ProductLabelOverlayStyled } from "components/ui/Search/CardHeader";
import { ProductLabelValue } from "components/ui/Search/ProductLabelOverlay";
import { LoadingPrice } from "components/ui/Search/TileProductCardFooter";
import { Price as LoadingListPrice } from "components/ui/Search/ListProductCardSkeleton";
import {
  ItemsWrapper,
  ListCardWrapper,
  getProductClientRoute,
} from "components/ui/Search/utils/sharedSearchUtils";
import { getProductCardCurrencyConversionProps } from "components/ui/ProductsGrid/productGridUtils";
import ListProductCard from "components/ui/Search/ListProductCard";
import { PageType } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

export const searchCardIsFeaturedStyles = ({
  isHighlight,
  isAvailable,
}: {
  isHighlight?: boolean;
  isAvailable?: boolean;
}) => [
  isHighlight &&
    css`
      border: 1px solid ${greenColor};
    `,
  !isAvailable &&
    css`
      border: 1px solid ${redCinnabarColor};

      ${LazyImageWrapper} {
        &:after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: ${rgba(whiteColor, 0.6)};
        }
      }
      ${ProductLabelOverlayStyled} span {
        background-color: ${redCinnabarColor};
      }
      ${ProductLabelValue} {
        background-color: ${redCinnabarColor};
      }
      ${LoadingPrice}, ${LoadingListPrice} {
        display: none;
      }
    `,
];

export const StyledListCardWrapper = styled(ListCardWrapper)<{
  isHighlight?: boolean;
  isAvailable?: boolean;
}>(() => [searchCardIsFeaturedStyles]);

export const AccommodationListProductRow = ({
  product,
  currency,
  convertCurrency,
  pageType,
  priceSubtitle,
  isTotalPrice,
  imgixParams,
  isCurrencyFallback,
  isSellOut,
  isHighlight = false,
  isAvailable = true,
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
  isHighlight?: boolean;
  isAvailable?: boolean;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);

  const unavailableText = !isAvailable ? commonSearchT("Sold out") : undefined;
  const unavailableLabel = !isAvailable ? commonSearchT("You just missed it") : undefined;

  const additionalProductProps = { isAvailable, isHighlight };

  return (
    <ItemsWrapper key={product.id}>
      <ListProductCard
        priceDisplayValue={product.priceDisplayValue}
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
        ribbonLabelText={unavailableText || product.ribbonLabelText}
        productLabel={unavailableLabel}
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
        ListCardWrapperElement={StyledListCardWrapper}
        {...additionalProductProps}
      />
    </ItemsWrapper>
  );
};
