import React from "react";

import { VacationPackageSearchQueryParam } from "./useVacationSearchQueryParams";

import {
  getSectionTypeSelectedFilters,
  getSectionTypeFilters,
  getPriceSelectedFilter,
} from "components/ui/Filters/utils/filtersUtils";
import {
  FilterSectionListItemType,
  FilterSectionListType,
} from "components/ui/Filters/FilterTypes";
import { FilterType } from "types/enums";
import TravelerIcon from "components/icons/traveler.svg";
import VacationIcon from "components/icons/pin-flag.svg";
import LocationIcon from "components/icons/gps.svg";
import CalendarClockIcon from "components/icons/calendar-clock.svg";
import PriceRangeIcon from "components/icons/price-range.svg";
import CountryIcon from "components/icons/country-origin.svg";
import { constructDisabledFilter } from "components/features/SearchPage/utils/searchUtils";

// TODO: we might want to ask backend to use the same values
// Key is important as well as the value, key is used on product page and value is used in vp search.
export enum VacationPackageVpTypeEnum {
  Activity = "ACTIVITY",
  AllInclusive = "ALL_INCLUSIVE",
  Beach = "BEACH",
  CheapHoliday = "CHEAP_HOLIDAY",
  CityBreak = "CITY_BREAK",
  Family = "FAMILY",
  Cheap = "CHEAP",
  Luxury = "LUXURY",
  MultiCountry = "MULTI_COUNTRY",
  Nature = "NATURE",
  RoadTrip = "ROAD_TRIP",
  RomanticGetaway = "ROMANTIC_GETAWAY",
  VpTopLevel = "VP_TOP_LEVEL",
  WeekendBreak = "WEEKEND_BREAK",
  SkiTrip = "SKI_TRIP",
}

export type VacationPackageVpType = keyof typeof VacationPackageVpTypeEnum;
export type VacationPackageVpValues = typeof VacationPackageVpTypeEnum[VacationPackageVpType];

export const encodeVPTypeFilterValue = (
  id: string,
  vpCategoryType: QueryVacationPackagesSearchTypes.VacationPackageCategoryTypeFilter
) => {
  return `id:${id}-type:${vpCategoryType}`;
};

const vpTypeFilterRegexp = /id:(.+)-type:(.+)/;

const decodeVPTypeFilterValue = (
  filterValue: string
): {
  id: VacationPackageVpValues | null;
  vpCategoryType: QueryVacationPackagesSearchTypes.VacationPackageCategoryTypeFilter | null;
} => {
  const match = vpTypeFilterRegexp.exec(filterValue);

  if (!match) {
    return {
      id: null,
      vpCategoryType: null,
    };
  }

  return {
    id: match[1] as VacationPackageVpValues,
    vpCategoryType: match[2] as QueryVacationPackagesSearchTypes.VacationPackageCategoryTypeFilter,
  };
};

export const decodeVpFilterTypeValues = (types?: string[]) =>
  types?.reduce(
    (acc, value) => {
      const { id, vpCategoryType } = decodeVPTypeFilterValue(value);
      if (!id || !vpCategoryType) return acc;

      if (Array.isArray(acc[vpCategoryType])) {
        acc[vpCategoryType]!.push(id);
      } else {
        // eslint-disable-next-line functional/immutable-data
        acc[vpCategoryType] = [id];
      }

      return acc;
    },
    {} as {
      [key in QueryVacationPackagesSearchTypes.VacationPackageCategoryTypeFilter]?: [
        VacationPackageVpValues
      ];
    }
  );

export const fromNameValueToFilters = (
  filterValues: {
    id: string | number | number[] | string[];
    name: string;
    available?: boolean;
    type?: QueryVacationPackagesSearchTypes.VacationPackageCategoryTypeFilter;
  }[]
): { filters: SearchPageTypes.Filter[] } => {
  return {
    filters: filterValues.map(({ id, name, available, type }) => {
      const isArray = Array.isArray(id);
      const idString = isArray ? String(id[0]) : String(id);
      const maybeVPCategoryTypeId = type ? encodeVPTypeFilterValue(idString, type) : idString;

      return {
        id: maybeVPCategoryTypeId,
        name: String(name),
        disabled: available === false,
        idList: isArray ? id.map(item => String(item)) : undefined,
      };
    }),
  };
};

const fromNumericDaysToFilters = (
  filterValues: number[],
  t: TFunction
): { filters: SearchPageTypes.Filter[] } => {
  return {
    filters: filterValues.map(number => ({
      id: String(number),
      name: t("{numberOfDays} days", {
        numberOfDays: number,
      }),
    })),
  };
};

const fromPriceToFilters = (
  filterValues: { minValue: number; maxValue: number; count: number }[]
): SearchPageTypes.RangeFilters => {
  let rangeMinValue = Number.MAX_VALUE;
  let rangeMaxValue = Number.MIN_VALUE;

  const filters = filterValues.reduce((allFilters, currentFilter) => {
    if (currentFilter.count > 0) {
      rangeMinValue = Math.min(currentFilter.minValue, rangeMinValue);
      rangeMaxValue = Math.max(currentFilter.maxValue, rangeMaxValue);

      return [...allFilters, { id: String(currentFilter.maxValue), count: currentFilter.count }];
    }
    return allFilters;
  }, [] as SearchPageTypes.RangeFilter[]);

  return {
    min: rangeMinValue,
    max: rangeMaxValue,
    filters,
  };
};

type MappingFuncArguments =
  | {
      id: string | number | string[] | number[];
      name: string;
      available?: boolean;
    }[]
  | number[]
  | {
      minValue: number;
      maxValue: number;
      count: number;
    }[];

export type MappingFuncType = (
  filterValues: MappingFuncArguments,
  t?: TFunction
) => { filters: SearchPageTypes.Filter[] } | SearchPageTypes.RangeFilters;

export type MappingFilterNameToProps = {
  sectionId: string;
  title: string;
  Icon: React.ElementType;
  filterType: FilterType;
  createFiltersFn: MappingFuncType;
};

const filterNameToPropsMapping: {
  [key in QueryVacationPackagesSearchTypes.VacationPackageSearchFiltersKeysWithoutNumberOfDays]:
    | MappingFilterNameToProps
    | undefined;
} = {
  types: {
    sectionId: VacationPackageSearchQueryParam.TYPES,
    title: "Types",
    Icon: VacationIcon,
    filterType: FilterType.BUTTONS,
    createFiltersFn: fromNameValueToFilters as MappingFuncType,
  },
  countries: {
    sectionId: VacationPackageSearchQueryParam.COUNTRY_IDS,
    title: "Countries",
    Icon: CountryIcon,
    filterType: FilterType.CHECKBOX,
    createFiltersFn: fromNameValueToFilters as MappingFuncType,
  },
  activitiesList: {
    sectionId: VacationPackageSearchQueryParam.ACTIVITY_IDS,
    title: "Attractions",
    Icon: TravelerIcon,
    filterType: FilterType.CHECKBOX,
    createFiltersFn: fromNameValueToFilters as MappingFuncType,
  },
  destinationsList: {
    sectionId: VacationPackageSearchQueryParam.DESTINATION_IDS,
    title: "Destinations",
    Icon: LocationIcon,
    filterType: FilterType.CHECKBOX,
    createFiltersFn: fromNameValueToFilters as MappingFuncType,
  },
  allDays: {
    sectionId: VacationPackageSearchQueryParam.NUMBER_OF_DAYS,
    title: "Duration",
    Icon: CalendarClockIcon,
    filterType: FilterType.BUTTONS,
    createFiltersFn: fromNumericDaysToFilters as MappingFuncType,
  },
  price: {
    sectionId: VacationPackageSearchQueryParam.PRICE,
    title: "Price",
    Icon: PriceRangeIcon,
    filterType: FilterType.RANGE,
    createFiltersFn: fromPriceToFilters as MappingFuncType,
  },
};

export const constructFiltersWithDaysDisabled = (
  allFilters: FilterSectionListType,
  activeDayIds: number[]
): FilterSectionListType => {
  const activeDayFilters = activeDayIds.map(id => ({
    id: String(id),
    name: String(id),
  }));

  const modifiedAllFilters = allFilters.reduce((filters, filter) => {
    const newFilter = filter;
    if (newFilter.sectionId === VacationPackageSearchQueryParam.NUMBER_OF_DAYS) {
      // eslint-disable-next-line functional/immutable-data
      newFilter.filters = constructDisabledFilter(
        filter.filters as SearchPageTypes.Filter[],
        activeDayFilters as SearchPageTypes.Filter[]
      );
    }

    // eslint-disable-next-line functional/immutable-data
    filters.push(newFilter);
    return filters;
  }, [] as FilterSectionListType);

  return modifiedAllFilters;
};

export const addAllDaysToDayFilters = (
  allFilterSections: FilterSectionListType,
  t: TFunction
): FilterSectionListType => {
  return allFilterSections.reduce((filterSections, filterSection) => {
    if (filterSection.sectionId === VacationPackageSearchQueryParam.NUMBER_OF_DAYS) {
      const modifiedFilterSection = {
        ...filterSection,
        filters: [...filterSection.filters],
      } as FilterSectionListItemType;
      // eslint-disable-next-line functional/immutable-data
      modifiedFilterSection.filters.push({
        name: t("All days"),
        id: "all-days-filter",
        resetFilterSection: true,
      } as SearchPageTypes.Filter & SearchPageTypes.RangeFilter);

      return [...filterSections, modifiedFilterSection];
    }

    return [...filterSections, filterSection];
  }, [] as FilterSectionListType);
};

export const constructVacationSearchFilters = (
  filters: QueryVacationPackagesSearchTypes.VacationPackageSearchFilters,
  t: TFunction
): FilterSectionListType => {
  return Object.entries(filters).reduce((filterItems, [filterName, values]) => {
    const skipCountryFilter = filterName === "countries" && values?.length <= 1;
    if (skipCountryFilter || values === null) {
      return filterItems;
    }
    const filterProps =
      filterNameToPropsMapping[
        filterName as QueryVacationPackagesSearchTypes.VacationPackageSearchFiltersKeysWithoutNumberOfDays
      ];
    if (filterProps) {
      const itemFilters = filterProps.createFiltersFn(values!, t);

      if (itemFilters.filters.length) {
        // eslint-disable-next-line functional/immutable-data
        filterItems.push({
          sectionId: filterProps.sectionId,
          title: t(filterProps.title),
          ...([FilterType.CHECKBOX, FilterType.RADIO].includes(filterProps.filterType)
            ? {
                placeholder: t("Search"),
              }
            : {}),
          Icon: filterProps.Icon,
          type: filterProps.filterType,
          ...itemFilters,
        } as FilterSectionListItemType);
      }
    }

    return filterItems;
  }, [] as FilterSectionListType) as FilterSectionListType;
};

export const getVPSelectedFilters = ({
  numberOfDays,
  activityIds,
  destinationIds,
  countryIds,
  types,
  price,
  filters,
  currencyCode,
  convertCurrency,
}: {
  numberOfDays?: number[];
  activityIds?: string[];
  destinationIds?: number[];
  countryIds?: string[];
  types?: string[];
  price?: number[];
  filters?: FilterSectionListType;
  currencyCode: string;
  convertCurrency: (value: number) => number;
}) => {
  if (!filters) {
    return [];
  }
  const strNumberOfDays = numberOfDays?.map(nd => String(nd));
  const strDestinationIds = destinationIds?.map(dest => String(dest));
  const strPrice = price?.map(pr => String(pr));
  const numberOfDaysFilters = getSectionTypeFilters(
    filters,
    VacationPackageSearchQueryParam.NUMBER_OF_DAYS
  );
  const selectedNumberOfDays = strNumberOfDays
    ? getSectionTypeSelectedFilters(
        numberOfDaysFilters,
        strNumberOfDays,
        VacationPackageSearchQueryParam.NUMBER_OF_DAYS,
        FilterType.BUTTONS
      )
    : [];
  const typesFilters = getSectionTypeFilters(filters, VacationPackageSearchQueryParam.TYPES);
  const selectedTypes = types
    ? getSectionTypeSelectedFilters(
        typesFilters,
        types,
        VacationPackageSearchQueryParam.TYPES,
        FilterType.BUTTONS
      )
    : [];
  const countriesFilters = getSectionTypeFilters(
    filters,
    VacationPackageSearchQueryParam.COUNTRY_IDS
  );
  const selectedCountries = countryIds
    ? getSectionTypeSelectedFilters(
        countriesFilters,
        countryIds,
        VacationPackageSearchQueryParam.COUNTRY_IDS,
        FilterType.CHECKBOX
      )
    : [];
  const activitiesFilters = getSectionTypeFilters(
    filters,
    VacationPackageSearchQueryParam.ACTIVITY_IDS
  );
  const selectedActivities = activityIds
    ? getSectionTypeSelectedFilters(
        activitiesFilters,
        activityIds,
        VacationPackageSearchQueryParam.ACTIVITY_IDS,
        FilterType.CHECKBOX
      )
    : [];
  const destinationsFilters = getSectionTypeFilters(
    filters,
    VacationPackageSearchQueryParam.DESTINATION_IDS
  );
  const selectedDestinations = strDestinationIds
    ? getSectionTypeSelectedFilters(
        destinationsFilters,
        strDestinationIds,
        VacationPackageSearchQueryParam.DESTINATION_IDS,
        FilterType.CHECKBOX
      )
    : [];
  const selectedPrice = getPriceSelectedFilter(
    VacationPackageSearchQueryParam.PRICE,
    currencyCode,
    convertCurrency,
    strPrice
  );
  return [
    ...selectedNumberOfDays,
    ...selectedTypes,
    ...selectedCountries,
    ...selectedActivities,
    ...selectedDestinations,
    ...(selectedPrice ? [selectedPrice] : []),
  ];
};
