import React, { useContext, useEffect } from "react";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import AccommodationSearchWidgetContainer from "./AccommodationSearchWidgetContainer";
import { AccommodationSearchPageCallbackContext } from "./AccommodationSearchPageStateContext";
import AccommodationSearchCenteredAdditionalContent from "./AccommodationSearchCenteredAdditionalContent";
import AccommodationSearchCoverContainer from "./AccommodationSearchCoverContainer";
import AccommodationSearchContent from "./AccommodationSearchContent";

import Row from "components/ui/Grid/Row";
import { LeftContent, RightContent } from "components/ui/Search/SearchGrid";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import { useRedirectToPageParam } from "hooks/useRedirect";

const AccommodationSearchContentContainer = ({
  isMobileFooterShown,
  showFilters,
  filters,
  totalAccommodations,
  searchCategory,
  defaultFilters,
  shouldShowCover,
  partialLoading,
  accommodationResult,
  totalPages,
  currentPage,
  isAccommodationCategory,
  slug,
  hasFilters,
  popularAccommodations,
  popularAccommodationsMetadata,
  sortOptions,
  onClearFilters,
  paginationLoading,
  showContent,
  selectedFilters,
  city,
  isHotelCategoryPage,
}: {
  isMobileFooterShown: boolean;
  showFilters: boolean;
  filters: FilterSectionListType;
  totalAccommodations?: number;
  searchCategory?: AccommodationSearchTypes.AccommodationSearchCategory;
  defaultFilters: AccommodationSearchTypes.AccommodationFilter[];
  shouldShowCover: boolean;
  partialLoading: SharedTypes.PartialLoading;
  accommodationResult: SharedTypes.Product[];
  totalPages: number;
  currentPage: number;
  isAccommodationCategory: boolean;
  slug: string;
  hasFilters: boolean;
  popularAccommodations?: SharedTypes.Product[];
  popularAccommodationsMetadata?: SharedTypes.QuerySearchMetadata;
  sortOptions: JSX.Element[];
  onClearFilters: () => void;
  paginationLoading: boolean;
  showContent: boolean;
  selectedFilters: SelectedFilter[];
  city?: string;
  isHotelCategoryPage?: boolean;
}) => {
  useRedirectToPageParam({
    loading: partialLoading.someProviderLoading,
    page: currentPage,
    totalPages,
    goToPage: 1,
  });
  const { onSearchWidgetToggle } = useContext(AccommodationSearchPageCallbackContext);
  const isTablet = useIsTablet();

  const { setDefaultLocation } = useContext(AccommodationSearchPageCallbackContext);
  const prevSearchCategoryData = usePreviousState(searchCategory);

  useEffect(() => {
    if (searchCategory && !prevSearchCategoryData) {
      setDefaultLocation(searchCategory.defaultLocationsList, searchCategory.location);
    }
  }, [searchCategory, setDefaultLocation, prevSearchCategoryData]);

  const hasFiltersOrPagination = hasFilters || currentPage > 1;
  const onAvailabilityButtonClick = !hasFilters
    ? () => {
        onSearchWidgetToggle(true);
        if (isTablet) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    : undefined;

  const shouldShowAccommodationList = !shouldShowCover || isAccommodationCategory;

  return (
    <>
      {shouldShowCover ? (
        <>
          <AccommodationSearchCoverContainer
            isMobileFooterShown={isMobileFooterShown}
            showFilters={showFilters}
            filters={filters}
            totalAccommodations={totalAccommodations}
            searchCategory={searchCategory}
            defaultFilters={defaultFilters}
            shouldShowCover={shouldShowCover}
            partialLoading={partialLoading}
            selectedFilters={selectedFilters}
          />
          <AccommodationSearchContent
            shouldShowAccommodationList={shouldShowAccommodationList}
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
            hasFilters={selectedFilters.length > 0}
            showContent={showContent || shouldShowCover}
            searchCategory={searchCategory}
            onClearFilters={onClearFilters}
            popularAccommodationsMetadata={popularAccommodationsMetadata}
            popularAccommodations={popularAccommodations}
            slug={slug}
            city={city}
            isHotelCategoryPage={isHotelCategoryPage}
          />
        </>
      ) : (
        <Row>
          <LeftContent>
            <AccommodationSearchWidgetContainer
              isMobileFooterShown={isMobileFooterShown}
              showFilters={showFilters}
              filters={filters}
              totalAccommodations={totalAccommodations}
              isLoading={partialLoading.allProvidersLoading}
              accommodationCategoryName={searchCategory?.categoryName}
              defaultFilters={defaultFilters}
              selectedFilters={selectedFilters}
              withCurrencyConversion={false}
            />
          </LeftContent>
          <RightContent>
            <AccommodationSearchContent
              shouldShowAccommodationList={shouldShowAccommodationList}
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
              hasFilters={selectedFilters.length > 0}
              showContent={showContent}
              searchCategory={searchCategory}
              onClearFilters={onClearFilters}
              popularAccommodationsMetadata={popularAccommodationsMetadata}
              popularAccommodations={popularAccommodations}
              slug={slug}
            />
          </RightContent>
        </Row>
      )}
      {!hasFiltersOrPagination && searchCategory && (
        <AccommodationSearchCenteredAdditionalContent
          isAccommodationCategory={isAccommodationCategory}
          slug={slug}
          informationTitle={searchCategory.informationTitle}
          information={searchCategory.information}
        />
      )}
    </>
  );
};

export default AccommodationSearchContentContainer;
