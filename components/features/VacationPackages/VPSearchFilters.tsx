import React from "react";

import LoadingFilterList from "components/ui/Loading/LoadingFilterList";
import FilterSectionList from "components/ui/Filters/FilterSectionList";
import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";

const VPSearchFilters = ({
  filters,
  loading,
  selectedFilters,
  className,
}: {
  filters?: FilterSectionListType | undefined;
  loading?: boolean;
  selectedFilters: SelectedFilter[];
  className?: string;
}) => {
  if (loading) return <LoadingFilterList />;
  if (!filters || filters.length === 0) return null;

  return (
    <FilterSectionList
      filters={filters}
      resetPageOnFilterSelection
      withSearchInput
      selectedFilters={selectedFilters}
      className={className}
    />
  );
};

export default VPSearchFilters;
