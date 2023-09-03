import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { ArrayParam, useQueryParams, NumberParam, StringParam } from "use-query-params";

import FilterHeading from "./FilterHeading";
import FilterButton from "./FilterButton";
import { onFilterToggle } from "./utils/filtersUtils";
import { FilterContainer } from "./shared";

import { gutters } from "styles/variables";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { FilterSectionType } from "components/ui/Filters/FilterTypes";
import { CursorPaginationQueryParams, SharedFilterQueryParams } from "types/enums";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${gutters.small / 2}px;
`;

const ButtonFilterSection = ({
  sectionId,
  filters,
  Icon,
  title,
  disableDefaultCheckedFilter,
  resetPageOnFilterSelection,
  useSingleSelection = false,
}: FilterSectionType & {
  disableDefaultCheckedFilter?: boolean;
  resetPageOnFilterSelection?: boolean;
  useSingleSelection?: boolean;
}) => {
  const [options, setOptions] = useQueryParams({
    [sectionId]: ArrayParam,
    [SharedFilterQueryParams.PAGE]: NumberParam,
    [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
    [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
  });
  const page = resetPageOnFilterSelection ? 1 : options.page;
  const onToggle = useCallback(
    (id: string) => {
      onFilterToggle(
        [id],
        selectedOption => {
          const sectionSelectedOption =
            useSingleSelection && selectedOption?.length > 1
              ? [selectedOption[selectedOption.length - 1]]
              : selectedOption;
          setOptions(
            {
              [sectionId]: sectionSelectedOption,
              page,
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
        options[sectionId] as string[]
      );
    },
    [options, page, resetPageOnFilterSelection, sectionId, setOptions]
  );

  const filtersWithActualCheckedParam = filters.map(filter => ({
    ...filter,
    checked: (options[sectionId] as string[])?.includes(filter.id) || Boolean(filter.checked),
  }));

  const resetFilterSectionFilter = filters.find(filter => filter.resetFilterSection === true);

  let actualFilters = filtersWithActualCheckedParam;

  if (resetFilterSectionFilter) {
    actualFilters = filtersWithActualCheckedParam.filter(
      filter => filter.resetFilterSection !== true
    );
  }

  const selectedFilterIds = filtersWithActualCheckedParam.filter(f => f.checked).map(f => f.id);

  const onClearFilterClick = useCallback(() => {
    setOptions(
      {
        [sectionId]: (options[sectionId] as string[])?.filter(
          id => !selectedFilterIds.includes(id)
        ),
        page,
      },
      QueryParamTypes.PUSH_IN
    );
  }, [options, page, sectionId, selectedFilterIds, setOptions]);

  return (
    <FilterContainer data-testid={`filter-section-${sectionId}`}>
      <FilterHeading
        title={title}
        Icon={Icon}
        numberOfSelectedFilters={selectedFilterIds.length}
        onClearFilterClick={onClearFilterClick}
      />
      <Wrapper>
        {resetFilterSectionFilter && (
          <FilterButton
            onClick={onClearFilterClick}
            id={resetFilterSectionFilter.id}
            defaultChecked={Boolean(!selectedFilterIds.length)}
            disableDefaultCheckedFilter
          >
            {resetFilterSectionFilter.name}
          </FilterButton>
        )}
        {actualFilters.map(filter => (
          <FilterButton
            key={filter.id}
            onClick={onToggle}
            id={filter.id}
            defaultChecked={filter.checked}
            disabled={filter.disabled}
            disableDefaultCheckedFilter={disableDefaultCheckedFilter}
          >
            {filter.name}
          </FilterButton>
        ))}
      </Wrapper>
    </FilterContainer>
  );
};

export default ButtonFilterSection;
