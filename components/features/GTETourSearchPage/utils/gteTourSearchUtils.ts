import { flatten } from "fp-ts/lib/Array";
import memoizeOne from "memoize-one";
import {
  NumberParam,
  StringParam,
  encodeQueryParams,
  stringify,
  NumericArrayParam,
} from "use-query-params";

import {
  GraphCMSPageType,
  OrderBy,
  OrderDirection,
  FilterQueryParam,
  FilterType,
} from "types/enums";
import { asPathWithoutQueryParams } from "utils/routerUtils";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { generateQuickfacts } from "components/ui/TravelStop/travelStopUtils";
import Icon from "components/ui/GraphCMSIcon";
import { TourSearchQueryParamsType } from "components/features/SearchPage/useTourSearchQueryParams";
import { emptyArray, PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import {
  getSectionTypeSelectedFilters,
  getPriceSelectedFilter,
} from "components/ui/Filters/utils/filtersUtils";

export const getTourSearchPageQueryCondition = memoizeOne((asPath?: string) => ({
  pageType: GraphCMSPageType.Tours,
  metadataUri: asPath ? asPathWithoutQueryParams(asPath) : undefined,
}));

export const constructTourProductProps = (
  t: TFunction,
  valuePropsList?: GTETourSearchTypes.QueryValueProp[],
  isDesktop?: boolean
): SharedTypes.ProductProp[] => {
  const valueProps = valuePropsList ?? [];

  return valueProps.map(valueProp => ({
    Icon: Icon(valueProp.icon?.handle, isDesktop),
    title: t(valueProp?.title ?? ""),
  }));
};

export const filterQuickfactValues = (unfilteredArray: {
  [x: string]: string | string[] | number | undefined;
}) =>
  Object.entries(unfilteredArray).reduce((acc, [key, value]) => {
    if (
      !value ||
      (typeof value === "string" && (!value.length || value === "0")) ||
      (typeof value === "number" && value === 0)
    ) {
      return acc;
    }
    if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: value.join(", "),
      };
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {});

export const constructGTETourSearchResults = (
  tours: GTETourSearchTypes.QueryTour[],
  t: TFunction,
  queryParams?: string,
  isDesktop?: boolean
): SharedTypes.Product[] =>
  tours.map(tour => ({
    id: tour.productCode,
    image: constructGraphCMSImage(GraphCMSPageType.Tours, tour.image),
    linkUrl: `${tour.linkUrl}${queryParams || ""}`,
    headline: tour.name,
    description: tour.description,
    averageRating: tour.reviewScore,
    reviewsCount: tour.reviewCount,
    price: tour.price,
    ssrPrice: tour.price,
    isLikelyToSellOut: tour.likelyToSellOut,
    specs: generateQuickfacts(
      tour?.quickFactList?.quickfacts ?? [],
      t,
      filterQuickfactValues(tour.quickFactVariables),
      isDesktop
    ).slice(0, 4),
    props: constructTourProductProps(t, tour?.valuePropsList?.valueProps, isDesktop),
  }));

export const getOrderingFilter = (orderBy?: OrderBy, orderDirection?: OrderDirection) => {
  if (!orderBy && !orderDirection) {
    return {
      reviewCount: OrderDirection.DESC.toUpperCase(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const orderDirectionUppercased = orderDirection!.toUpperCase();

  switch (orderBy) {
    case OrderBy.PRICE:
      return { price: orderDirectionUppercased };
    case OrderBy.DURATION:
      return { durationInMinutes: orderDirectionUppercased };
    case OrderBy.RATING:
      return {
        reviewScore: orderDirectionUppercased,
      };
    case OrderBy.POPULARITY:
    default:
      return {
        reviewCount: orderDirectionUppercased,
      };
  }
};

export const ACTIVITY_DELIMETER = "activityId-";
export const ACTIVITY_SUBTYPE_DELIMETER = "subtypeId-";

// activityId and subtypeId can be 0, which means null in this case.
const getActivityIdString = (activityId?: number, subtypeId?: number) => {
  return activityId
    ? `${ACTIVITY_DELIMETER}${activityId}`
    : `${ACTIVITY_SUBTYPE_DELIMETER}${subtypeId}`;
};

const getActivityIdFromQuery =
  (delimiter: typeof ACTIVITY_DELIMETER | typeof ACTIVITY_SUBTYPE_DELIMETER) =>
  (activityIdQuery?: string) => {
    return activityIdQuery?.includes(delimiter)
      ? Number(activityIdQuery?.replace(delimiter, "")) || 0
      : undefined;
  };

export const ATTRACTION_DELIMITER = "attractionId-";
export const ATTRACTION_LOCATION_DELIMITER = "locationId-";

const getAttractionIdString = (attractionIds?: string[], locationIds?: string[]) => {
  const attractionIdsString = attractionIds?.length
    ? `${ATTRACTION_DELIMITER}${attractionIds?.reduce(
        (acc, activityId) => `${acc}${acc ? "," : ""}${activityId}`,
        ""
      )}`
    : "";
  const locationIdString = locationIds?.length
    ? `${attractionIds?.length ? "_" : ""}${ATTRACTION_LOCATION_DELIMITER}${locationIds.reduce(
        (acc, locationId) => `${acc}${acc ? "," : ""}${locationId}`,
        ""
      )}`
    : "";
  return attractionIdsString + locationIdString;
};

const getAttractionIdFromQuery = (attractionIdQuery = "") => {
  const attractionQueryValues = attractionIdQuery.split("_");
  const attractionValue = attractionQueryValues.find(value => value.includes(ATTRACTION_DELIMITER));
  const locationValue = attractionQueryValues.find(value =>
    value.includes(ATTRACTION_LOCATION_DELIMITER)
  );

  return {
    attractionIds: attractionValue?.replace(ATTRACTION_DELIMITER, "").split(",").map(Number),
    locationIds: locationValue?.replace(ATTRACTION_LOCATION_DELIMITER, "").split(",").map(Number),
  };
};

export const constructTourSearchFilters = (
  queryFilters?: GTETourSearchTypes.QueryFilters
): SearchPageTypes.Filters | undefined => {
  if (!queryFilters) return undefined;
  const { activities, locations, duration = [], price, reviews, time } = queryFilters;
  const priceValues = price?.reduce(
    ({ minValue, maxValue }, currentValue) => {
      return {
        minValue: minValue > 0 ? Math.min(minValue, currentValue.minValue) : currentValue.minValue,
        maxValue: Math.max(maxValue, currentValue.maxValue),
      };
    },
    { minValue: 0, maxValue: 0 }
  ) ?? { minValue: 0, maxValue: 0 };
  return {
    activities: activities?.map(act => ({
      name: act.name,
      active: act.active,
      id: getActivityIdString(act.activityId, act.subtypeId),
      disabled: !act.active,
    })),
    attractions: locations?.map(loc => ({
      name: loc.name,
      active: loc.active,
      id: getAttractionIdString(loc.attractionId, loc.locationId),
      disabled: !loc.active,
    })),
    durations: duration.map(dur => ({
      id: `[${dur.fromMinutes}, ${dur.toMinutes}]`,
      name: dur.name,
      disabled: !dur.isActive,
    })),
    price: {
      min: priceValues.minValue,
      max: priceValues.maxValue,
      filters:
        price?.map(p => ({
          id: String(p.maxValue),
          count: p.count,
        })) ?? [],
    },
    reviews: reviews?.map(review => ({
      id: String(review.reviewScore),
      name: review.name,
      disabled: !review.isActive,
    })),
    time: time?.map(t => ({
      id: `[${t.fromHour}, ${t.endHour}]`,
      name: t.name,
      disabled: !t.isActive,
    })),
  };
};

export const constructTourSearchWhereInput = (
  price?: string[],
  duration?: string[],
  reviewScore?: string[],
  activities?: string[],
  destinations?: string[],
  time?: string[]
) => {
  const durations = duration
    ? flatten(duration.map(dur => JSON.parse(dur))).map(dur => Number(dur))
    : undefined;
  const times = time
    ? flatten(time.map(timeItem => JSON.parse(timeItem))).map(timeItem => Number(timeItem))
    : undefined;
  const reviewScoreValues = reviewScore?.map(score => Number(score));
  const attractionValues = destinations?.map(getAttractionIdFromQuery);
  const attractionIdsInput = flatten(
    attractionValues?.map(({ attractionIds }) => attractionIds || emptyArray) || emptyArray
  ).filter(Boolean);
  const locationIdsInput = flatten(
    attractionValues?.map(({ locationIds }) => locationIds || emptyArray) || emptyArray
  ).filter(Boolean);

  const activityCategories = activities
    ?.map(getActivityIdFromQuery(ACTIVITY_DELIMETER))
    .filter(Boolean);
  const activitySubCategories = activities
    ?.map(getActivityIdFromQuery(ACTIVITY_SUBTYPE_DELIMETER))
    .filter(Boolean);

  return {
    ...(price
      ? {
          price: {
            gte: Number(price[0]),
            ngt: Number(price[1]),
          },
        }
      : {}),
    ...(durations && durations?.length > 1
      ? {
          durationInMinutes: {
            gte: Math.min(...durations),
            ngt: Math.max(...durations),
          },
        }
      : {}),
    ...(reviewScoreValues
      ? {
          reviewScore: {
            gte: Math.min(...reviewScoreValues),
          },
        }
      : {}),
    ...(activities?.length
      ? {
          activities: {
            some: {
              ...(activityCategories?.length
                ? {
                    id: {
                      in: activityCategories,
                    },
                  }
                : null),
              ...(activitySubCategories?.length
                ? {
                    subCategories: {
                      some: {
                        id: {
                          in: activitySubCategories,
                        },
                      },
                    },
                  }
                : null),
            },
          },
        }
      : {}),
    ...(attractionIdsInput?.length || locationIdsInput?.length
      ? {
          ...(attractionIdsInput?.length
            ? {
                itineraryItems: {
                  some: {
                    attractionId: { in: attractionIdsInput },
                  },
                },
              }
            : null),
          ...(locationIdsInput?.length
            ? {
                or: {
                  itineraryItems: {
                    some: {
                      locationId: { in: locationIdsInput },
                    },
                  },
                },
              }
            : null),
        }
      : {}),
    ...(times && times?.length > 1
      ? {
          timeFrom: {
            gte: Math.min(...times),
            ngt: Math.max(...times),
          },
        }
      : {}),
  };
};

export const constructTourSearchQueryVariables = ({
  queryParams,
  numberOfItems,
}: {
  queryParams: TourSearchQueryParamsType;
  numberOfItems?: number;
}) => {
  const {
    orderBy,
    orderDirection,
    durationIds,
    activityIds,
    attractionIds,
    adults = 1,
    children = 0,
    dateFrom,
    dateTo,
    price,
    reviewScore,
    nextPageId,
    prevPageId,
    startingLocationId,
    time,
    requestId,
  } = queryParams;
  const filters = constructTourSearchWhereInput(
    price,
    durationIds,
    reviewScore,
    activityIds,
    attractionIds,
    time
  );
  const order = getOrderingFilter(orderBy as OrderBy, orderDirection as OrderDirection);
  const pagination = {
    ...(!nextPageId && !prevPageId
      ? {
          first: numberOfItems || PRODUCT_SEARCH_RESULT_LIMIT,
        }
      : {}),
    // we have to select either next/prev page but not both as the result will be empty
    ...(nextPageId && !prevPageId
      ? {
          first: numberOfItems || PRODUCT_SEARCH_RESULT_LIMIT,
          after: nextPageId,
        }
      : {}),
    ...(!nextPageId && prevPageId
      ? {
          last: numberOfItems || PRODUCT_SEARCH_RESULT_LIMIT,
          before: prevPageId,
        }
      : {}),
  };
  return {
    ...(Object.keys(filters).length
      ? {
          where: filters,
        }
      : {}),
    ...pagination,
    ...(order ? { order } : {}),
    input: {
      destinationId: startingLocationId,
      from: dateFrom,
      to: dateTo,
      adults,
      children,
      infants: 0,
      requestId,
    },
  };
};

export const getTourSelectedFilters = ({
  queryParams,
  filters,
  currencyCode,
  convertCurrency,
}: {
  queryParams: TourSearchQueryParamsType;
  filters?: SearchPageTypes.Filters;
  currencyCode: string;
  convertCurrency: (value: number) => number;
}) => {
  const { durationIds, activityIds, attractionIds, price, reviewScore, time: times } = queryParams;
  if (
    !filters ||
    (!durationIds && !activityIds && !attractionIds && !price && !reviewScore && !times)
  )
    return [];
  const { activities = [], attractions = [], durations = [], reviews = [], time = [] } = filters;
  const selectedActivities = activityIds
    ? getSectionTypeSelectedFilters(
        activities,
        activityIds,
        FilterQueryParam.ACTIVITY_IDS,
        FilterType.CHECKBOX
      )
    : [];

  const selectedAttractions = attractionIds
    ? getSectionTypeSelectedFilters(
        attractions,
        attractionIds,
        FilterQueryParam.ATTRACTION_IDS,
        FilterType.CHECKBOX
      )
    : [];

  const selectedDuration = durationIds
    ? getSectionTypeSelectedFilters(
        durations,
        durationIds,
        FilterQueryParam.DURATION_IDS,
        FilterType.BUTTONS
      )
    : [];

  const selectedTimes = times
    ? getSectionTypeSelectedFilters(time, times, FilterQueryParam.TIME, FilterType.BUTTONS)
    : [];

  const selectedPrice = getPriceSelectedFilter(
    FilterQueryParam.PRICE,
    currencyCode,
    convertCurrency,
    price
  );

  const selectedReviews = reviewScore
    ? getSectionTypeSelectedFilters(
        reviews,
        reviewScore,
        FilterQueryParam.REVIEW_SCORE,
        FilterType.CHECKBOX
      )
    : [];

  return [
    ...selectedActivities,
    ...selectedAttractions,
    ...selectedDuration,
    ...(selectedPrice ? [selectedPrice] : []),
    ...selectedReviews,
    ...selectedTimes,
  ];
};

export const constructTourStartingLocations = (
  queryLocations: GTETourSearchTypes.QueryStartingLocation[]
) =>
  queryLocations.map(location => ({
    id: location.locationId,
    name: location.name,
    type: location.type,
  }));

export const getGTETourQueryParams = (
  adults?: number,
  children?: number,
  childrenAges?: number[],
  dateFrom?: string,
  requestId?: string
) => {
  if (!adults) return "";
  return `?${stringify(
    encodeQueryParams(
      {
        [FilterQueryParam.ADULTS]: NumberParam,
        [FilterQueryParam.CHILDREN]: NumberParam,
        [FilterQueryParam.CHILDREN_AGES]: NumericArrayParam,
        [FilterQueryParam.DATE_FROM]: StringParam,
        [FilterQueryParam.REQUEST_ID]: StringParam,
      },
      {
        [FilterQueryParam.ADULTS]: adults,
        [FilterQueryParam.CHILDREN]: children,
        [FilterQueryParam.CHILDREN_AGES]: childrenAges,
        [FilterQueryParam.DATE_FROM]: dateFrom,
        [FilterQueryParam.REQUEST_ID]: requestId,
      }
    )
  )}`;
};
