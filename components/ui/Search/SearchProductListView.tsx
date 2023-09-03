import React, { ElementType } from "react";

import SearchProductListLoading from "./SearchProductListLoading";
import SearchListViewPartialLoading from "./SearchListViewPartialLoading";

import { PageType } from "types/enums";

const SearchProductListView = <ProductT extends SearchPageTypes.SearchProduct>({
  ListCardElement,
  ListCardSkeletonElement,
  products,
  loading,
  currency,
  convertCurrency,
  pageType,
  priceSubtitle,
  partialLoading,
  isTotalPrice,
  imgixParams,
  additionalProductProps,
  isVPResults = false,
  numberOfLoadingItems,
}: {
  ListCardElement: ElementType;
  ListCardSkeletonElement: ElementType;
  products: ProductT[];
  loading: boolean;
  currency: string;
  convertCurrency: (value: number) => number;
  pageType: PageType;
  priceSubtitle?: string;
  partialLoading?: SharedTypes.PartialLoading;
  isTotalPrice?: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  additionalProductProps?: SearchPageTypes.SearchProductAdditionalProps[];
  isVPResults?: boolean;
  numberOfLoadingItems?: number;
}) => {
  const showResults = !partialLoading?.allProvidersLoading && !loading;
  // Section element helps prevent layout errors when react has different html on ssr and client side.
  return (
    <section>
      {loading && !partialLoading?.someProviderLoading ? (
        <SearchProductListLoading
          products={numberOfLoadingItems || 24}
          ListCardSkeletonElement={ListCardSkeletonElement}
        />
      ) : (
        <>
          {showResults &&
            products.map((product, index) => {
              const additionalProductPropsObj = additionalProductProps?.length
                ? additionalProductProps?.[index]
                : {};
              const isLikelyToSellOut =
                product?.isLikelyToSellOut ?? (product.isAvailable && index === 0);
              return (
                <ListCardElement
                  key={`ListCardElement-${product.id}`}
                  product={product}
                  currency={currency}
                  convertCurrency={convertCurrency}
                  pageType={pageType}
                  priceSubtitle={priceSubtitle}
                  isTotalPrice={isTotalPrice}
                  imgixParams={imgixParams}
                  isSellOut={isLikelyToSellOut}
                  isVPResults={isVPResults}
                  fallBackImg={product.fallBackImg}
                  {...additionalProductPropsObj}
                />
              );
            })}

          {(partialLoading?.someProviderLoading || partialLoading?.allProvidersLoading) && (
            <SearchListViewPartialLoading
              allProvidersLoading={partialLoading.allProvidersLoading}
              someProviderLoading={partialLoading.someProviderLoading}
              ListCardSkeletonElement={ListCardSkeletonElement}
            />
          )}
        </>
      )}
    </section>
  );
};

export default SearchProductListView;
