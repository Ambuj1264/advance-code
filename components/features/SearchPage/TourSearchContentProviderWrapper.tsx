import React from "react";

import { SearchPageStateContextProvider } from "./SearchPageStateContext";
import TourSearchAndCategoryContainer from "./TourSearchAndCategoryContainer";

import { LandingPageType } from "types/enums";

const TourSearchContentProviderWrapper = ({
  slug,
  landingPageType,
  isTourCategory = false,
  defaultFilters,
  startingLocationItems,
  defaultLocationName,
  selectedLocationId,
  selectedLocationName,
  dateTo,
  dateFrom,
  numberOfGuests,
}: {
  slug?: string;
  landingPageType?: LandingPageType;
  isTourCategory?: boolean;
  defaultFilters?: SearchPageTypes.Filters;
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  defaultLocationName?: string;
  selectedLocationId?: string;
  selectedLocationName?: string;
  dateFrom?: string;
  dateTo?: string;
  numberOfGuests: SharedTypes.NumberOfGuests;
}) => (
  <SearchPageStateContextProvider
    startingLocationItems={startingLocationItems}
    selectedLocationId={selectedLocationId}
    selectedLocationName={selectedLocationName}
    locationPlaceholder={defaultLocationName}
    filterDateTo={dateTo}
    filterDateFrom={dateFrom}
    adultsFilter={numberOfGuests.adults}
    childrenAges={numberOfGuests.children}
  >
    <TourSearchAndCategoryContainer
      slug={slug}
      landingPageType={landingPageType}
      isTourCategory={isTourCategory}
      defaultFilters={defaultFilters}
    />
  </SearchPageStateContextProvider>
);

export default TourSearchContentProviderWrapper;
