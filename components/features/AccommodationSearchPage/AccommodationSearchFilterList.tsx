import React from "react";

import {
  mergeDefaultFiltersWithSearchResultFilters,
  shouldDisableDefaultCheckedFilter,
} from "./utils/accommodationSearchFilterUtils";

import LoadingFilterList from "components/ui/Loading/LoadingFilterList";
import FilterSectionList from "components/ui/Filters/FilterSectionList";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";

const AccommodationSearchFilterList = ({
  filters,
  defaultFiltersSections,
  loading,
  selectedFilters,
  withCurrencyConversion = true,
}: {
  filters: FilterSectionListType;
  defaultFiltersSections: FilterSectionListType;
  loading: boolean;
  selectedFilters: SelectedFilter[];
  withCurrencyConversion?: boolean;
}) => {
  if (loading) {
    return <LoadingFilterList />;
  }

  const mergedFilters = mergeDefaultFiltersWithSearchResultFilters({
    defaultFiltersSections,
    filtersSections: filters,
  });

  const disableDefaultCheckedFilter = shouldDisableDefaultCheckedFilter(filters);
  return filters ? (
    <FilterSectionList
      filters={mergedFilters}
      disableDefaultCheckedFilter={disableDefaultCheckedFilter}
      resetPageOnFilterSelection
      withSearchInput
      selectedFilters={selectedFilters}
      withCurrencyConversion={withCurrencyConversion}
    />
  ) : null;
};

export default AccommodationSearchFilterList;
