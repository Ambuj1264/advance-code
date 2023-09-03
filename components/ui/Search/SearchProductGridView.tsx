import React, { ElementType } from "react";

import LazyComponent, { LazyloadOffset } from "../Lazy/LazyComponent";

import SearchProductGridListLoading from "./SearchProductGridListLoading";
import { GridRow } from "./SearchList";
import SearchGridViewPartialLoading from "./SearchGridViewPartialLoading";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { PageType } from "types/enums";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { useGlobalContext } from "contexts/GlobalContext";

const SearchProductGridView = <ProductT extends SearchPageTypes.SearchProduct>({
  TileCardElement,
  TileCardSkeletonElement,
  TileCardSSRSkeletonElement,
  products,
  hasFilters,
  loading,
  currency,
  convertCurrency,
  pageType,
  partialLoading,
  priceSubtitle,
  onAvailabilityButtonClick,
  isTotalPrice,
  imgixParams,
  isCurrencyFallback,
  additionalProductProps,
  forceOpenInSameWindowIfNoLinkTarget = false,
  numberOfLoadingItems,
}: {
  TileCardElement: ElementType;
  TileCardSkeletonElement: ElementType;
  TileCardSSRSkeletonElement: ElementType;
  products: ProductT[];
  hasFilters: boolean;
  loading: boolean;
  currency: string;
  convertCurrency: (value: number) => number;
  pageType: PageType;
  partialLoading?: SharedTypes.PartialLoading;
  priceSubtitle?: string;
  onAvailabilityButtonClick?: () => void;
  isTotalPrice?: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  isCurrencyFallback: boolean;
  forceOpenInSameWindowIfNoLinkTarget?: boolean;
  additionalProductProps?: SearchPageTypes.SearchProductAdditionalProps[];
  numberOfLoadingItems?: number;
}) => {
  const isMobile = useIsMobile();
  const { isClientNavigation } = useGlobalContext();
  const shouldShowSkeletonItems = !isClientNavigation.current;

  const fullItems = hasFilters || !shouldShowSkeletonItems ? products : products.slice(0, 6);
  const skeletonItems = !shouldShowSkeletonItems
    ? []
    : products.slice(fullItems.length, products.length);
  const hasSkeletonItems = skeletonItems.length > 0;
  const showResults = !partialLoading?.allProvidersLoading && !loading;

  return loading && !partialLoading?.someProviderLoading ? (
    <SearchProductGridListLoading
      products={hasFilters ? 24 : 8}
      TileCardSkeletonElement={TileCardSkeletonElement}
      hasFilters={hasFilters}
      numberOfLoadingItems={numberOfLoadingItems}
    />
  ) : (
    <GridRow>
      {showResults &&
        fullItems.map((product, index) => {
          const additionalProductPropsObj = additionalProductProps?.length
            ? additionalProductProps?.[index]
            : {};
          const isLikelyToSellOut =
            product?.isLikelyToSellOut ?? (product.isAvailable && index === 0);
          return (
            <TileCardElement
              key={`TileCardElement-${product.id}`}
              product={product}
              currency={currency}
              convertCurrency={convertCurrency}
              pageType={pageType}
              priceSubtitle={priceSubtitle}
              isTotalPrice={isTotalPrice}
              isMobile={isMobile}
              hasFilters={hasFilters}
              onAvailabilityButtonClick={onAvailabilityButtonClick}
              imgixParams={imgixParams}
              isCurrencyFallback={isCurrencyFallback}
              isSellOut={isLikelyToSellOut}
              forceOpenInSameWindowIfNoLinkTarget={forceOpenInSameWindowIfNoLinkTarget}
              fallBackImg={product.fallBackImg}
              {...additionalProductPropsObj}
            />
          );
        })}
      {hasSkeletonItems && (
        <LazyComponent
          lazyloadOffset={isMobile ? LazyloadOffset.Tiny : LazyloadOffset.Medium}
          loadingElement={
            <LazyHydrateWrapper ssrOnly>
              {skeletonItems.map(product => (
                <TileCardSSRSkeletonElement
                  key={`TileCardSSRSkeletonElement${product.id}`}
                  {...product}
                />
              ))}
            </LazyHydrateWrapper>
          }
        >
          {skeletonItems.map(product => (
            <TileCardElement
              key={`TileCardElement-${product.id}`}
              product={product}
              currency={currency}
              convertCurrency={convertCurrency}
              pageType={pageType}
              priceSubtitle={priceSubtitle}
              onAvailabilityButtonClick={onAvailabilityButtonClick}
              isTotalPrice={isTotalPrice}
              hasFilters={hasFilters}
              isMobile={isMobile}
              isCurrencyFallback={isCurrencyFallback}
            />
          ))}
        </LazyComponent>
      )}
      {(partialLoading?.someProviderLoading || partialLoading?.allProvidersLoading) && (
        <SearchGridViewPartialLoading
          TileCardSkeletonElement={TileCardSkeletonElement}
          allProvidersLoading={partialLoading.allProvidersLoading}
          someProviderLoading={partialLoading.someProviderLoading}
          currentResultNumber={products.length}
        />
      )}
    </GridRow>
  );
};

export default SearchProductGridView;
