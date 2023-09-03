import { range } from "fp-ts/lib/Array";
import memoizeOne from "memoize-one";

import { StayFilterSectionType } from "../types/staysSearchEnums";

import {
  constructStaySearchGTEProductProps,
  constructStaySearchGTEProductSpecs,
} from "./staySearchCardProps";

import {
  GraphCMSPageType,
  FilterType,
  StayFilterQueryEnum,
  GraphCMSSubType,
  MapPointType,
} from "types/enums";
import { asPathWithoutQueryParams } from "utils/routerUtils";
import { getAccommodationQueryParams } from "components/features/AccommodationSearchPage/utils/accommodationSearchUtils";
import StarIcon from "components/icons/star.svg";
import PriceIcon from "components/icons/cash-payment-coin.svg";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import RatingIcon from "components/icons/award-star-head.svg";
import MealIcon from "components/icons/restaurant-fork-knife.svg";
import BedroomIcon from "components/icons/bedroom-hotel.svg";
import StayDefaultIcon from "components/icons/extras.svg";
import HotelAmenityIcon from "components/icons/house-heart.svg";
import AccommodationIcon from "components/icons/accommodation.svg";
import { capitalize } from "utils/globalUtils";
import {
  FilterSectionListItemType,
  FilterSectionListType,
  SelectedFilter,
} from "components/ui/Filters/FilterTypes";
import { getMapZoom } from "components/ui/Map/utils/mapUtils";
import {
  getSectionTypeSelectedFilters,
  getSectionTypeFilters,
  getPriceSelectedFilter,
} from "components/ui/Filters/utils/filtersUtils";

export const getStaysSearchPageQueryCondition = memoizeOne((asPath?: string) => ({
  pageType: GraphCMSPageType.Stays,
  metadataUri: asPath ? asPathWithoutQueryParams(asPath) : undefined,
}));

export const constructStaysProductGTE = ({
  card,
  adults,
  children,
  rooms,
  dateFrom,
  dateTo,
  isLoading,
  productId,
  mealsIncluded,
  roomPreferences,
  occupancies,
  t,
}: {
  card: StaysSearchTypes.StaysSearchGTECard;
  t: TFunction;
  adults: number;
  children: number[];
  rooms: number;
  dateFrom?: string;
  dateTo?: string;
  isLoading?: boolean;
  productId?: string;
  mealsIncluded?: string[];
  roomPreferences?: string[];
  occupancies?: StayBookingWidgetTypes.Occupancy[];
}): StaysSearchTypes.StayProduct => {
  const {
    id,
    name,
    description,
    productPageUrl,
    price,
    image,
    isYouJustMissedIt,
    isAboutToSellOut,
    valueProps,
    quickfacts,
    userRatingAverage,
    userRatingsTotal,
  } = card;
  return {
    id,
    headline: name ?? "",
    description,
    linkUrl: productPageUrl
      ? `${productPageUrl}${getAccommodationQueryParams(
          adults,
          children,
          rooms,
          dateFrom,
          dateTo,
          mealsIncluded,
          roomPreferences,
          occupancies
        )}`
      : "",
    price: isLoading ? 0 : price?.price,
    priceDisplayValue: isLoading ? "" : price?.priceDisplayValue ?? "",
    ssrPrice: price?.price ?? 0,
    image: constructGraphCMSImage(GraphCMSPageType.Stays, image, name),
    specs: constructStaySearchGTEProductSpecs(t, quickfacts).slice(0, 4),
    props: constructStaySearchGTEProductProps(t, valueProps),
    averageRating: userRatingAverage,
    reviewsCount: userRatingsTotal,
    isHighlight: String(card.id) === productId,
    isLikelyToSellOut: isAboutToSellOut,
    isAvailable: !isYouJustMissedIt,
  };
};

export const constructStayMapData = (
  stayProduct: StaysSearchTypes.StayProduct
): SharedTypes.MapPoint => {
  const {
    id,
    image,
    headline,
    averageRating = 0,
    reviewsCount = 0,
    linkUrl,
    price,
    latitude,
    longitude,
  } = stayProduct;

  return {
    id: Number(id),
    latitude: latitude || 0,
    longitude: longitude || 0,
    orm_name: MapPointType.HOTEL,
    type: MapPointType.HOTEL,
    image,
    title: headline,
    url: linkUrl,
    reviewTotalCount: reviewsCount,
    reviewTotalScore: averageRating,
    isGoogleReview: false,
    price,
  };
};

const constructStayMapDataGTE = (
  card: StaysSearchTypes.StaysSearchMapCard,
  adults: number,
  children: number[],
  occupancies: StayBookingWidgetTypes.Occupancy[],
  rooms: number,
  dateFrom?: string,
  dateTo?: string,
  mealsIncluded?: string[],
  roomPreferences?: string[]
): SharedTypes.MapPoint => {
  const { id, image, name, productPageUrl, price, coordinates } = card;

  return {
    id,
    latitude: coordinates?.latitude || 0,
    longitude: coordinates?.longitude || 0,
    orm_name: MapPointType.HOTEL,
    type: MapPointType.HOTEL,
    image: constructGraphCMSImage(GraphCMSPageType.Stays, image, name),
    title: name ?? "",
    url: productPageUrl
      ? `${productPageUrl}${getAccommodationQueryParams(
          adults,
          children,
          rooms,
          dateFrom,
          dateTo,
          mealsIncluded,
          roomPreferences,
          occupancies
        )}`
      : "",
    reviewTotalCount: card.userRatingsTotal ?? 0,
    reviewTotalScore: card.userRatingAverage ?? 0,
    isGoogleReview: false,
    price: price?.price,
    priceDisplayValue: price?.priceDisplayValue,
  };
};

export const constructStaysMapDataGTE = (
  cards: StaysSearchTypes.StaysSearchMapCard[],
  adults: number,
  children: number[],
  occupancies: StayBookingWidgetTypes.Occupancy[],
  rooms: number,
  dateFrom?: string,
  dateTo?: string,
  mealsIncluded?: string[],
  roomPreferences?: string[]
): SharedTypes.Map | undefined => {
  if (cards.length > 0) {
    return {
      latitude: cards[0].coordinates?.latitude || 0,
      longitude: cards[0].coordinates?.longitude || 0,
      location: "",
      zoom: getMapZoom(false, false),
      points:
        cards?.map(card =>
          constructStayMapDataGTE(
            card,
            adults,
            children,
            occupancies,
            rooms,
            dateFrom,
            dateTo,
            mealsIncluded,
            roomPreferences
          )
        ) ?? undefined,
      options: {
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      },
      isCountryMap: false,
    };
  }
  return undefined;
};

export const constructStaysMapData = memoizeOne(
  (stayProducts: SharedTypes.Product[]): SharedTypes.Map | undefined => {
    if (stayProducts.length > 0) {
      return {
        latitude: stayProducts[0].latitude || 0,
        longitude: stayProducts[0].longitude || 0,
        location: stayProducts[0].headline,
        zoom: getMapZoom(false, false),
        points: stayProducts?.map(constructStayMapData) ?? undefined,
        options: {
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        },
        isCountryMap: false,
      };
    }
    return undefined;
  }
);

export const joinQueryStaysData = (
  accummulatedStayProducts: StaysSearchTypes.StayProduct[],
  wsStayProduct?: StaysSearchTypes.StayProduct
): StaysSearchTypes.StayProduct[] => {
  const isUnique =
    wsStayProduct &&
    !accummulatedStayProducts.some(stayProduct => stayProduct.id === wsStayProduct.id);
  const shouldConcatProduct = wsStayProduct && isUnique;

  return [...(accummulatedStayProducts || []), ...(shouldConcatProduct ? [wsStayProduct!] : [])];
};

export const getFilterSectionName = (sectionId: string, t: TFunction) => {
  if (sectionId === StayFilterQueryEnum.STAR_RATINGS) {
    return t("Hotel star rating");
  }
  return t(capitalize(sectionId.replace("_", " ")));
};

const getStarRatingOptionName = (starClass: string[], t: TFunction) =>
  t("{starClass} stars", {
    starClass: starClass[0],
  });

export const getFilterOptionName = (optionId: string, t: TFunction) => {
  switch (optionId) {
    case "1Stars":
    case "2Stars":
    case "3Stars":
    case "4Stars":
    case "5Stars":
      return getStarRatingOptionName(optionId.match(/\d+/g)!, t);
    case "5":
    case "4.5":
      return t("Excellent 4.5/5");
    case "4":
      return t("Very good 4.0/5");
    case "3.5":
      return t("Good 3.5/5");
    case "3":
      return t("Fair 3.0/5");
    default:
      return t(
        capitalize(
          optionId
            .split(/(?=[A-Z])/)
            .join(" ")
            .toLowerCase()
        )
      );
  }
};

export const getFilterSectionIcon = (sectionId: string) => {
  switch (sectionId) {
    case StayFilterSectionType.ReviewScore:
      return RatingIcon;
    case StayFilterSectionType.MealsIncluded:
      return MealIcon;
    case StayFilterSectionType.RoomPreferences:
      return BedroomIcon;
    case StayFilterSectionType.Categories:
      return AccommodationIcon;
    case StayFilterSectionType.HotelAmenities:
      return HotelAmenityIcon;
    case StayFilterSectionType.StarRatings:
      return StarIcon;
    default:
      return StayDefaultIcon;
  }
};

const getFilterType = (filterId: string) => {
  switch (filterId) {
    case StayFilterSectionType.Categories:
    case StayFilterSectionType.StarRatings:
      return FilterType.BUTTONS;
    default:
      return FilterType.CHECKBOX;
  }
};

export const getStaySearchPriceFilter = memoizeOne(
  (stayProducts: SharedTypes.Product[], t: TFunction): FilterSectionListItemType => {
    const prices: number[] = stayProducts.map(product => product?.price ?? 0);
    const min = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
    const max = Math.max(...prices, 0);
    const step = Math.ceil((max - min) / 20);
    const priceFilterValues = range(0, 20).map(i => ({
      id: String(i * step + min),
      count: 0,
    }));
    const priceFilterItems = prices.reduce((results, price) => {
      const samePrice = results.find(result => price <= Math.ceil(Number(result.id)));
      if (!samePrice) return results;
      return [
        ...results.filter(result => result.id !== samePrice.id),
        {
          ...samePrice,
          count: samePrice.count + 1,
        },
      ].sort((a, b) => (Number(a.id) <= Number(b.id) ? -1 : 1));
    }, priceFilterValues as SearchPageTypes.RangeFilter[]);
    return {
      sectionId: "price",
      title: t("Price range"),
      Icon: PriceIcon,
      type: FilterType.RANGE,
      filters: priceFilterItems,
      min,
      max,
    };
  }
);

export const constructStaysSearchFiltersGTE = (
  filters: StaysSearchTypes.QuerySearchFilter[],
  priceMin: number,
  priceMax: number,
  t: TFunction
) => {
  return filters.map(filter => {
    const filterIdLowercase = filter.id.toLowerCase();

    if (StayFilterSectionType.Price === filter.id) {
      return {
        sectionId: "price",
        title: t("Price range"),
        Icon: PriceIcon,
        type: FilterType.RANGE,
        filters: filter.options,
        min: Math.floor(priceMin),
        max: Math.ceil(priceMax),
      };
    }

    return {
      sectionId: filterIdLowercase,
      title: getFilterSectionName(filterIdLowercase, t),
      Icon: getFilterSectionIcon(filter.id),
      type: getFilterType(filter.id),
      filters: filter.options.map(option => ({
        id: option.id,
        name: option.label ? t(option.label) : getFilterOptionName(option.id, t),
        disabled: option.count === 0,
      })),
    };
  });
};

export const constructStaysSearchFilters = memoizeOne(
  (
    filters: StaysSearchTypes.QuerySearchFilter[],
    t: TFunction,
    priceFilter?: FilterSectionListItemType
  ) => {
    return filters.reduce((filterList, filter) => {
      const filterIdLowercase = filter.id.toLowerCase();
      return [
        ...filterList,
        ...(filter.id === StayFilterSectionType.Categories && priceFilter ? [priceFilter] : []),
        {
          sectionId: filterIdLowercase,
          title: getFilterSectionName(filterIdLowercase, t),
          Icon: getFilterSectionIcon(filter.id),
          type: getFilterType(filter.id),
          filters: filter.options.map(option => ({
            id: option.id,
            name: option.label ? t(option.label) : getFilterOptionName(option.id, t),
            disabled: option.count === 0,
          })),
        },
      ];
    }, [] as FilterSectionListType);
  }
);

export const getProductType = (subType?: GraphCMSSubType) => {
  switch (subType) {
    case GraphCMSSubType.APARTMENT:
      return "APARTMENT";
    case GraphCMSSubType.BED_AND_BREAKFAST:
      return "BED_AND_BREAKFAST";
    case GraphCMSSubType.CASTLE:
      return "CASTLE";
    case GraphCMSSubType.COTTAGE:
      return "COTTAGE";
    case GraphCMSSubType.GUESTHOUSE:
      return "GUESTHOUSE";
    case GraphCMSSubType.HOSTEL:
      return "HOSTEL";
    case GraphCMSSubType.RESORT:
      return "RESORT";
    case GraphCMSSubType.HOTEL:
      return "HOTEL";
    default:
      return undefined;
  }
};

export const getStaysSelectedFilters = ({
  reviewScore,
  categories,
  mealsIncluded,
  roomPreferences,
  hotelAmenities,
  starRatings,
  price,
  filters,
  currencyCode,
  convertCurrency,
}: {
  reviewScore?: string[];
  categories?: string[];
  mealsIncluded?: string[];
  roomPreferences?: string[];
  hotelAmenities?: string[];
  starRatings?: string[];
  price?: string[];
  filters?: FilterSectionListType;
  currencyCode: string;
  convertCurrency: (value: number) => number;
}) => {
  if (!filters) {
    return [];
  }
  const starFilters = getSectionTypeFilters(filters, StayFilterQueryEnum.STAR_RATINGS);
  const selectedStarRatings = starRatings
    ? getSectionTypeSelectedFilters(
        starFilters,
        starRatings,
        StayFilterQueryEnum.STAR_RATINGS,
        FilterType.BUTTONS
      )
    : [];

  const hotelAmenitiesFilters = getSectionTypeFilters(filters, StayFilterQueryEnum.STAY_AMENITIES);
  const selectedHotelAmenities = hotelAmenities
    ? getSectionTypeSelectedFilters(
        hotelAmenitiesFilters,
        hotelAmenities,
        StayFilterQueryEnum.STAY_AMENITIES,
        FilterType.CHECKBOX
      )
    : [];

  const reviewsFilters = getSectionTypeFilters(filters, StayFilterQueryEnum.REVIEW_SCORE);
  const selectedReviews = reviewScore
    ? getSectionTypeSelectedFilters(
        reviewsFilters,
        reviewScore,
        StayFilterQueryEnum.REVIEW_SCORE,
        FilterType.CHECKBOX
      )
    : [];

  const selectedPrice = getPriceSelectedFilter(
    StayFilterQueryEnum.PRICE,
    currencyCode,
    convertCurrency,
    price
  );

  const categoriesFilters = getSectionTypeFilters(filters, StayFilterQueryEnum.STAY_CATEGORIES);
  const selectedCategories = categories
    ? getSectionTypeSelectedFilters(
        categoriesFilters,
        categories,
        StayFilterQueryEnum.STAY_CATEGORIES,
        FilterType.BUTTONS
      )
    : [];

  const mealsFilters = getSectionTypeFilters(filters, StayFilterQueryEnum.MEALS_INCLUDED);
  const selectedMeals = mealsIncluded
    ? getSectionTypeSelectedFilters(
        mealsFilters,
        mealsIncluded,
        StayFilterQueryEnum.MEALS_INCLUDED,
        FilterType.CHECKBOX
      )
    : [];

  const bedFilters = getSectionTypeFilters(filters, StayFilterQueryEnum.ROOM_PREFERENCES);
  const selectedBeds = roomPreferences
    ? getSectionTypeSelectedFilters(
        bedFilters,
        roomPreferences,
        StayFilterQueryEnum.ROOM_PREFERENCES,
        FilterType.CHECKBOX
      )
    : [];

  return [
    ...selectedStarRatings,
    ...selectedReviews,
    ...(selectedPrice ? [selectedPrice] : []),
    ...selectedCategories,
    ...selectedMeals,
    ...selectedBeds,
    ...selectedHotelAmenities,
  ] as SelectedFilter[];
};

export const staySortParameters = [
  { orderBy: "POPULARITY", orderDirection: "DESC" },
  { orderBy: "RATING", orderDirection: "DESC" },
  { orderBy: "PRICE", orderDirection: "asc" },
  { orderBy: "PRICE", orderDirection: "desc" },
];

export const getStarRatingValues = (starRatings?: string[]) =>
  starRatings?.map(star => `${parseInt(star, 10)}`);
