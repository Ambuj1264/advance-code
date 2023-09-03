import React from "react";

import { shouldDisableDefaultCheckedFilter } from "./utils/carSearchUtils";

import FilterSectionList from "components/ui/Filters/FilterSectionList";
import LoadingFilterList from "components/ui/Loading/LoadingFilterList";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";

const CarSearchFilterList = ({
  filters,
  loading,
  selectedFilters,
}: {
  filters: FilterSectionListType;
  loading: boolean;
  selectedFilters: SelectedFilter[];
}) => {
  if (loading) {
    return <LoadingFilterList />;
  }
  const disableDefaultCheckedFilter = shouldDisableDefaultCheckedFilter(filters);
  return filters ? (
    <FilterSectionList
      filters={filters}
      disableDefaultCheckedFilter={disableDefaultCheckedFilter}
      resetPageOnFilterSelection
      withSearchInput
      selectedFilters={selectedFilters}
    />
  ) : null;
};

export default CarSearchFilterList;
