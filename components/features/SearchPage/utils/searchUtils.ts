import { Fragment, useMemo } from "react";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  encodeQueryParams,
  stringify,
  NumericArrayParam,
} from "use-query-params";

import getPriceRangeSetting from "../queries/PriceRangeSettingQuery.graphql";

import { longCacheHeaders, shouldSkipBreadcrumbsQuery } from "utils/apiUtils";
import { getGuestsFromLocalStorage } from "utils/localStorageUtils";
import { FilterSectionListType } from "components/ui/Filters/FilterTypes";
import { constructProductSpecs } from "components/ui/Information/informationUtils";
import { constructProductProps } from "components/ui/utils/uiUtils";
import CategoryHeaderQuery from "components/features/SearchPage/queries/CategoryHeaderQuery.graphql";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import FAQQuery from "components/features/SearchPage/queries/FAQQuery.graphql";
import CategoryOverviewQuery from "components/features/SearchPage/Categories/CategoryOverviewQuery.graphql";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import TourSearchStartingLocationsQuery from "components/features/SearchPage/queries/TourSearchStartingLocationsQuery.graphql";
import {
  PageType,
  LandingPageType,
  FilterType,
  FilterQueryEnum,
  FilterQueryParam,
  Product,
} from "types/enums";
import { constructImage } from "utils/globalUtils";
import {
  getSectionTypeSelectedFilters,
  getPriceSelectedFilter,
} from "components/ui/Filters/utils/filtersUtils";

export const normalizeCategoryHeaderData = ({
  tourCategoryHeader: {
    name,
    description,
    imageUrl,
    averageReviewScore,
    reviewCount,
    pageAboutTitle,
    pageAboutDescription,
  },
}: SearchPageTypes.QueryCategoryHeader): SharedTypes.CategoryHeaderData => ({
  title: name,
  description,
  images: [
    {
      id: "0",
      url: imageUrl,
      name,
    },
  ] as Image[],
  reviewTotalScore: averageReviewScore,
  reviewTotalCount: reviewCount,
  pageAboutTitle,
  pageAboutDescription,
});

export const getTotalSaved = (price?: number, basePrice?: number) => {
  if (price === undefined || basePrice === undefined || price === basePrice) {
    return undefined;
  }
  return basePrice - price;
};

export const constructSearchTour = (
  queryTour: SharedTypes.QueryTour,
  queryParams?: string
): SharedTypes.Product => ({
  id: queryTour.id,
  headline: queryTour.name,
  description: queryTour.description,
  linkUrl: `${queryTour.linkUrl}${queryParams || ""}`,
  averageRating: parseFloat(`${queryTour.averageRating}`),
  reviewsCount: queryTour.reviewsCount,
  price: queryTour.price,
  image: constructImage(queryTour.image),
  ribbonLabelText: queryTour.banner?.text,
  totalSaved: getTotalSaved(queryTour.price, queryTour.basePrice),
  specs: constructProductSpecs(queryTour.specs.slice(0, 4)),
  props: constructProductProps(queryTour.props),
  ssrPrice: queryTour.ssrPrice,
});

export const constructClientTours = (
  queryTours: SharedTypes.QueryTour[],
  clientData?: SharedTypes.TourClientData[],
  queryParams?: string
): SharedTypes.Product[] => {
  const searchTours = queryTours.map(queryTour => constructSearchTour(queryTour, queryParams));
  if (!clientData) return searchTours;
  return searchTours.map(tour => {
    const clientTour = clientData.find(client => client.id === tour.id);
    if (!clientTour) {
      return {
        ...tour,
        price: tour.ssrPrice,
      };
    }
    return {
      ...tour,
      price: clientTour.price,
      totalSaved: getTotalSaved(clientTour.price, clientTour.basePrice),
      ribbonLabelText: clientTour.banner?.text,
    };
  });
};

export const constructDisabledFilter = (
  defaultFilter: SearchPageTypes.Filter[],
  activeFilter: SearchPageTypes.Filter[]
) =>
  defaultFilter.map(someFilter => ({
    ...someFilter,
    disabled:
      activeFilter.filter(maybeDisabledFilter => maybeDisabledFilter.id === someFilter.id)
        .length === 0,
  }));

export const constructPriceRangeFilter = (priceRange: SearchPageTypes.PriceRange[]) => {
  const priceValues = priceRange.reduce(
    ({ minValue, maxValue }, currentValue) => {
      return {
        minValue: minValue > 0 ? Math.min(minValue, currentValue.min) : currentValue.min,
        maxValue: Math.max(maxValue, currentValue.max),
      };
    },
    { minValue: 0, maxValue: 0 }
  );

  return {
    min: priceValues.minValue,
    max: priceValues.maxValue,
    filters:
      priceRange?.map(price => ({
        id: String(price.max),
        count: price.count,
      })) ?? [],
  };
};

export const constructFilters = (
  defaultFilters?: SearchPageTypes.Filters,
  filters?: SearchPageTypes.Filters
) => {
  if (!defaultFilters)
    return {
      durations: [],
      activities: [],
      attractions: [],
    };

  if (!filters) {
    if (defaultFilters.priceRange) {
      return {
        ...defaultFilters,
        price: constructPriceRangeFilter(defaultFilters.priceRange),
      };
    }
    return defaultFilters;
  }

  const outputFilters = {
    durations: constructDisabledFilter(defaultFilters?.durations ?? [], filters?.durations ?? []),
    activities: constructDisabledFilter(
      defaultFilters?.activities ?? [],
      filters?.activities ?? []
    ),
    attractions: constructDisabledFilter(
      defaultFilters?.attractions ?? [],
      filters?.attractions ?? []
    ),
  };

  const priceRange = filters.priceRange ?? defaultFilters.priceRange;

  if (priceRange) {
    return {
      ...outputFilters,
      price: constructPriceRangeFilter(priceRange),
    };
  }

  return outputFilters;
};

export const getFAQVariables = ({
  slug,
  landingPage,
  pageType,
  locale,
}: {
  slug?: string;
  landingPage?: LandingPageType;
  pageType?: PageType;
  locale?: string;
}) => {
  return {
    ...(slug
      ? {
          slug,
          pageType: pageType?.toUpperCase(),
        }
      : {
          landingPage: landingPage?.toUpperCase(),
        }),
    locale,
  };
};

export const getTourSearchAndCategoryQueries = ({
  slug,
  path,
  pageType,
  landingPageType,
  pageNumber,
  frontValuePropsProductType,
}: {
  slug?: string;
  path?: string;
  pageType: PageType;
  landingPageType?: LandingPageType;
  pageNumber?: number;
  frontValuePropsProductType?: Product;
}) => [
  {
    query: CategoryHeaderQuery,
    variables: { slug },
    isRequiredForPageRendering: true,
  },
  {
    query: FAQQuery,
    variables: getFAQVariables({
      slug,
      landingPage: landingPageType,
      pageType,
    }),
  },
  {
    query: BreadcrumbsQuery,
    variables: {
      slug,
      type: pageType.toUpperCase(),
      landingPageType: landingPageType?.toUpperCase(),
    },
    skip: shouldSkipBreadcrumbsQuery({ slug, type: pageType.toUpperCase() }),
    context: { headers: longCacheHeaders },
  },
  {
    query: CategoryOverviewQuery,
  },
  {
    query: FrontValuePropsQuery,
    ...(frontValuePropsProductType
      ? { variables: { product_type: frontValuePropsProductType } }
      : null),
  },
  ...(path
    ? [
        {
          query: PageMetadataQuery,
          variables: {
            path: `${path}${pageNumber && pageNumber > 1 ? `?page=${pageNumber}` : ""}`,
          },
          context: { headers: longCacheHeaders },
        },
      ]
    : []),
  {
    query: TourSearchStartingLocationsQuery,
    isRequiredForPageRendering: true,
    context: { headers: longCacheHeaders },
  },
  {
    query: getPriceRangeSetting,
  },
];

export const constructTourFilterSections = (): FilterSectionListType =>
  [FilterQueryEnum.DURATION_IDS, FilterQueryEnum.ACTIVITY_IDS, FilterQueryEnum.ATTRACTION_IDS].map(
    filterQueryParam => ({
      sectionId: filterQueryParam,
      filters: [],
      title: filterQueryParam,
      Icon: Fragment,
      type: FilterType.CHECKBOX,
    })
  );

export const getStartingLocationItems = ({
  startingLocationsResult,
  defaultSelectedLocation,
}: {
  startingLocationsResult: SearchPageTypes.Filter[];
  defaultSelectedLocation?: SearchPageTypes.Filter;
}) => {
  return {
    startingLocationItems: startingLocationsResult,
    ...(defaultSelectedLocation && {
      selectedLocationId: defaultSelectedLocation?.id || startingLocationsResult[0]?.id,
      selectedLocationName: defaultSelectedLocation?.name || startingLocationsResult[0]?.name,
    }),
  };
};

export const useSearchQueryParams = () =>
  useQueryParams({
    [FilterQueryParam.STARTING_LOCATION_ID]: StringParam,
    [FilterQueryParam.ADULTS]: NumberParam,
    [FilterQueryParam.CHILDREN]: NumberParam,
    [FilterQueryParam.CHILDREN_AGES]: NumericArrayParam,
    [FilterQueryParam.DATE_FROM]: StringParam,
    [FilterQueryParam.DATE_TO]: StringParam,
    [FilterQueryParam.STARTING_LOCATION_NAME]: StringParam,
    [FilterQueryParam.PAGE]: NumberParam,
  });

export const useGetNumberOfGuests = (
  queryAdults?: number,
  queryChildrenAges?: number[]
): SharedTypes.NumberOfGuests => {
  const hasTravellersFilter = Boolean(queryAdults) || Boolean(queryChildrenAges?.length);

  return useMemo(
    () =>
      hasTravellersFilter
        ? {
            adults: queryAdults ?? 0,
            children: queryChildrenAges ?? [],
          }
        : getGuestsFromLocalStorage(),
    [hasTravellersFilter, queryAdults, queryChildrenAges]
  );
};

export const getTourQueryParams = (
  adults?: number,
  children?: number,
  childrenAges?: number[],
  dateFrom?: string,
  dateTo?: string,
  startingLocationId?: string,
  startingLocationName?: string
) => {
  if (!adults && !children && !dateFrom && !dateTo) return "";
  return `?${stringify(
    encodeQueryParams(
      {
        [FilterQueryParam.ADULTS]: NumberParam,
        [FilterQueryParam.CHILDREN]: NumberParam,
        [FilterQueryParam.CHILDREN_AGES]: NumericArrayParam,
        [FilterQueryParam.DATE_FROM]: StringParam,
        [FilterQueryParam.DATE_TO]: StringParam,
        [FilterQueryParam.STARTING_LOCATION_ID]: StringParam,
        [FilterQueryParam.STARTING_LOCATION_NAME]: StringParam,
      },
      {
        [FilterQueryParam.ADULTS]: adults,
        [FilterQueryParam.CHILDREN]: children,
        [FilterQueryParam.CHILDREN_AGES]: childrenAges,
        [FilterQueryParam.DATE_FROM]: dateFrom,
        [FilterQueryParam.DATE_TO]: dateTo,
        [FilterQueryParam.STARTING_LOCATION_ID]: startingLocationId,
        [FilterQueryParam.STARTING_LOCATION_NAME]: startingLocationName,
      }
    )
  )}`;
};

export const normalizeTourAutocompleteResults = (
  tourAutocompleteData?: SharedTypes.QueryTourSearchStartingLocations
): SharedTypes.AutocompleteItem[] =>
  tourAutocompleteData?.tourStartingLocations?.map(tourAutoCompleteItem => ({
    ...tourAutoCompleteItem,
    id: String(tourAutoCompleteItem.id),
  })) || [];

export const getIsTourSearchPageIndexed = ({
  isTourCategory,
  metadata,
  page = 1,
  totalPages,
}: {
  isTourCategory: boolean;
  metadata?: PageMetadata;
  page?: number;
  totalPages: number;
}) => {
  const pageMetadata = metadata?.pageMetadata;
  const isMetadataIndexed =
    typeof pageMetadata?.isIndexed === "boolean"
      ? pageMetadata.isIndexed && page <= totalPages + 1
      : undefined;
  const isCategoryIndexed = isTourCategory && (isMetadataIndexed ?? page <= totalPages + 1);

  return isCategoryIndexed;
};

export const getTourSelectedFilters = ({
  durationIds,
  activityIds,
  attractionIds,
  price,
  currencyCode,
  convertCurrency,
  filters,
}: {
  durationIds?: string[];
  activityIds?: string[];
  attractionIds?: string[];
  price?: string[];
  currencyCode: string;
  convertCurrency: (value: number) => number;
  filters: SearchPageTypes.Filters;
}) => {
  const { durations, activities, attractions, price: priceFilters, priceRange } = filters;
  const selectedDurations =
    durationIds && durations
      ? getSectionTypeSelectedFilters(
          durations,
          durationIds,
          FilterQueryParam.DURATION_IDS,
          FilterType.BUTTONS
        )
      : [];
  const selectedActivities =
    activityIds && activities
      ? getSectionTypeSelectedFilters(
          activities,
          activityIds,
          FilterQueryParam.ACTIVITY_IDS,
          FilterType.CHECKBOX
        )
      : [];
  const selectedAttractions =
    attractionIds && attractions
      ? getSectionTypeSelectedFilters(
          attractions,
          attractionIds,
          FilterQueryParam.ATTRACTION_IDS,
          FilterType.CHECKBOX
        )
      : [];

  const selectedPrice =
    price && price.length > 0 && (priceFilters || priceRange)
      ? getPriceSelectedFilter(FilterQueryParam.PRICE, currencyCode, convertCurrency, price)
      : null;

  return [
    ...selectedDurations,
    ...selectedActivities,
    ...selectedAttractions,
    ...(selectedPrice ? [selectedPrice] : []),
  ];
};
