import React from "react";
import styled from "@emotion/styled";

import { searchCardIsFeaturedStyles } from "./AccommodationListProductRow";

import { GridItemWrapper } from "components/ui/Search/SearchList";
import TileProductCard from "components/ui/Search/TileProductCard";
import {
  TileProductCardWrapper,
  getProductClientRoute,
} from "components/ui/Search/utils/sharedSearchUtils";
import { getProductCardCurrencyConversionProps } from "components/ui/ProductsGrid/productGridUtils";
import { PageType } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

export const StyledListCardWrapper = styled(TileProductCardWrapper)<{
  isHighlight?: boolean;
  isAvailable?: boolean;
}>(() => [searchCardIsFeaturedStyles]);

export const AccommodationGridProductElement = ({
  product,
  currency,
  convertCurrency,
  pageType,
  priceSubtitle,
  onAvailabilityButtonClick,
  isTotalPrice,
  isMobile,
  imgixParams,
  hasFilters,
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
  onAvailabilityButtonClick?: () => void;
  isTotalPrice?: boolean;
  isMobile: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  hasFilters?: boolean;
  isCurrencyFallback: boolean;
  isSellOut?: boolean;
  isHighlight?: boolean;
  isAvailable?: boolean;
}) => {
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);

  const unavailableText = !isAvailable ? commonSearchT("Sold out") : undefined;
  const unavailableLabel = !isAvailable ? commonSearchT("You just missed it") : undefined;

  const additionalProductProps = { isAvailable, isHighlight };
  const desktopColumns = hasFilters ? 3 : 4;

  return (
    <GridItemWrapper columnSizes={{ small: 1, medium: 1 / 2, desktop: 1 / desktopColumns }}>
      <TileProductCard
        {...product}
        {...getProductCardCurrencyConversionProps(
          currency,
          convertCurrency,
          product.totalSaved,
          product.price,
          isCurrencyFallback
        )}
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
        ribbonLabelText={unavailableText || product.ribbonLabelText}
        productLabel={unavailableLabel}
        ProductCardWrapperElement={StyledListCardWrapper}
        additionalProductProps={additionalProductProps}
      />
    </GridItemWrapper>
  );
};
