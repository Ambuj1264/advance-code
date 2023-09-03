import React, { ElementType } from "react";
import styled from "@emotion/styled";

import TileProductCard, {
  StyledHeadline,
  TileProductCardSSRSkeleton,
} from "../Search/TileProductCard";
import { GridItemWrapper } from "../Search/SearchList";

import { getProductCardCurrencyConversionProps } from "./productGridUtils";

import { column, mqMax, mqMin } from "styles/base";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { PageType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import { getProductSlugFromHref } from "utils/routerUtils";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { useGlobalContext } from "contexts/GlobalContext";
import { gutters } from "styles/variables";

export const DEFAULT_COLUMN_SIZES = {
  small: 1,
  medium: 1 / 2,
  large: 1 / 3,
  desktop: 1 / 4,
};

export const StyledGridItemWrapper = styled(GridItemWrapper)<{
  columnSizes: SharedTypes.ColumnSizes;
}>(({ columnSizes }) => column(columnSizes));

const StyledTileProductCardSSRSkeleton = styled(TileProductCardSSRSkeleton)`
  ${StyledHeadline} {
    margin-right: ${gutters.small}px;
    margin-left: ${gutters.small}px;
  }
  ${mqMin.medium} and ${mqMax.large} {
    height: 431px;
  }
  ${mqMin.large} {
    height: 447px;
  }
`;

const ProductsGridLazy = ({
  products,
  currency,
  convertCurrency,
  ItemWrapper = StyledGridItemWrapper,
  pageType,
  columnSizes = DEFAULT_COLUMN_SIZES,
  onAvailabilityButtonClick,
  hidePrice,
  isPriceLoading,
}: {
  products: SharedTypes.Product[];
  currency: string;
  convertCurrency: (value: number) => number;
  ItemWrapper?: ElementType;
  pageType: PageType;
  columnSizes?: SharedTypes.ColumnSizes;
  onAvailabilityButtonClick?: () => void;
  hidePrice?: boolean;
  isPriceLoading?: boolean;
}) => {
  const isMobile = useIsMobile();
  const { isClientNavigation } = useGlobalContext();
  const shouldShowSkeletonItems = !isClientNavigation.current;

  const fullProducts = products.map((product, index) => (
    <ItemWrapper key={product.id} columnSizes={columnSizes}>
      <TileProductCard
        {...product}
        {...getProductCardCurrencyConversionProps(
          currency,
          convertCurrency,
          product.totalSaved,
          product.price
        )}
        clientRoute={{
          query: {
            slug: product.slug || getProductSlugFromHref(product.linkUrl),
          },
          route: `/${pageType}`,
          as: urlToRelative(product.linkUrl),
        }}
        productSpecs={product.specs}
        productProps={product.props}
        isMobile={isMobile}
        onAvailabilityButtonClick={onAvailabilityButtonClick}
        hidePrice={hidePrice}
        isPriceLoading={isPriceLoading}
        dataTestid={`top-tour-item-${index}`}
      />
    </ItemWrapper>
  ));

  return !shouldShowSkeletonItems ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{fullProducts}</>
  ) : (
    <LazyComponent
      loadingElement={
        <LazyHydrateWrapper ssrOnly>
          {products.map(product => (
            <StyledGridItemWrapper key={product.id} columnSizes={columnSizes}>
              <StyledTileProductCardSSRSkeleton
                linkUrl={product.linkUrl}
                headline={product.headline}
              />
            </StyledGridItemWrapper>
          ))}
        </LazyHydrateWrapper>
      }
      lazyloadOffset={isMobile ? LazyloadOffset.Tiny : LazyloadOffset.Medium}
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>{fullProducts}</>
    </LazyComponent>
  );
};

export default ProductsGridLazy;
