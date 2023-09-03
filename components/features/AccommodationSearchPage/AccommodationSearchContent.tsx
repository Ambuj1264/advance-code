import React from "react";

import AccommodationSearchContainer from "./AccommodationSearchContainer";
import AccommodationSearchAdditionalContent from "./AccommodationSearchAdditionalContent";

import { OrderBy, OrderDirection } from "types/enums";

const AccommodationSearchContent = ({
  shouldShowAccommodationList,
  paginationLoading,
  partialLoading,
  accommodationResult,
  totalAccommodations,
  shouldShowCover,
  totalPages,
  currentPage,
  onAvailabilityButtonClick,
  isAccommodationCategory,
  sortOptions,
  hasFilters,
  showContent,
  searchCategory,
  onClearFilters,
  popularAccommodationsMetadata,
  popularAccommodations,
  slug,
  city,
  isHotelCategoryPage,
}: {
  shouldShowAccommodationList: boolean;
  totalAccommodations?: number;
  searchCategory?: SharedTypes.SearchCategoryInfo;
  shouldShowCover: boolean;
  partialLoading: SharedTypes.PartialLoading;
  accommodationResult: SharedTypes.Product[];
  totalPages: number;
  currentPage: number;
  isAccommodationCategory: boolean;
  hasFilters: boolean;
  sortOptions: JSX.Element[];
  paginationLoading: boolean;
  showContent: boolean;
  onAvailabilityButtonClick?: () => void;
  onClearFilters: () => void;
  popularAccommodationsMetadata?: SharedTypes.QuerySearchMetadata;
  popularAccommodations?: SharedTypes.Product[];
  slug: string;
  city?: string;
  isHotelCategoryPage?: boolean;
}) => {
  const accommodationSortParameters = [
    { orderBy: OrderBy.POPULARITY, orderDirection: OrderDirection.DESC },
    { orderBy: OrderBy.TOP_REVIEWS, orderDirection: OrderDirection.DESC },
    { orderBy: OrderBy.PRICE, orderDirection: OrderDirection.ASC },
    { orderBy: OrderBy.PRICE, orderDirection: OrderDirection.DESC },
    { orderBy: OrderBy.DURATION, orderDirection: OrderDirection.ASC },
    { orderBy: OrderBy.DURATION, orderDirection: OrderDirection.DESC },
  ] as SearchPageTypes.SortParameter[];

  return (
    <>
      {shouldShowAccommodationList && (
        <AccommodationSearchContainer
          paginationLoading={paginationLoading}
          partialLoading={partialLoading}
          accommodationResult={accommodationResult}
          totalAccommodations={totalAccommodations}
          shouldShowCover={shouldShowCover}
          totalPages={totalPages}
          currentPage={currentPage}
          onAvailabilityButtonClick={onAvailabilityButtonClick}
          isAccommodationCategory={isAccommodationCategory}
          sortOptions={sortOptions}
          hasFilters={hasFilters}
          onClearFilters={onClearFilters}
          city={city}
          isHotelCategoryPage={isHotelCategoryPage}
          customSortParams={accommodationSortParameters}
        />
      )}
      {showContent && searchCategory && (
        <AccommodationSearchAdditionalContent
          isAccommodationCategory={isAccommodationCategory}
          slug={slug}
          popularAccommodations={popularAccommodations}
          popularAccommodationsMetadata={popularAccommodationsMetadata}
          onAvailabilityButtonClick={onAvailabilityButtonClick}
        />
      )}
    </>
  );
};

export default AccommodationSearchContent;
