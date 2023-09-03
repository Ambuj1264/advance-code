import React from "react";

import RangeFilterSection from "./RangePriceFilterSection";
import SelectedFiltersContainer from "./SelectedFiltersContainer";

import FilterSection from "components/ui/Filters/FilterSection";
import ButtonFilterSection from "components/ui/Filters/ButtonFilterSection";
import { FilterType } from "types/enums";
import {
  FilterSectionListType,
  FilterSectionType,
  RangeFilterSectionType,
  SelectedFilter,
} from "components/ui/Filters/FilterTypes";

const FilterWidgetComponent = ({
  type,
  disableDefaultCheckedFilter,
  resetPageOnFilterSelection,
  canSearchInsideFilters = false,
  withCurrencyConversion = true,
  className,
  ...props
}: (FilterSectionType | RangeFilterSectionType) & {
  type: FilterType;
  disableDefaultCheckedFilter?: boolean;
  resetPageOnFilterSelection?: boolean;
  canSearchInsideFilters?: boolean;
  withCurrencyConversion?: boolean;
  className?: string;
}) => {
  switch (type) {
    case FilterType.BUTTONS:
      return (
        <ButtonFilterSection
          {...(props as FilterSectionType)}
          disableDefaultCheckedFilter={disableDefaultCheckedFilter}
          resetPageOnFilterSelection={resetPageOnFilterSelection}
        />
      );
    case FilterType.RANGE:
      return (
        <RangeFilterSection
          {...(props as RangeFilterSectionType)}
          withCurrencyConversion={withCurrencyConversion}
        />
      );
    case FilterType.CHECKBOX:
    case FilterType.RADIO:
    default:
      return (
        <FilterSection
          resetPageOnFilterSelection={resetPageOnFilterSelection}
          {...(props as FilterSectionType)}
          filterType={type}
          canSearchInsideFilters={canSearchInsideFilters}
          className={className}
        />
      );
  }
};

const FilterSectionList = ({
  filters,
  disableDefaultCheckedFilter,
  resetPageOnFilterSelection,
  withSearchInput = false,
  selectedFilters,
  withCurrencyConversion = true,
  className,
}: {
  filters: FilterSectionListType;
  disableDefaultCheckedFilter?: boolean;
  resetPageOnFilterSelection?: boolean;
  withSearchInput?: boolean;
  selectedFilters?: SelectedFilter[];
  withCurrencyConversion?: boolean;
  className?: string;
}) => {
  return (
    <>
      <SelectedFiltersContainer filters={selectedFilters} data-testid="filter-container" />
      {filters.map(props => (
        <FilterWidgetComponent
          {...props}
          type={props.type}
          disableDefaultCheckedFilter={disableDefaultCheckedFilter}
          resetPageOnFilterSelection={resetPageOnFilterSelection}
          key={`${props.title}-${props.sectionId}`}
          canSearchInsideFilters={withSearchInput}
          withCurrencyConversion={withCurrencyConversion}
          className={className}
        />
      ))}
    </>
  );
};

export default FilterSectionList;
