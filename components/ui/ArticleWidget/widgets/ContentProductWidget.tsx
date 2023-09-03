import React from "react";
import styled from "@emotion/styled";

import { getProductCardCurrencyConversionProps } from "components/ui/ProductsGrid/productGridUtils";
import TileProductCard, {
  StyledHeadline,
  ProductSpecsStyled,
  ProductCardLinkHeadline,
} from "components/ui/Search/TileProductCard";
import { QuickFact } from "components/ui/Information/ProductSpecs";
import { mqMax, mqMin } from "styles/base";
import { gutters } from "styles/variables";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";

const ProductWidgetWrapper = styled.div`
  ${StyledHeadline} {
    padding: 0;
  }

  ${ProductSpecsStyled} {
    margin: auto;
    margin-top: ${gutters.small / 2}px;
    padding-right: ${gutters.small / 2}px;
    padding-left: ${gutters.small / 2}px;

    ${mqMin.medium} {
      margin: auto;
      margin-top: ${gutters.small / 2}px;
      width: calc(100% - ${gutters.small}px);
    }
    ${mqMax.medium} {
      width: calc(100% - ${gutters.small}px);
    }
  }

  ${ProductCardLinkHeadline} {
    margin: ${gutters.small / 2}px;
    margin-bottom: 0;
  }

  ${QuickFact} {
    flex-basis: 45%;
    max-width: 45%;

    &:nth-child(even) {
      margin-left: auto;
    }
  }
`;

function isCarProduct(product: TeaserTypes.Product): product is TeaserTypes.Car {
  return (product as TeaserTypes.Car).establishment !== undefined;
}

const ContentProductWidget = ({ product }: { product: TeaserTypes.Product }) => {
  const { currencyCode, convertCurrency, isCurrencyFallback } = useCurrencyWithSSR();
  const isMobile = useIsMobile();

  return (
    <ProductWidgetWrapper fullWidth={false}>
      <TileProductCard
        {...product}
        headline={product.name}
        {...getProductCardCurrencyConversionProps(
          currencyCode,
          convertCurrency,
          product.totalSaved,
          product.price,
          isCurrencyFallback
        )}
        productSpecs={product.specs}
        productProps={product.props}
        establishment={isCarProduct(product) ? product.establishment : undefined}
        isMobile={isMobile}
      />
    </ProductWidgetWrapper>
  );
};

export default ContentProductWidget;
