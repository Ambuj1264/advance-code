import React, { ElementType, useState, memo, useMemo, useCallback, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useRouter } from "next/router";

import PaginationMetatags from "../PaginatedContent/PaginationMetatags";
import ErrorBoundary from "../ErrorBoundary";
import PaginatedContentByCursor from "../PaginatedContent/PaginatedContentByCursor";
import PaginationByCursorMetatags from "../PaginatedContent/PaginationByCursorMetatags";

import SearchMapButton from "./SearchMapButton";
import LoadingBar from "./LoadingBar";
import SearchMapContainer from "./SearchMapContainer";
import { scrollSearchPageToTop } from "./utils/sharedSearchUtils";

import useActiveLocale from "hooks/useActiveLocale";
import { constructGtiCnCanonicalUrl } from "utils/apiUtils";
import useToggle from "hooks/useToggle";
import CustomNextDynamic from "lib/CustomNextDynamic";
import SearchProductGridView from "components/ui/Search/SearchProductGridView";
import PaginatedContent from "components/ui/PaginatedContent/PaginatedContent";
import { breakpointsMax, gutters } from "styles/variables";
import { PageLayout, PageType } from "types/enums";
import SortOptionsContainer from "components/ui/Sort/SortOptionsContainer";
import {
  ListContainerWrapper,
  ListHeaderWrapper,
  ListHeaderCenterWrapper,
  ListHeaderColumnRight,
  ListHeaderCenterColumn,
  ListHeaderColumnLeft,
  StyledSortOptionsContainer,
} from "components/ui/Search/SearchList";
import LayoutSwitcher from "components/ui/LayoutSwitcher/LayoutSwitcher";
import { cleanAsPath } from "utils/routerUtils";
import { useSettings } from "contexts/SettingsContext";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import useOnDidUpdate from "hooks/useOnDidUpdate";

const SearchProductListView = CustomNextDynamic(
  () => import("components/ui/Search/SearchProductListView"),
  {
    loading: () => null,
    ssr: false,
  }
);

const ListWrapper = styled.div<{
  partialLoading?: SharedTypes.PartialLoading;
}>(({ partialLoading }) => [
  css`
    position: relative;
    z-index: 0;
    margin-bottom: ${gutters.small}px;
  `,
  partialLoading
    ? css`
        margin-top: 0;
      `
    : css`
        margin-top: ${gutters.small}px;
      `,
]);

const SearchProductListContainer = <ProductT extends SearchPageTypes.SearchProduct>({
  ProductListComponent,
  TileCardElement,
  TileCardSkeletonElement,
  TileCardSSRSkeletonElement,
  ListCardElement,
  ListCardSkeletonElement,
  loading,
  partialLoading,
  products,
  totalProducts,
  isCompact,
  productListHeader,
  pageType,
  priceSubtitle,
  sortOptions,
  totalPages,
  currentPage,
  onAvailabilityButtonClick,
  isTotalPrice,
  customSortParams,
  defaultLayout = PageLayout.GRID,
  imgixParams,
  isCategoryPage,
  map,
  isClustersEnabled = true,
  isMapLoading = false,
  additionalProductProps,
  useCursorPagination = false,
  hasNextPage = false,
  hasPreviousPage = false,
  nextPageCursor = "",
  prevPageCursor = "",
  skipPaginationMetaTags = false,
  resetPageOnSortSelection = false,
  isVPResults = false,
  forceOpenInSameWindowIfNoLinkTarget = false,
  currencyCode,
  onMapOpen,
  disableLSLayout,
  numberOfLoadingItems,
}: {
  // We can pass SearchProductListComponent for pages where 'list' view is default. Otherwise it will load dynamically.
  ProductListComponent?: ElementType;
  TileCardElement?: ElementType;
  TileCardSkeletonElement?: ElementType;
  TileCardSSRSkeletonElement?: ElementType;
  ListCardElement: ElementType;
  ListCardSkeletonElement: ElementType;
  loading: boolean;
  totalProducts?: number;
  products: ProductT[];
  isCompact: boolean;
  productListHeader: React.ReactNode;
  pageType: PageType;
  priceSubtitle?: string;
  sortOptions?: React.ReactElement[];
  partialLoading?: SharedTypes.PartialLoading;
  totalPages?: number;
  currentPage: number;
  onAvailabilityButtonClick?: () => void;
  isTotalPrice?: boolean;
  customSortParams?: SearchPageTypes.SortParameter[];
  defaultLayout?: PageLayout;
  imgixParams?: SharedTypes.ImgixParams;
  isCategoryPage?: boolean;
  map?: SharedTypes.Map;
  isClustersEnabled?: boolean;
  isMapLoading?: boolean;
  additionalProductProps?: SearchPageTypes.SearchProductAdditionalProps[];
  skipPaginationMetaTags?: boolean;
  useCursorPagination?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextPageCursor?: string;
  prevPageCursor?: string;
  resetPageOnSortSelection?: boolean;
  isVPResults?: boolean;
  forceOpenInSameWindowIfNoLinkTarget?: boolean;
  currencyCode?: string;
  onMapOpen?: () => void;
  disableLSLayout?: boolean;
  numberOfLoadingItems?: number;
}) => {
  const {
    currencyCode: currency,
    convertCurrency,
    isCurrencyFallback,
  } = useCurrencyWithSSR(currencyCode);
  const { asPath } = useRouter();
  const activeLocale = useActiveLocale();
  const { marketplaceUrl, marketplace } = useSettings();
  const [cacheHitPaginationLoading, setCacheHitPaginationLoading] = useState(false);
  const [isMapOpen, toggleIsMapOpen] = useToggle(false);
  const isDesktop = useMediaQuery({ minWidth: breakpointsMax.desktop });

  useEffect(() => {
    if (isMapOpen && !isMapLoading) {
      onMapOpen?.();
    }
  }, [isMapOpen, onMapOpen, isMapLoading]);

  const [activeLayout, setActiveLayout] = useState(defaultLayout);
  const renderedLayoutType = isDesktop || !TileCardElement ? activeLayout : PageLayout.GRID;
  const noResults = totalProducts === 0 && !loading && !partialLoading?.someProviderLoading;
  const onPaginationClick = useCallback(() => {
    setCacheHitPaginationLoading(true);
    setTimeout(() => setCacheHitPaginationLoading(false), 1500);
  }, []);

  const nextCanonical = constructGtiCnCanonicalUrl({
    marketplace,
    activeLocale,
    asPath,
    shouldCleanAsPath: true,
    marketplaceUrl,
    defaultNonGtiCnCanonicalUrl: `${marketplaceUrl}/${cleanAsPath(asPath)}`,
  });

  const SearchProductListComponent = ProductListComponent || SearchProductListView;
  const hasResultsGridView = !noResults && renderedLayoutType === PageLayout.GRID;
  const hasResultsListView = !noResults && renderedLayoutType !== PageLayout.GRID;

  useOnDidUpdate(() => {
    scrollSearchPageToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  const paginatedContentItems = useMemo(
    () => (
      <ListWrapper partialLoading={partialLoading}>
        {partialLoading && <LoadingBar isLoading={partialLoading?.someProviderLoading} />}
        {hasResultsGridView && (
          <SearchProductGridView<ProductT>
            forceOpenInSameWindowIfNoLinkTarget={forceOpenInSameWindowIfNoLinkTarget}
            TileCardElement={TileCardElement!}
            TileCardSkeletonElement={TileCardSkeletonElement!}
            TileCardSSRSkeletonElement={TileCardSSRSkeletonElement!}
            products={products}
            hasFilters={isCompact}
            loading={loading || cacheHitPaginationLoading}
            partialLoading={partialLoading}
            currency={currency}
            convertCurrency={convertCurrency}
            pageType={pageType}
            priceSubtitle={priceSubtitle}
            onAvailabilityButtonClick={onAvailabilityButtonClick}
            isTotalPrice={isTotalPrice}
            imgixParams={imgixParams}
            isCurrencyFallback={isCurrencyFallback}
            additionalProductProps={additionalProductProps}
            numberOfLoadingItems={numberOfLoadingItems}
          />
        )}
        {hasResultsListView && (
          <SearchProductListComponent
            ListCardElement={ListCardElement}
            TileCardSkeletonElement={ListCardSkeletonElement}
            ListCardSkeletonElement={ListCardSkeletonElement}
            products={products}
            loading={loading || cacheHitPaginationLoading}
            currency={currency}
            convertCurrency={convertCurrency}
            pageType={pageType}
            priceSubtitle={priceSubtitle}
            partialLoading={partialLoading}
            isTotalPrice={isTotalPrice}
            imgixParams={imgixParams}
            isCurrencyFallback={isCurrencyFallback}
            additionalProductProps={additionalProductProps}
            isVPResults={isVPResults}
            numberOfLoadingItems={numberOfLoadingItems}
          />
        )}
      </ListWrapper>
    ),
    [
      ListCardElement,
      ListCardSkeletonElement,
      SearchProductListComponent,
      TileCardElement,
      TileCardSSRSkeletonElement,
      TileCardSkeletonElement,
      additionalProductProps,
      cacheHitPaginationLoading,
      convertCurrency,
      currencyCode,
      currency,
      imgixParams,
      isCompact,
      isCurrencyFallback,
      isTotalPrice,
      loading,
      noResults,
      onAvailabilityButtonClick,
      pageType,
      partialLoading,
      priceSubtitle,
      products,
      renderedLayoutType,
    ]
  );

  return (
    <ErrorBoundary>
      {!useCursorPagination && !skipPaginationMetaTags && (
        <PaginationMetatags
          currentPage={currentPage}
          canonical={nextCanonical}
          totalPages={totalPages}
        />
      )}
      {useCursorPagination && !skipPaginationMetaTags && (
        <PaginationByCursorMetatags
          canonical={nextCanonical}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          nextPageCursor={nextPageCursor}
          prevPageCursor={prevPageCursor}
        />
      )}
      {isMapOpen && map && <SearchMapContainer map={map} isClustersEnabled={isClustersEnabled} />}
      <ListContainerWrapper>
        {!isCategoryPage ? (
          <ListHeaderWrapper isCompact={isCompact}>
            <ListHeaderColumnLeft isHidden={!TileCardElement}>
              <LayoutSwitcher
                layouts={[PageLayout.GRID, PageLayout.LIST]}
                currentLayout={activeLayout}
                onChange={setActiveLayout}
                disableLSLayout={disableLSLayout}
                pageType={pageType}
              />
            </ListHeaderColumnLeft>
            <ListHeaderCenterColumn>{productListHeader}</ListHeaderCenterColumn>
            <ListHeaderColumnRight>
              {(map || isMapLoading || onMapOpen) && (
                <SearchMapButton
                  isLoading={isMapLoading}
                  toggleIsMapOpen={toggleIsMapOpen}
                  isMapOpen={isMapOpen}
                />
              )}
              {sortOptions && (
                <StyledSortOptionsContainer>
                  <SortOptionsContainer
                    sortOptions={sortOptions}
                    customSortParams={customSortParams}
                    resetPageOnFilterSelection={resetPageOnSortSelection}
                  />
                </StyledSortOptionsContainer>
              )}
            </ListHeaderColumnRight>
          </ListHeaderWrapper>
        ) : (
          <ListHeaderCenterWrapper isCompact={isCompact}>
            <ListHeaderCenterColumn>{productListHeader}</ListHeaderCenterColumn>
          </ListHeaderCenterWrapper>
        )}
        {!useCursorPagination && (
          <PaginatedContent
            name="page"
            isLoading={Boolean(loading || partialLoading?.someProviderLoading)}
            initialPage={1}
            totalPages={totalPages!}
            enablePagination={Boolean(totalPages)}
            setQueryParam
            onPageChange={onPaginationClick}
            runPageChangeOnMount={false}
            usePaginatedLinks
          >
            {paginatedContentItems}
          </PaginatedContent>
        )}
        {useCursorPagination && (
          <PaginatedContentByCursor
            isLoading={Boolean(loading || partialLoading?.someProviderLoading)}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            nextPageCursor={nextPageCursor}
            prevPageCursor={prevPageCursor}
            setQueryParam
            usePaginatedLinks
          >
            {paginatedContentItems}
          </PaginatedContentByCursor>
        )}
      </ListContainerWrapper>
    </ErrorBoundary>
  );
};

export default memo(SearchProductListContainer) as typeof SearchProductListContainer;
