import { pipe } from "fp-ts/lib/pipeable";
import { findFirst, findIndex, modifyAt } from "fp-ts/lib/Array";
import { getOrElse, map } from "fp-ts/lib/Option";
import memoizeOne from "memoize-one";

import {
  areButtonFilterItemsOnAccommodations,
  areCheckboxFitlerItemsOnAccommodations,
} from "./accommodationSearchUtils";

import {
  AccommodationFilterCategoryIconId,
  AccommodationFilterQueryParam,
  AccommodationFilterQueryEnum,
  FilterType,
} from "types/enums";
import { FilterSectionListType, FilterSectionType } from "components/ui/Filters/FilterTypes";
import IconAccommodation from "components/icons/accommodation.svg";
import IconAppliances from "components/icons/appliances.svg";
import IconCatSitting from "components/icons/cat-sitting.svg";
import IconHouseHeart from "components/icons/house-heart.svg";
import IconEntertainment from "components/icons/entertainment.svg";
import IconExtras from "components/icons/extras.svg";
import IconGeneral from "components/icons/general.svg";
import IconPinParking from "components/icons/style-three-pin-parking.svg";
import IconBusiness from "components/icons/business.svg";
import IconRatingStarCircle from "components/icons/rating-star-circle.svg";
import IconReceptionServices from "components/icons/reception-services.svg";
import IconRestarauntForkKnife from "components/icons/restaurant-fork-knife.svg";
import IconTransport from "components/icons/transport.svg";
import IconWeatherSunFilled from "components/icons/weather-sun-filled.svg";
import IconWiFi from "components/icons/wifi.svg";
import { capitalize } from "utils/globalUtils";

const getFilterTypeByIconId = (iconId: string) => {
  if (
    iconId === AccommodationFilterCategoryIconId.STARS ||
    iconId === AccommodationFilterCategoryIconId.CATEGORIES
  ) {
    return FilterType.BUTTONS;
  }
  return FilterType.CHECKBOX;
};

const getIconByFilterIconId = (iconId: string) => {
  switch (iconId) {
    case AccommodationFilterCategoryIconId.STARS:
      return IconRatingStarCircle;
    case AccommodationFilterCategoryIconId.CATEGORIES:
      return IconAccommodation;
    case AccommodationFilterCategoryIconId.EXTRAS:
      return IconExtras;
    case AccommodationFilterCategoryIconId.ENTERTAINMENT:
      return IconEntertainment;
    case AccommodationFilterCategoryIconId.FOOD:
      return IconRestarauntForkKnife;
    case AccommodationFilterCategoryIconId.INTERNET:
      return IconWiFi;
    case AccommodationFilterCategoryIconId.OUTDOORS:
      return IconWeatherSunFilled;
    case AccommodationFilterCategoryIconId.PARKING:
      return IconPinParking;
    case AccommodationFilterCategoryIconId.PETS:
      return IconCatSitting;
    case AccommodationFilterCategoryIconId.RECEPTION:
      return IconReceptionServices;
    case AccommodationFilterCategoryIconId.TRANSPORT:
      return IconTransport;
    case AccommodationFilterCategoryIconId.WELLNESS:
      return IconHouseHeart;
    case AccommodationFilterCategoryIconId.APPLIANCES:
      return IconAppliances;
    case AccommodationFilterCategoryIconId.BUSINESS:
      return IconBusiness;
    case AccommodationFilterCategoryIconId.AMENITIES:
    case AccommodationFilterCategoryIconId.GENERAL:
    default:
      return IconGeneral;
  }
};

const getSectionIdByFilterIconId = (iconId: string) => {
  switch (iconId) {
    case AccommodationFilterCategoryIconId.STARS:
      return AccommodationFilterQueryParam.STARS;
    case AccommodationFilterCategoryIconId.CATEGORIES:
      return AccommodationFilterQueryParam.CATEGORIES;
    case AccommodationFilterCategoryIconId.EXTRAS:
      return AccommodationFilterQueryParam.EXTRAS;
    // Amenities and tons of amenities subcategories
    case AccommodationFilterCategoryIconId.AMENITIES:
    default:
      return AccommodationFilterQueryParam.AMENITIES;
  }
};

const getTitleByFilterName = (name: string, t: TFunction) => {
  // only these category names do not support translations (always EN version)
  // these categories have the same name with iconId
  switch (name) {
    case AccommodationFilterCategoryIconId.STARS:
    case AccommodationFilterCategoryIconId.CATEGORIES:
    case AccommodationFilterCategoryIconId.EXTRAS:
      return t(capitalize(name)); // e.g. categories to Categories
    default:
      return name;
  }
};

export const getOptionMaxCount = (
  options: AccommodationSearchTypes.AccommodationFilterOption[],
  option: AccommodationSearchTypes.AccommodationFilterOption
) =>
  pipe(
    options,
    findFirst(o => o.optionId === option.optionId),
    map(o => Math.max(o.count, option.count)),
    getOrElse(() => option.count)
  );

export const removeDuplicateAccommodationFilterOptions = (
  options: AccommodationSearchTypes.AccommodationFilterOption[]
) => [
  ...new Map(
    options.map(option => [option.name, { ...option, count: getOptionMaxCount(options, option) }])
  ).values(),
];

export const combineFilters = (
  filters: AccommodationSearchTypes.AccommodationFilter[]
): AccommodationSearchTypes.AccommodationFilter[] =>
  filters.reduce(
    (prev, curr) =>
      pipe(
        prev,
        findIndex(filterItem => filterItem.name === curr.name),
        map((index: number) =>
          pipe(
            prev,
            modifyAt(index, (filterItem: AccommodationSearchTypes.AccommodationFilter) => {
              return {
                ...filterItem,
                options: removeDuplicateAccommodationFilterOptions([
                  ...filterItem.options,
                  ...curr.options,
                ]),
              };
            }),
            getOrElse(() => [...prev, curr])
          )
        ),
        getOrElse(() => [...prev, curr])
      ),
    [] as AccommodationSearchTypes.AccommodationFilter[]
  );

export const isFilterGroupOptionDisabled = (
  sectionId: AccommodationFilterQueryEnum,
  optionCount: number,
  hasPrefilledCategory: boolean
) => {
  if (sectionId === AccommodationFilterQueryEnum.CATEGORIES) {
    return hasPrefilledCategory;
  }
  return optionCount === 0 && sectionId !== AccommodationFilterQueryEnum.STARS;
};

const getFilteredAccommodations = memoizeOne(
  (
    accommodations: AccommodationSearchTypes.AccommodationProduct[],
    sectionId: AccommodationFilterQueryEnum,
    queryParamFilters: AccommodationSearchTypes.AccommodationFilterParams
  ) =>
    accommodations.filter(accommodation => {
      const filterByStars =
        sectionId !== AccommodationFilterQueryEnum.STARS
          ? areButtonFilterItemsOnAccommodations(accommodation.stars, queryParamFilters.stars)
          : true;
      const filterByCategories =
        sectionId !== AccommodationFilterQueryEnum.CATEGORIES
          ? areButtonFilterItemsOnAccommodations(
              accommodation.categoryId || 0,
              queryParamFilters.categoryIds
            )
          : true;
      return (
        filterByStars &&
        filterByCategories &&
        areCheckboxFitlerItemsOnAccommodations(
          [...(queryParamFilters?.amenityIds ?? []), ...(queryParamFilters?.extraIds ?? [])],
          accommodation.amenityIds
        )
      );
    })
);

export const isOptionDisabled = (
  optionId: number,
  filteredAccommodations: AccommodationSearchTypes.AccommodationProduct[],
  sectionId: AccommodationFilterQueryEnum,
  hasPrefilledCategory: boolean
) => {
  if (filteredAccommodations.length > 0) {
    if (sectionId === AccommodationFilterQueryEnum.CATEGORIES) {
      return (
        !filteredAccommodations.some(accommodation => accommodation.categoryId === optionId) ||
        hasPrefilledCategory
      );
    }
    if (sectionId === AccommodationFilterQueryEnum.STARS) {
      return !filteredAccommodations.some(accommodation => accommodation.stars === optionId);
    }
    return !filteredAccommodations.some(
      accommodation => accommodation.amenityIds?.some(id => id === optionId) ?? true
    );
  }
  return false;
};

const constructFilterGroupOption = (
  option: AccommodationSearchTypes.AccommodationFilterOption,
  sectionId: AccommodationFilterQueryEnum,
  hasPrefilledCategory: boolean,
  filteredAccommodations: AccommodationSearchTypes.AccommodationProduct[]
) => {
  const isDisabled = isOptionDisabled(
    option.optionId,
    filteredAccommodations,
    sectionId,
    hasPrefilledCategory
  );
  return {
    id: `${option.optionId}`,
    name: option.name,
    disabled: isDisabled,
    checked: option.isPrefilled,
  };
};

const constructFilterGroupOptions = (
  options: AccommodationSearchTypes.AccommodationFilterOption[],
  sectionId: AccommodationFilterQueryEnum,
  accommodations: AccommodationSearchTypes.AccommodationProduct[],
  queryParamFilters: AccommodationSearchTypes.AccommodationFilterParams,
  accommodationCategoryName?: string
) => {
  const hasPrefilledCategory = options.some(
    (option: AccommodationSearchTypes.AccommodationFilterOption) =>
      accommodationCategoryName &&
      accommodationCategoryName.toLowerCase().includes(option.name.toLowerCase())
  );
  const filteredAccommodations = getFilteredAccommodations(
    accommodations,
    sectionId,
    queryParamFilters
  );
  return options
    .filter(option => option.name)
    .map(option =>
      constructFilterGroupOption(option, sectionId, hasPrefilledCategory, filteredAccommodations)
    );
};

const constructFilterGroup = (
  filterGroup: AccommodationSearchTypes.AccommodationFilter,
  t: TFunction,
  accommodations: AccommodationSearchTypes.AccommodationProduct[],
  queryParamFilters: AccommodationSearchTypes.AccommodationFilterParams,
  accommodationCategoryName?: string
) => ({
  type: getFilterTypeByIconId(filterGroup.iconId),
  sectionId: getSectionIdByFilterIconId(filterGroup.iconId),
  filters: constructFilterGroupOptions(
    filterGroup.options,
    getSectionIdByFilterIconId(filterGroup.iconId),
    accommodations,
    queryParamFilters,
    accommodationCategoryName
  ),
  title: getTitleByFilterName(filterGroup.name, t),
  Icon: getIconByFilterIconId(filterGroup.iconId),
});

const mergeFilters = (
  defaultSection: FilterSectionType & { type: FilterType },
  constructedSection: FilterSectionType & { type: FilterType }
) => ({
  ...defaultSection,
  filters: defaultSection.filters.map(defaultFilter => ({
    ...defaultFilter,
    ...("disabled" in defaultFilter && {
      disabled:
        (!constructedSection?.filters.some(
          (filter: SearchPageTypes.Filter) => filter.id === defaultFilter.id
        ) ||
          defaultFilter.disabled ||
          constructedSection?.filters.some(
            (filter: SearchPageTypes.Filter) =>
              "disabled" in filter && filter.id === defaultFilter.id && filter.disabled
          )) ??
        true,
    }),
  })),
});

export const mergeDefaultFiltersWithSearchResultFilters = ({
  defaultFiltersSections,
  filtersSections,
}: {
  defaultFiltersSections: FilterSectionListType;
  filtersSections: FilterSectionListType;
}) =>
  defaultFiltersSections.length > 0
    ? defaultFiltersSections.map(defaultSection => {
        const constructedSection = filtersSections.find(
          section => section.title === defaultSection.title
        );
        return mergeFilters(
          defaultSection as FilterSectionType & { type: FilterType },
          constructedSection as FilterSectionType & { type: FilterType }
        );
      })
    : filtersSections;

export const constructAccommodationFilters = (
  filters: AccommodationSearchTypes.AccommodationFilter[],
  accommodations: AccommodationSearchTypes.AccommodationProduct[],
  t: TFunction,
  queryParamFilters: AccommodationSearchTypes.AccommodationFilterParams,
  accommodationCategoryName?: string
) =>
  combineFilters(filters).map(filterGroup =>
    constructFilterGroup(
      filterGroup,
      t,
      accommodations,
      queryParamFilters,
      accommodationCategoryName
    )
  );

export const shouldDisableDefaultCheckedFilter = (filters: FilterSectionListType) =>
  filters.some(
    filter =>
      filter.sectionId === AccommodationFilterQueryEnum.CATEGORIES &&
      filter.filters.some(
        (option: SearchPageTypes.Filter | SearchPageTypes.RangeFilter) =>
          "disabled" in option && "checked" in option && option.disabled && option.checked
      )
  );
