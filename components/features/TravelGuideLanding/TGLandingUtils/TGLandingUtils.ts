import {
  fromNameValueToFilters,
  MappingFilterNameToProps,
  MappingFuncType,
} from "../../VacationPackages/utils/vacationSearchFilterUtils";
import { TGSearchQueryParam } from "../useTGSearchQueryParams";

import {
  FilterSectionListItemType,
  FilterSectionListType,
} from "components/ui/Filters/FilterTypes";
import { FilterType } from "types/enums";
import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";

const CountryIcon = CustomNextDynamic(() => import("components/icons/gte-favicon.svg"), {
  loading: IconLoading,
});
const LocationIcon = CustomNextDynamic(() => import("components/icons/gps.svg"), {
  loading: IconLoading,
});

export const filterNameToPropsMapping: {
  [key in keyof TravelGuideTypes.TGDestinationFilters]: MappingFilterNameToProps | undefined;
} = {
  countries: {
    sectionId: TGSearchQueryParam.COUNTRY_IDS,
    title: "Countries",
    Icon: CountryIcon,
    filterType: FilterType.CHECKBOX,
    createFiltersFn: fromNameValueToFilters as MappingFuncType,
  },
  cities: {
    sectionId: TGSearchQueryParam.CITY_IDS,
    title: "Destinations",
    Icon: LocationIcon,
    filterType: FilterType.CHECKBOX,
    createFiltersFn: fromNameValueToFilters as MappingFuncType,
  },
};

export const constructTGSearchFilters = (
  filters?: TravelGuideTypes.TravelGuideSearchFilters,
  t?: TFunction,
  type?: string,
  countryName?: string
): FilterSectionListType | undefined => {
  if (!filters || !t) return undefined;
  return Object.entries(filters).reduce((filterItems, [filterName, values]) => {
    if (type === "InCountry" && filterName === "countries") {
      return [];
    }
    const filterProps =
      filterNameToPropsMapping[filterName as keyof TravelGuideTypes.TGDestinationFilters];
    if (filterProps) {
      const itemFilters = filterProps.createFiltersFn(values!, t);

      if (itemFilters.filters.length) {
        // eslint-disable-next-line functional/immutable-data
        filterItems.push({
          sectionId: filterProps.sectionId,
          title: t(filterProps.title),
          ...([FilterType.CHECKBOX, FilterType.RADIO].includes(filterProps.filterType)
            ? {
                placeholder:
                  filterProps.sectionId === "countryIds"
                    ? t("Find top destinations in country")
                    : t("Search destinations in {countryName}", { countryName }),
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

export const constructTGLandingInput = (countryIds?: string[], cityIds?: string[]) => {
  if (countryIds && countryIds?.length > 0 && cityIds && cityIds?.length > 0) {
    let filtered: string[] = [];
    for (let i = 0; i < countryIds.length; i += 1) {
      filtered = [
        ...filtered,
        ...cityIds.filter(element => {
          return element.indexOf(countryIds[i]) !== -1;
        }),
      ];
    }
    return {
      countryCodes: countryIds,
      cityIds: filtered,
    };
  }
  return {
    countryCodes: countryIds,
    cityIds,
  };
};

export const getAdminLinks = (id: string) => [
  {
    name: "View page in Hygraph",
    url: `https://app.hygraph.com/98897ab275b1430bab08d8343fa465d4/master/content/fade5b6e0ccf4320b5fc26e01a6f1e19/view/43cc4ba83eef42eca9dad347f8da7c0b/${id}`,
  },
];
