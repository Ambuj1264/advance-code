import { ArrayParam, decodeQueryParams, parseUrl } from "use-query-params";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";

import { FilterSectionListType, SelectedFilter } from "../FilterTypes";

import currencyFormatter from "utils/currencyFormatUtils";
import { scrollSearchPageToTop } from "components/ui/Search/utils/sharedSearchUtils";
import { changeChildrenAgesLength, updateChildrenAgesValue } from "utils/sharedAccommodationUtils";
import { setNumberOfGuestsInLocalStorage } from "utils/localStorageUtils";
import { FilterType } from "types/enums";

export const onFilterToggle = (
  id: string[],
  setFilterArray: (newValue: string[]) => void,
  filterArray = [] as string[]
) => {
  const maybeRemoved = filterArray.filter(duration => !id.includes(duration)) || [];
  if (maybeRemoved.length < filterArray.length) {
    setFilterArray(maybeRemoved);
  } else {
    const newDuration = [...filterArray, ...id];
    setFilterArray(newDuration);
  }
};

export const useNumberOfSelectedFilters = (filters: FilterSectionListType) => {
  const { asPath } = useRouter();
  const { query: parsedQuery } = parseUrl(asPath);

  return useMemo(
    () =>
      filters.reduce((acc, filtersSection) => {
        const queryParamName = filtersSection.sectionId;
        const checkedSectionItems = decodeQueryParams(
          {
            [queryParamName]: ArrayParam,
          },
          {
            [queryParamName]: parsedQuery[queryParamName],
          }
        );
        const count = checkedSectionItems[queryParamName]?.length || 0;
        const rangeCount = checkedSectionItems[queryParamName] ? 1 : 0;
        const filterCount = filtersSection.type === FilterType.RANGE ? rangeCount : count;
        return acc + filterCount;
      }, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, asPath]
  );
};

export const isFilterDisabled = (
  disabled: boolean,
  defaultChecked: boolean,
  disableDefaultCheckedFilter: boolean
) => {
  if (!disabled) return false;
  return !(defaultChecked && !disableDefaultCheckedFilter);
};

export const getBarHeight = (
  filters: SearchPageTypes.RangeFilter[],
  index: number,
  barLength: number,
  lastBar: boolean
) => {
  const filtersInRange = filters.filter(filter => {
    return (
      Number(filter.id) >= index &&
      Number(filter.id) < index + (lastBar ? barLength + 1 : barLength)
    );
  });
  const totalCount = filtersInRange.reduce((sum: number, item: SearchPageTypes.RangeFilter) => {
    return sum + item.count;
  }, 0);
  const filterCounts = filters.map(fi => fi.count);
  const maxCount = Math.max(...filterCounts);
  /* setting the height as percentage of 80% of total height,
  and adding 20% so the min height will be 20% */
  return totalCount > 0 ? (totalCount / maxCount) * 80 + 20 : 0;
};

export const updateChildrenAgesUtil = (
  childrenAges: number[],
  value: number,
  index: number,
  adults: number
) => {
  const updatedChildrenAges = updateChildrenAgesValue(childrenAges, value, index);
  setNumberOfGuestsInLocalStorage({
    adults,
    children: updatedChildrenAges,
  });
  return updatedChildrenAges;
};

export const setNumberOfGuestsByTypeUtil = (
  type: string,
  number: number,
  adults: number,
  childrenAges: number[]
) => {
  const isChildren = type === "children";
  // "childs" - because we can't have a  "children" as property name of context.
  const keyStoreName = isChildren ? "childs" : type;
  const actualAdults = isChildren ? adults : number;
  const actualChildrenAges = isChildren
    ? changeChildrenAgesLength(childrenAges, number)
    : childrenAges;
  setNumberOfGuestsInLocalStorage({
    adults: actualAdults,
    children: actualChildrenAges,
  });
  return { type: keyStoreName, actualChildrenAges };
};

// scroll to top on unmount, in case search was performed
export const useScrollTopOnUnmount = (isLoading: boolean, totalResults?: number) => {
  const shouldScrollToTopRef = useRef<boolean>(isLoading);

  useEffect(() => {
    if ((isLoading && !shouldScrollToTopRef.current) || totalResults === undefined) {
      // eslint-disable-next-line functional/immutable-data
      shouldScrollToTopRef.current = true;
    }
  }, [isLoading, totalResults]);

  useEffect(
    () => () => {
      if (shouldScrollToTopRef.current) {
        requestAnimationFrame(() => scrollSearchPageToTop({ behavior: "auto" }));
      }
    },
    [shouldScrollToTopRef]
  );
};

export const getSectionTypeFilters = (filters: FilterSectionListType, sectionId: string) =>
  (filters.find(filter => filter.sectionId === sectionId)?.filters ??
    []) as SearchPageTypes.Filter[];

export const getSectionTypeSelectedFilters = (
  filters: SearchPageTypes.Filter[],
  queryParamFilters: string[],
  sectionId: string,
  filterType: FilterType
) =>
  filters
    .filter((filter: SearchPageTypes.Filter) =>
      queryParamFilters.some(qpfilter => (filter.idList || [filter.id]).includes(qpfilter))
    )
    .map((filteredFilter: SearchPageTypes.Filter) => ({
      sectionId,
      value: filteredFilter.idList || [filteredFilter.id],
      name: filteredFilter.name,
      queryParamList: queryParamFilters,
      filterType,
    })) as SelectedFilter[];

export const getPriceSelectedFilter = (
  sectionId: string,
  currencyCode: string,
  convertCurrency: (value: number) => number,
  priceQueryFilter?: string[]
) =>
  priceQueryFilter
    ? {
        sectionId,
        value: priceQueryFilter,
        name: `${currencyFormatter(
          convertCurrency(Number(priceQueryFilter[0]))
        )}-${currencyFormatter(convertCurrency(Number(priceQueryFilter[1])))} ${currencyCode}`,
        queryParamList: priceQueryFilter,
        filterType: FilterType.RANGE,
      }
    : undefined;
