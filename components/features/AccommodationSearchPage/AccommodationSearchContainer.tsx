import React, { useMemo } from "react";

import { TileProductCardSSRSkeleton } from "../../ui/Search/TileProductCard";

import { getHeaderMessage } from "./utils/accommodationSearchUtils";
import { AccommodationListProductRow } from "./AccommodationListProductRow";
import { AccommodationGridProductElement } from "./AccommodationGridProductElement";

import ListProductCardSkeleton from "components/ui/Search/ListProductCardSkeleton";
import TileProductCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import SearchProductListContainer from "components/ui/Search/SearchProductListContainer";
import { PageLayout, PageType, Marketplace } from "types/enums";
import ProductSearchListHeader from "components/ui/Search/ProductSearchListHeader";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { GridItemWrapper } from "components/ui/Search/SearchList";
import { useSettings } from "contexts/SettingsContext";

const AccommodationSearchContainer = <ProductT extends SearchPageTypes.SearchProduct>({
  paginationLoading,
  partialLoading,
  accommodationResult,
  totalAccommodations = 0,
  shouldShowCover,
  totalPages,
  currentPage,
  onAvailabilityButtonClick,
  isAccommodationCategory,
  sortOptions,
  hasFilters,
  onClearFilters,
  map,
  isMapLoading = false,
  city,
  customSortParams,
  currencyCode,
  onMapOpen,
  isHotelCategoryPage,
  useCursorPagination = false,
  prevPageCursor,
  nextPageCursor,
  hasNextPage,
  hasPreviousPage,
}: {
  totalAccommodations?: number;
  shouldShowCover: boolean;
  partialLoading?: SharedTypes.PartialLoading;
  accommodationResult: ProductT[];
  totalPages: number;
  currentPage: number;
  isAccommodationCategory: boolean;
  hasFilters: boolean;
  sortOptions: JSX.Element[];
  paginationLoading: boolean;
  onAvailabilityButtonClick?: () => void;
  onClearFilters: () => void;
  map?: SharedTypes.Map;
  isMapLoading?: boolean;
  city?: string;
  customSortParams?: SearchPageTypes.SortParameter[];
  currencyCode?: string;
  onMapOpen?: () => void;
  isHotelCategoryPage?: boolean;
  useCursorPagination?: boolean;
  prevPageCursor?: string;
  nextPageCursor?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}) => {
  const { marketplace } = useSettings();
  const { t } = useTranslation(Namespaces.accommodationSearchNs);
  const allProvidersLoading = !!partialLoading?.allProvidersLoading;
  const someProviderLoading =
    !!partialLoading?.someProviderLoading && accommodationResult.length === 0;
  const isLoading = paginationLoading || allProvidersLoading || someProviderLoading;
  const additionalProductProps = useMemo(
    () =>
      accommodationResult.map(accommodation => ({
        isAvailable: accommodation.isAvailable,
        isHighlight: accommodation.isHighlight,
      })),
    [accommodationResult]
  );
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;

  const AccommodationTileProductSSRSkeletonGridElement = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      ({ linkUrl, headline }: { linkUrl: string; headline: string }) =>
        (
          <GridItemWrapper
            columnSizes={{
              small: 1,
              medium: 1 / 2,
              desktop: 1 / (hasFilters ? 3 : 4),
            }}
          >
            <TileProductCardSSRSkeleton linkUrl={linkUrl} headline={headline} />
          </GridItemWrapper>
        ),
    [hasFilters]
  );

  return (
    <SearchProductListContainer<SearchPageTypes.SearchProduct>
      TileCardElement={AccommodationGridProductElement}
      TileCardSkeletonElement={TileProductCardSkeleton}
      TileCardSSRSkeletonElement={AccommodationTileProductSSRSkeletonGridElement}
      ListCardElement={AccommodationListProductRow}
      ListCardSkeletonElement={ListProductCardSkeleton}
      loading={paginationLoading}
      partialLoading={partialLoading}
      products={accommodationResult}
      totalProducts={totalAccommodations}
      isCompact={!shouldShowCover}
      totalPages={totalPages}
      currentPage={currentPage}
      onAvailabilityButtonClick={onAvailabilityButtonClick}
      customSortParams={customSortParams}
      isMapLoading={isMapLoading}
      useCursorPagination={useCursorPagination}
      prevPageCursor={prevPageCursor}
      nextPageCursor={nextPageCursor}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      productListHeader={
        <ProductSearchListHeader
          loading={isLoading}
          hasFilters={hasFilters}
          skipSubheader={shouldShowCover}
          totalProducts={totalAccommodations}
          onClearFilters={onClearFilters}
          header={getHeaderMessage(
            t,
            isAccommodationCategory,
            totalAccommodations,
            city,
            isHotelCategoryPage
          )}
        />
      }
      pageType={isGTE ? PageType.GTE_STAY : PageType.ACCOMMODATION}
      sortOptions={sortOptions}
      isTotalPrice={!shouldShowCover}
      defaultLayout={PageLayout.GRID}
      isCategoryPage={isAccommodationCategory}
      map={map}
      onMapOpen={onMapOpen}
      additionalProductProps={additionalProductProps}
      currencyCode={currencyCode}
    />
  );
};

export default AccommodationSearchContainer;
