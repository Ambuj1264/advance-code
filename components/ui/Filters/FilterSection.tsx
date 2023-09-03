import React, { ChangeEvent, useCallback, useMemo, useState, useRef } from "react";
import { ArrayParam, NumberParam, StringParam, useQueryParams } from "use-query-params";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import FilterHeading from "./FilterHeading";
import ExpandableFilters from "./ExpandableFilters";
import { onFilterToggle } from "./utils/filtersUtils";
import { FilterContainer } from "./shared";

import SearchIcon from "components/icons/search.svg";
import Checkbox from "components/ui/Inputs/Checkbox";
import Input from "components/ui/Inputs/Input";
import RadioButton from "components/ui/Inputs/RadioButton";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { FilterSectionType } from "components/ui/Filters/FilterTypes";
import useToggle from "hooks/useToggle";
import { CursorPaginationQueryParams, FilterType } from "types/enums";
import { gutters } from "styles/variables";
import { mqMin, styledWebkitScrollbar } from "styles/base";

const NUMBER_OF_FILTERS_VIEWABLE = 5;

const OptionWrapper = styled.div`
  margin-top: ${gutters.small}px;
`;

const SearchFiltersInputWrapper = styled.div`
  position: relative;
  margin-top: ${gutters.small}px;
`;

const ITEM_HEIGHT_PX = 40;
const MOBILE_FILTER_ITEMS = 7;
const DESKTOP_FILTER_ITEMS = 10;

const StyledFiltersWrapper = styled.div`
  margin-top: ${gutters.small}px;
  ${OptionWrapper}:first-of-type {
    margin-top: 0;
  }
`;

const StyledContentOverflow = styled.div<{
  withScroll: boolean;
}>(({ withScroll }) => [
  withScroll &&
    css`
      ${styledWebkitScrollbar};
      height: ${MOBILE_FILTER_ITEMS * ITEM_HEIGHT_PX - gutters.small}px;
      overflow-y: auto;

      ${mqMin.large} {
        height: ${DESKTOP_FILTER_ITEMS * ITEM_HEIGHT_PX - gutters.small}px;
      }
    `,
]);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const getExpandableFiltersProps = (
  sectionId: string,
  filterElements: React.ReactElement[],
  selectedFilterIds: string[],
  filters: SearchPageTypes.Filter[],
  hasSelectedFilter: boolean,
  hasHiddenSelectionOnMount: boolean
) => {
  const checkboxSectionId = `${sectionId}-${+new Date()}`;
  const firstFilters = filterElements.slice(0, NUMBER_OF_FILTERS_VIEWABLE);
  const restFilters = filterElements.slice(NUMBER_OF_FILTERS_VIEWABLE);

  const hasPossibleHiddenFilters = selectedFilterIds.some(
    filterId =>
      filters.findIndex((filter: SearchPageTypes.Filter) => filter.id === filterId) >=
      NUMBER_OF_FILTERS_VIEWABLE
  );

  // We want to automatically expand the filters when a user arrives at a pages with preselected filters that are hidden
  // Or when the user arrives as the page and all of the filters that are shown are disabled

  const isAutomaticallyExpanded =
    !hasSelectedFilter && (hasPossibleHiddenFilters || hasHiddenSelectionOnMount);

  return {
    isAutomaticallyExpanded,
    checkboxSectionId,
    firstFilters,
    restFilters,
  };
};

const FilterSection = ({
  sectionId,
  filters,
  Icon,
  title,
  placeholder = "",
  resetPageOnFilterSelection,
  filterType,
  canSearchInsideFilters = false,
  onShowLessClick,
  className,
}: FilterSectionType & {
  resetPageOnFilterSelection?: boolean;
  filterType: FilterType;
  canSearchInsideFilters?: boolean;
  placeholder?: string;
  onShowLessClick?: () => void;
  className?: string;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isCheckboxFilter = filterType === FilterType.CHECKBOX;
  const [hasSelectedFilter, toggleHasSelectedFilter] = useToggle(false);
  const [options, setOptions] = useQueryParams({
    [sectionId]: ArrayParam,
    page: NumberParam,
    [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
    [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
  });
  const queryCheckboxFilterIds = useMemo(
    () => (options[sectionId] ?? []) as string[],
    [options, sectionId]
  );
  const resetPageValue = resetPageOnFilterSelection ? undefined : options.page;

  const onToggle = useCallback(
    (id: string[]) => {
      if (!hasSelectedFilter) {
        toggleHasSelectedFilter();
      }

      if (isCheckboxFilter) {
        onFilterToggle(
          id,
          selectedFilters => {
            setOptions(
              {
                [sectionId]: selectedFilters,
                page: resetPageValue,
                ...(resetPageOnFilterSelection
                  ? {
                      [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
                      [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
                    }
                  : {}),
              },
              QueryParamTypes.PUSH_IN
            );
          },
          queryCheckboxFilterIds
        );
      } else {
        setOptions(
          {
            [sectionId]: [id],
            page: resetPageValue,
            ...(resetPageOnFilterSelection
              ? {
                  [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
                  [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
                }
              : {}),
          },
          QueryParamTypes.PUSH_IN
        );
      }
    },
    [
      hasSelectedFilter,
      isCheckboxFilter,
      queryCheckboxFilterIds,
      resetPageOnFilterSelection,
      resetPageValue,
      sectionId,
      setOptions,
      toggleHasSelectedFilter,
    ]
  );
  const [filterName, setFilterName] = useState("");
  const [matchedFilterIds, setMatchedFilterIds] = useState<string[] | null>(null);
  const searchInsideFiltersAvailable =
    canSearchInsideFilters && filters.length > DESKTOP_FILTER_ITEMS;

  const filtersWithActualCheckedParam = filters.map(filter => ({
    ...filter,
    checked: filter.checked || queryCheckboxFilterIds?.includes(filter.id),
  }));

  const selectedFilterIds = filtersWithActualCheckedParam.filter(f => f.checked).map(f => f.id);
  const Option = isCheckboxFilter ? Checkbox : RadioButton;

  const visibleFilters = matchedFilterIds
    ? filtersWithActualCheckedParam.filter(f => matchedFilterIds.includes(f.id))
    : filtersWithActualCheckedParam;

  const filtersCheckboxes = visibleFilters.map(filter => {
    const idList = filter.idList || [filter.id];
    return (
      <OptionWrapper key={filter.id} onChange={() => onToggle(idList)}>
        <Option
          label={filter.name}
          name={sectionId}
          id={`${filter.id}-${sectionId}`}
          value={filter.id}
          checked={filter.checked}
          readonly={filter.disabled && filter.checked}
          disabled={filter.disabled && !filter.checked}
          color="action"
          onChange={isCheckboxFilter ? undefined : noop}
        />
      </OptionWrapper>
    );
  });

  const hasHiddenSelectionOnMount = useMemo(
    () =>
      !canSearchInsideFilters &&
      selectedFilterIds.length === 0 &&
      filtersWithActualCheckedParam
        .slice(0, NUMBER_OF_FILTERS_VIEWABLE)
        .every(filter => filter.disabled),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { isAutomaticallyExpanded, checkboxSectionId, firstFilters, restFilters } = useMemo(
    () =>
      !canSearchInsideFilters
        ? getExpandableFiltersProps(
            sectionId,
            filtersCheckboxes,
            selectedFilterIds,
            filters,
            hasSelectedFilter,
            hasHiddenSelectionOnMount
          )
        : {
            isAutomaticallyExpanded: false,
            checkboxSectionId: "",
            firstFilters: [],
            restFilters: [],
          },
    [
      canSearchInsideFilters,
      filters,
      filtersCheckboxes,
      hasHiddenSelectionOnMount,
      hasSelectedFilter,
      sectionId,
      selectedFilterIds,
    ]
  );

  const onClearFilterClick = useCallback(() => {
    setOptions(
      {
        [sectionId]: queryCheckboxFilterIds.filter(id => !selectedFilterIds.includes(id)),
        page: resetPageValue,
      },
      QueryParamTypes.PUSH_IN
    );
  }, [setOptions, sectionId, resetPageValue, selectedFilterIds, queryCheckboxFilterIds]);

  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!canSearchInsideFilters) return;

      const { value } = e.currentTarget;

      const inputValue = value ?? "";

      if (inputValue !== "") {
        setFilterName(inputValue);
        setMatchedFilterIds(
          filters
            .filter(f => f.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()))
            .map(f => f.id)
        );
      } else {
        setMatchedFilterIds(null);
        setFilterName("");
      }
    },
    [canSearchInsideFilters, filters]
  );

  // TODO think of splitting this out
  return (
    <FilterContainer className={className} data-testid={`filter-section-${sectionId}`}>
      <FilterHeading
        title={title}
        Icon={Icon}
        numberOfSelectedFilters={selectedFilterIds.length}
        onClearFilterClick={onClearFilterClick}
        skipClear={!isCheckboxFilter}
      />
      {canSearchInsideFilters ? (
        <>
          {searchInsideFiltersAvailable && (
            <SearchFiltersInputWrapper>
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                useDebounce={false}
                onChange={onInput}
                value={filterName}
                Icon={SearchIcon}
                withClearIcon
              />
            </SearchFiltersInputWrapper>
          )}
          <StyledFiltersWrapper data-testid={sectionId ? `${sectionId}-options` : ""}>
            <StyledContentOverflow withScroll={searchInsideFiltersAvailable}>
              {filtersCheckboxes}
            </StyledContentOverflow>
          </StyledFiltersWrapper>
        </>
      ) : (
        <ExpandableFilters
          id={checkboxSectionId}
          first={firstFilters}
          rest={restFilters.length > 0 && restFilters}
          isAutomaticallyExpanded={isAutomaticallyExpanded}
          onShowLessClick={onShowLessClick}
          sectionId={sectionId}
        />
      )}
    </FilterContainer>
  );
};

export default FilterSection;
