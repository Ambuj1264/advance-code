import { range, head } from "fp-ts/lib/Array";
import { Fragment } from "react";
import {
  decodeQueryParams,
  encodeQueryParams,
  stringify,
  StringParam,
  NumberParam,
  NumericArrayParam,
  ArrayParam,
} from "use-query-params";
import memoizeOne from "memoize-one";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined } from "fp-ts/lib/Option";

import AccommodationDefaultFilterQuery from "../queries/AccommodationSearchDefaultFilterQuery.graphql";
import HotelSearchCategories from "../queries/HotelSerchCategoriesQuery.graphql";
import { HotelSearchCategoriesTypes } from "../hooks/useAccommodationSearchCategories";
import { StepsEnum } from "../AccommodationSearchWidgetModal/enums";

import { encodeOccupanciesToArrayString } from "./useAccommodationSearchQueryParams";

import { FilterSectionListType } from "components/ui/Filters/FilterTypes";
import { convertImage } from "utils/imageUtils";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { constructProductSpecs } from "components/ui/Information/informationUtils";
import {
  AccommodationFilterQueryEnum,
  AccommodationFilterQueryParam,
  FilterType,
  LandingPageType,
  PageType,
} from "types/enums";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import {
  AccommodationFilterQueryParamsType,
  AccommodationSearchQueryParamScheme,
} from "components/features/AccommodationSearchPage/types/AccommodationSearchQueryParamTypes";
import AccommodationSearchCategoryQuery from "components/features/AccommodationSearchPage/queries/AccommodationSearchCategoryQuery.graphql";
import { constructImage } from "utils/globalUtils";
import {
  byPopularityConstructor,
  byPopularityDescConstructor,
  byPriceConstructor,
  byPriceDescConstructor,
  byRating,
} from "components/ui/Sort/sortUtils";
import { getProductSlugFromHref } from "utils/routerUtils";
import { longCacheHeaders } from "utils/apiUtils";
import { decodeHtmlEntity } from "utils/helperUtils";
import {
  getSectionTypeSelectedFilters,
  getSectionTypeFilters,
} from "components/ui/Filters/utils/filtersUtils";
import { getDatesInFuture } from "components/ui/DatePicker/utils/datePickerUtils";

export const normalizeLocationItems = (locationItems: SharedTypes.AutocompleteItem[]) =>
  locationItems.map(locationItem => ({
    ...locationItem,
    name: decodeHtmlEntity(locationItem.name),
    id: String(locationItem.id),
  }));

export const constructAccommodationCategory = (
  queryCategory: AccommodationSearchTypes.QueryAccommodationSearchCategoryInfo
): AccommodationSearchTypes.AccommodationSearchCategory | undefined => {
  const { hotelSearchCategoryByUri } = queryCategory;
  if (!hotelSearchCategoryByUri) return undefined;
  const {
    id,
    categoryName,
    information,
    informationTitle,
    name,
    description,
    image,
    defaultLocationsList,
  } = hotelSearchCategoryByUri;

  const normalizedDefaultLocationList = normalizeLocationItems(defaultLocationsList);
  const defaultLocation = pipe(head(normalizedDefaultLocationList), toUndefined);

  return {
    id,
    categoryName,
    informationTitle,
    information,
    cover: {
      name,
      description,
      image: constructImage(image),
    },
    defaultLocationsList: normalizedDefaultLocationList,
    location: defaultLocation,
  };
};

const UNRATED = 0;

export const constructSearchHotel = (
  queryHotel: AccommodationSearchTypes.QuerySearchHotel,
  onlySlowSearchLoading?: boolean,
  queryParams?: string
): AccommodationSearchTypes.AccommodationProduct => ({
  id: queryHotel.accommodationId,
  headline: queryHotel.name,
  description: queryHotel.description,
  linkUrl: `${queryHotel.linkUrl}${queryParams || ""}`,
  price: queryHotel.price,
  image: convertImage(queryHotel.image),
  specs: constructProductSpecs(queryHotel.specs.slice(0, 4)),
  stars: queryHotel.stars || UNRATED,
  props: constructProductProps(queryHotel.props),
  ssrPrice: queryHotel.ssrPrice,
  averageRating: queryHotel.reviewTotalScore ? parseFloat(queryHotel.reviewTotalScore) : undefined,
  searchBoost: queryHotel.searchBoost,
  reviewsCount: queryHotel.reviewTotalCount,
  popularity: queryHotel.popularity,
  categoryId: queryHotel.category?.id,
  amenityIds: queryHotel.amenityIds?.map(amenityId => amenityId.id),
  isHighlight: onlySlowSearchLoading ? false : queryHotel.isHighlight,
  isAvailable: onlySlowSearchLoading ? true : queryHotel.isAvailable,
  city: queryHotel.city?.name,
});

export const constructSearchHotels = (
  queryHotels: AccommodationSearchTypes.QuerySearchHotel[]
): AccommodationSearchTypes.AccommodationProduct[] => {
  const hotels = queryHotels.map(hotel => constructSearchHotel(hotel));
  return hotels.map(hotel => {
    return {
      ...hotel,
      price: hotel.ssrPrice,
    };
  });
};

const byPriceAccommodation = byPriceConstructor("price");
const byPriceDescAccommodation = byPriceDescConstructor("price");
const byPopularityAccommodation = byPopularityConstructor("popularity");
const byPopularityAccommodationDesc = byPopularityDescConstructor("popularity");
const bySearchBoost = byPopularityConstructor("searchBoost");

const getSortFns = (orderBy?: string, orderDirection?: string) => {
  if (orderBy === "price") {
    return orderDirection === "desc" ? [byPriceDescAccommodation] : [byPriceAccommodation];
  }
  if (orderBy === "rating") {
    return [bySearchBoost, byRating];
  }

  if (orderBy === "top_reviews") {
    return [];
  }
  return [
    bySearchBoost,
    orderDirection === "desc" ? byPopularityAccommodationDesc : byPopularityAccommodation,
  ];
};

export const sortAccommodationSearchResults = (
  accommodations: AccommodationSearchTypes.AccommodationProduct[],
  orderBy?: string,
  orderDirection?: string
) => {
  const sortFns = getSortFns(orderBy, orderDirection);
  const highlightedAccommodations = accommodations.filter(
    accommodation => accommodation && accommodation.isHighlight
  );
  const restAccommodation = accommodations.filter(
    accommodation => accommodation && !accommodation.isHighlight
  );
  const sortedAccommodations = sortFns.reduce(
    (acc, sortFn) => acc.slice(0).sort(sortFn),
    restAccommodation
  );

  return [...highlightedAccommodations, ...sortedAccommodations];
};

export const guestsInRooms = ({
  adults = 0,
  children = [],
  rooms = 0,
}: {
  adults?: number;
  children?: number[];
  rooms?: number;
}) => {
  const totalRooms = Math.min(adults, rooms);
  const adultsPerRoom = Math.ceil(adults / totalRooms);
  const childrenPerRoom = Math.ceil(children.length / totalRooms);
  let tempAdults = adults;
  let tempChildren = children.length;
  return range(1, totalRooms).map(() => {
    const roomAdults = tempAdults > 0 ? Math.min(adultsPerRoom, tempAdults) : 0;
    const roomChildren = tempChildren > 0 ? Math.min(tempChildren, childrenPerRoom) : 0;
    tempAdults -= roomAdults;
    tempChildren -= roomChildren;
    return {
      adults: roomAdults,
      children: roomChildren,
    };
  });
};

export const getPrefilledCategoryIdFromSlug = (stringifiedAutoFilter: string | null) => {
  if (!stringifiedAutoFilter) return undefined;
  try {
    const categoryFilter = JSON.parse(stringifiedAutoFilter);
    return (categoryFilter?.category_ids as number) ?? undefined;
  } catch {
    return undefined;
  }
};

export const doesAccommodationSearchHaveFilters = (
  queryParams: AccommodationFilterQueryParamsType
) =>
  Boolean(
    (queryParams.id && queryParams.type) ||
      (queryParams.adults && queryParams.adults > 0) ||
      queryParams.children !== undefined ||
      queryParams.dateFrom ||
      queryParams.dateTo ||
      (queryParams.rooms && queryParams.rooms > 0)
  );

export const constructAccommodationSearchQueryVariables = ({
  queryParams,
  slug,
}: {
  queryParams: AccommodationFilterQueryParamsType;
  country?: string;
  slug?: string;
}) => {
  const { dateFrom, dateTo } = queryParams;
  const { fromDate, toDate } = getDatesInFuture(dateFrom, dateTo);
  return {
    date_from: fromDate,
    date_to: toDate,
    rooms: guestsInRooms({
      adults: queryParams[AccommodationFilterQueryParam.ADULTS],
      children: queryParams[AccommodationFilterQueryParam.CHILDREN],
      rooms: queryParams[AccommodationFilterQueryParam.ROOMS],
    }),
    searchPlace: {
      id: queryParams[AccommodationFilterQueryParam.ID],
      type: queryParams[AccommodationFilterQueryParam.TYPE],
    },
    order_by: queryParams[AccommodationFilterQueryParam.ORDER_BY],
    order_direction: queryParams[AccommodationFilterQueryParam.ORDER_DIRECTION],
    page: 1,
    ...(slug ? { slug } : {}),
  };
};

export const decodeAccommodationSearchQueryParams = (queryParams: ParsedUrlQuery) =>
  decodeQueryParams(
    AccommodationSearchQueryParamScheme,
    queryParams
  ) as AccommodationFilterQueryParamsType;

export const getAccommodationSearchAndCategoryQueries = ({
  slug = "",
  path,
  pageType,
  landingPageType,
  pageNumber,
}: {
  slug?: string;
  path?: string;
  pageType?: PageType;
  landingPageType?: LandingPageType;
  hasFilters?: boolean;
  pageNumber?: number;
}): AccommodationSearchTypes.Query[] => {
  const queries = [
    {
      query: PageMetadataQuery,
      context: { headers: longCacheHeaders },
      variables: {
        path: `${path}${pageNumber && pageNumber > 1 ? `?page=${pageNumber}` : ""}`,
      },
    },
    {
      query: AccommodationSearchCategoryQuery,
      variables: { slug },
      isRequiredForPageRendering: true,
    },
    {
      query: BreadcrumbsQuery,
      variables: {
        slug,
        type: pageType?.toUpperCase(),
        landingPageType: landingPageType?.toUpperCase(),
      },
      context: { headers: longCacheHeaders },
    },
    {
      query: FrontValuePropsQuery,
    },
    {
      query: AccommodationDefaultFilterQuery,
    },
    {
      query: HotelSearchCategories,
      variables: {
        type: HotelSearchCategoriesTypes.topTypes,
        slug,
      },
    },
    {
      query: HotelSearchCategories,
      variables: {
        type: HotelSearchCategoriesTypes.topCities,
        slug,
      },
    },
  ] as AccommodationSearchTypes.Query[];

  return queries;
};

export const constructAccommodationFilterSections = (): FilterSectionListType =>
  Object.values({ ...AccommodationFilterQueryEnum }).map(filterQueryParam => ({
    sectionId: filterQueryParam,
    filters: [],
    title: filterQueryParam,
    Icon: Fragment,
    type: FilterType.CHECKBOX,
  }));

export const areButtonFilterItemsOnAccommodations = (item: number, queryItems?: number[]) =>
  queryItems?.includes(item) ?? true;

export const areCheckboxFitlerItemsOnAccommodations = (
  queryItems: number[],
  amenityIds?: number[]
) =>
  queryItems?.every(
    (id: number) => amenityIds?.some((amenityId: number) => amenityId === id) ?? true
  ) ?? true;

export const filterAccommodationSearchResults = memoizeOne(
  (
    accommodations: AccommodationSearchTypes.AccommodationProduct[],
    queryParamFilters: AccommodationSearchTypes.AccommodationFilterParams
  ): AccommodationSearchTypes.AccommodationProduct[] =>
    accommodations.filter(accommodation => {
      return (
        areButtonFilterItemsOnAccommodations(accommodation.stars, queryParamFilters.stars) &&
        areButtonFilterItemsOnAccommodations(
          accommodation.categoryId || 0,
          queryParamFilters.categoryIds
        ) &&
        areCheckboxFitlerItemsOnAccommodations(
          [...(queryParamFilters?.amenityIds ?? []), ...(queryParamFilters?.extraIds ?? [])],
          accommodation.amenityIds
        )
      );
    })
);

export const getCityFromHotelCategorySearch = (
  result: AccommodationSearchTypes.QueryAccommodationSearchCategoryInfo | undefined
) => result?.hotelSearchCategoryByUri?.city || "";

export const getHeaderMessage = (
  t: TFunction,
  isProductCategory: boolean,
  totalAccommodations?: number,
  city?: string,
  isHotelCategoryPage?: boolean
) => {
  if (isProductCategory && city) {
    return t("The best hotels & accommodation in {place}", { place: city });
  }
  if (isProductCategory && isHotelCategoryPage) {
    return t("Popular hotels");
  }
  if (isProductCategory) {
    return t("Our top sellers");
  }
  if (totalAccommodations === 0) {
    return t("0 accommodations match your search");
  }
  return t("See the best accommodations below");
};

export const constructAccommodationSectionsCard = (
  items: AccommodationSearchTypes.QueryAccommodationSearchCategory[]
): LandingPageTypes.LandingPageSectionCard[] =>
  items.map(item => ({
    id: item.id,
    title: item.name,
    image: {
      id: String(item.image.id),
      name: item.image.name,
      alt: item.image.alt,
      url: item.image.url,
    },
    city: item.bindCity,
    slug: getProductSlugFromHref(item.url),
    linkUrl: item.url,
    pageType: PageType.ACCOMMODATION_CATEGORY,
  }));

export const getAccommodationQueryParams = (
  adults?: number,
  children?: number[],
  rooms?: number,
  dateFrom?: string,
  dateTo?: string,
  mealsIncluded?: string[],
  roomPreferences?: string[],
  occupancies?: StayBookingWidgetTypes.Occupancy[]
) =>
  `?${stringify(
    encodeQueryParams(
      {
        [AccommodationFilterQueryParam.ADULTS]: NumberParam,
        [AccommodationFilterQueryParam.CHILDREN]: NumericArrayParam,
        [AccommodationFilterQueryParam.DATE_FROM]: StringParam,
        [AccommodationFilterQueryParam.DATE_TO]: StringParam,
        [AccommodationFilterQueryParam.ROOMS]: NumberParam,
        [AccommodationFilterQueryParam.MEALS_INCLUDED]: ArrayParam,
        [AccommodationFilterQueryParam.ROOM_PREFERENCES]: ArrayParam,
        [AccommodationFilterQueryParam.OCCUPANCIES]: ArrayParam,
      },
      {
        [AccommodationFilterQueryParam.ADULTS]: adults,
        [AccommodationFilterQueryParam.CHILDREN]: children,
        [AccommodationFilterQueryParam.DATE_FROM]: dateFrom,
        [AccommodationFilterQueryParam.DATE_TO]: dateTo,
        [AccommodationFilterQueryParam.ROOMS]: rooms,
        [AccommodationFilterQueryParam.MEALS_INCLUDED]: mealsIncluded,
        [AccommodationFilterQueryParam.ROOM_PREFERENCES]: roomPreferences,
        [AccommodationFilterQueryParam.OCCUPANCIES]: encodeOccupanciesToArrayString(occupancies),
      }
    )
  )}`;

export const getAccommodationSelectedFilters = ({
  stars,
  categoryIds,
  amenityIds,
  extraIds,
  filters,
}: {
  stars?: number[];
  categoryIds?: number[];
  amenityIds?: number[];
  extraIds?: number[];
  filters?: FilterSectionListType;
}) => {
  if (!filters) {
    return [];
  }
  const strStars = stars?.map(st => String(st));
  const strCategoryIds = categoryIds?.map(ca => String(ca));
  const strAmenityIds = amenityIds?.map(am => String(am));
  const strExtraIds = extraIds?.map(ex => String(ex));
  const starFilters = getSectionTypeFilters(filters, AccommodationFilterQueryEnum.STARS);
  const selectedStarRatings = strStars
    ? getSectionTypeSelectedFilters(
        starFilters,
        strStars,
        AccommodationFilterQueryEnum.STARS,
        FilterType.BUTTONS
      )
    : [];

  const categoriesFilters = getSectionTypeFilters(filters, AccommodationFilterQueryEnum.CATEGORIES);
  const selectedCategories = strCategoryIds
    ? getSectionTypeSelectedFilters(
        categoriesFilters,
        strCategoryIds,
        AccommodationFilterQueryEnum.CATEGORIES,
        FilterType.BUTTONS
      )
    : [];
  const filteredAmenities = filters.filter(
    filter => filter.sectionId === AccommodationFilterQueryEnum.AMENITIES
  );
  const amenitiesFilters = filteredAmenities.reduce((combinedAmenities, currentAmenity) => {
    return [...combinedAmenities, ...(currentAmenity.filters as SearchPageTypes.Filter[])];
  }, [] as SearchPageTypes.Filter[]);
  const selectedAmenities = strAmenityIds
    ? getSectionTypeSelectedFilters(
        amenitiesFilters,
        strAmenityIds,
        AccommodationFilterQueryEnum.AMENITIES,
        FilterType.CHECKBOX
      )
    : [];
  const extrasFilters = getSectionTypeFilters(filters, AccommodationFilterQueryEnum.EXTRAS);
  const selectedExtras = strExtraIds
    ? getSectionTypeSelectedFilters(
        extrasFilters,
        strExtraIds,
        AccommodationFilterQueryEnum.EXTRAS,
        FilterType.CHECKBOX
      )
    : [];
  return [...selectedStarRatings, ...selectedCategories, ...selectedAmenities, ...selectedExtras];
};

export const getAccommodationMobileSteps = (
  isSearchResults: boolean,
  staysCurrentStep: StepsEnum,
  selectedDates: SharedTypes.SelectedDates,
  accommodationAddress?: string
) => {
  if (isSearchResults) return [StepsEnum.Details, StepsEnum.Dates];
  const { from, to } = selectedDates;
  const onDatesWithMissingDetails = staysCurrentStep === StepsEnum.Dates && !accommodationAddress;
  const onDetailsWithDates = staysCurrentStep === StepsEnum.Details && from && to;
  if (onDatesWithMissingDetails || onDetailsWithDates) {
    return [StepsEnum.Dates, StepsEnum.Details];
  }
  return [StepsEnum.Details, StepsEnum.Dates];
};
