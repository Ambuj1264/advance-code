import { CustomCacheKey } from "@layer0/core/router";
import { CacheOptions } from "@layer0/core/router/CacheOptions";

import {
  AccommodationFilterQueryParam,
  BestPlacesQueryParam,
  CarFilterQueryParam,
  FilterQueryParam,
  Layer0PageHeaders,
  SharedFilterQueryParams,
} from "./types/enums";
import { FlightSearchQueryParam } from "./components/features/FlightSearchPage/utils/useFlightSearchQueryParams";
import { BloggerSearchQueryParam } from "./components/features/BloggerSearch/utils/useBloggerSearchQueryParams";

import { VacationPackageSearchQueryParam } from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import { ROUTE_NAMES } from "shared/routeNames";
import { oneDaySeconds, oneHourSeconds, oneMonthSeconds, oneWeekSeconds } from "utils/constants";

const commonDefaultQueryParams = ["i18n", "uri", "get_new_page", "preview", "isPassthrough", "a"];

const whitelistedQueryParams = new Set([
  ...Object.entries({ ...Layer0PageHeaders }).map(([key]) => key),
  ...Object.values(SharedFilterQueryParams),
  ...Object.values(FilterQueryParam),
  ...Object.values(AccommodationFilterQueryParam),
  ...Object.values(BestPlacesQueryParam),
  ...Object.values(CarFilterQueryParam),
  ...Object.values(BloggerSearchQueryParam),
  ...Object.values({ ...FlightSearchQueryParam }),
  ...commonDefaultQueryParams,
  "orderBy",
  "orderDirection",
  "order",
  "rebuild_static_cache",
  "enableStays",
]);

const getCommonCacheKey = () => new CustomCacheKey();

const getClientapiCacheKey = () =>
  new CustomCacheKey().addHeader("x-travelshift-language").addHeader("x-travelshift-url-front");

export const ssr = {
  key: getCommonCacheKey().excludeAllQueryParametersExcept(...whitelistedQueryParams),
  browser: {
    maxAgeSeconds: 0,
  },
  edge: {
    maxAgeSeconds: oneDaySeconds,
    staleWhileRevalidateSeconds: oneWeekSeconds,
  },
};

export const gteSsr = {
  ...ssr,
  browser: {
    maxAgeSeconds: 60 * 60,
  },
  edge: {
    maxAgeSeconds: 60 * 60,
    staleWhileRevalidateSeconds: oneMonthSeconds,
  },
};

const GTE_CACHE_CONFIGS = {
  VACATION_PACKAGE: {
    PRODUCT_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        VacationPackageSearchQueryParam.DATE_FROM,
        VacationPackageSearchQueryParam.INCLUDE_FLIGHTS,
        VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID,
        VacationPackageSearchQueryParam.ORIGIN_ID
      ),
    },
    SEARCH_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        VacationPackageSearchQueryParam.DATE_FROM,
        VacationPackageSearchQueryParam.DATE_TO,
        VacationPackageSearchQueryParam.DESTINATION_NAME,
        VacationPackageSearchQueryParam.DESTINATION_ID,
        VacationPackageSearchQueryParam.ORIGIN_NAME,
        VacationPackageSearchQueryParam.ORIGIN_ID,
        VacationPackageSearchQueryParam.INCLUDE_FLIGHTS,
        VacationPackageSearchQueryParam.OCCUPANCIES
      ),
    },
  },
  STAYS: {
    PRODUCT_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(...commonDefaultQueryParams),
    },
    SEARCH_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        // one of minimal required params that trigger the search result page filters
        AccommodationFilterQueryParam.ID,
        AccommodationFilterQueryParam.TYPE,
        AccommodationFilterQueryParam.ADULTS,
        AccommodationFilterQueryParam.CHILDREN,
        AccommodationFilterQueryParam.DATE_FROM,
        AccommodationFilterQueryParam.DATE_TO,
        AccommodationFilterQueryParam.ROOMS,
        AccommodationFilterQueryParam.OCCUPANCIES,
        SharedFilterQueryParams.ORDER_BY,
        SharedFilterQueryParams.ORDER_DIRECTION
      ),
    },
  },
  FLIGHT: {
    PRODUCT_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        "bookingToken",
        "title",
        "originId",
        "dateFrom"
      ),
    },
    SEARCH_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        FlightSearchQueryParam.DESTINATION_ID,
        FlightSearchQueryParam.ORIGIN_ID,
        SharedFilterQueryParams.DATE_FROM,
        SharedFilterQueryParams.ORDER_BY,
        SharedFilterQueryParams.ORDER_DIRECTION
      ),
    },
  },
  CAR: {
    PRODUCT_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        "carId",
        "f",
        "from",
        "t",
        "to",
        "pickup_id",
        "dropoff_id"
      ),
    },
    SEARCH_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(
        ...commonDefaultQueryParams,
        CarFilterQueryParam.DATE_FROM,
        CarFilterQueryParam.DATE_TO,
        CarFilterQueryParam.PICKUP_LOCATION_ID,
        CarFilterQueryParam.DROPOFF_LOCATION_ID,
        CarFilterQueryParam.ORDER_BY,
        CarFilterQueryParam.ORDER_DIRECTION
      ),
    },
  },
  TOURS: {
    PRODUCT_PAGE: {
      ...gteSsr,
      key: getCommonCacheKey().excludeAllQueryParametersExcept(...commonDefaultQueryParams),
    },
  },
};

export const shortCacheGraphql = {
  key: getClientapiCacheKey(),
  edge: {
    maxAgeSeconds: oneHourSeconds * 4,
    staleWhileRevalidateSeconds: oneDaySeconds,
  },
};

export const longCacheGraphql = {
  key: getClientapiCacheKey(),
  edge: {
    maxAgeSeconds: oneMonthSeconds,
    staleWhileRevalidateSeconds: oneMonthSeconds * 2,
  },
};

export const graphql = {
  key: getClientapiCacheKey(),
  edge: {
    maxAgeSeconds: oneDaySeconds,
    staleWhileRevalidateSeconds: oneWeekSeconds,
  },
};

export const staticAssets = {
  browser: {
    maxAgeSeconds: oneWeekSeconds,
  },
  edge: {
    maxAgeSeconds: oneWeekSeconds,
    staleWhileRevalidateSeconds: oneWeekSeconds,
  },
};

export const ssrPrivateCaching = {
  browser: {
    maxAgeSeconds: 0,
  },
  edge: {
    maxAgeSeconds: oneWeekSeconds,
    staleWhileRevalidateSeconds: oneWeekSeconds,
    forcePrivateCaching: true,
  },
};

export const disabledCaching = {
  edge: false as const,
  browser: {
    maxAgeSeconds: 0,
  },
};

export const getLayer0CacheOptions = (
  defaultCacheOptions: CacheOptions,
  routeName?: ROUTE_NAMES
) => {
  if (routeName === undefined) return defaultCacheOptions;

  switch (routeName) {
    // VACATION PACKAGE

    case ROUTE_NAMES.GTE_VACATION_PACKAGE: {
      return GTE_CACHE_CONFIGS.VACATION_PACKAGE.PRODUCT_PAGE;
    }

    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING:
    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_WITH_SLUG:
    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_COUNTRY:
    case ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_COUNTRY_WITH_SLUG: {
      return GTE_CACHE_CONFIGS.VACATION_PACKAGE.SEARCH_PAGE;
    }

    // STAYS

    case ROUTE_NAMES.GTE_STAY: {
      return GTE_CACHE_CONFIGS.STAYS.PRODUCT_PAGE;
    }
    case ROUTE_NAMES.GTE_STAYSSEARCH:
    case ROUTE_NAMES.GTE_STAYSSEARCH_COUNTRY:
    case ROUTE_NAMES.GTE_STAYSSEARCH_WITH_SLUG:
    case ROUTE_NAMES.GTE_STAYSSEARCH_COUNTRY_WITH_SLUG: {
      return GTE_CACHE_CONFIGS.STAYS.SEARCH_PAGE;
    }

    // CARS

    case ROUTE_NAMES.CAR:
    case ROUTE_NAMES.GTE_CAR_PRODUCT:
    case ROUTE_NAMES.GTE_CAR_PRODUCT_COUNTRY:
    case ROUTE_NAMES.GTE_CAR_PRODUCT_WITH_SLUG:
    case ROUTE_NAMES.GTE_CAR_PRODUCT_COUNTRY_WITH_SLUG: {
      return GTE_CACHE_CONFIGS.CAR.PRODUCT_PAGE;
    }

    case ROUTE_NAMES.GTE_CARSEARCH:
    case ROUTE_NAMES.GTE_CARSEARCH_WITH_SLUG:
    case ROUTE_NAMES.GTE_CARSEARCH_COUNTRY:
    case ROUTE_NAMES.GTE_CARSEARCH_COUNTRY_WITH_SLUG: {
      return GTE_CACHE_CONFIGS.CAR.SEARCH_PAGE;
    }

    // FLIGHTS

    case ROUTE_NAMES.FLIGHT:
    case ROUTE_NAMES.FLIGHTPAGE_WITH_SLUG:
    case ROUTE_NAMES.FLIGHTPAGE_COUNTRY:
    case ROUTE_NAMES.FLIGHTPAGE_COUNTRY_WITH_SLUG: {
      return GTE_CACHE_CONFIGS.FLIGHT.PRODUCT_PAGE;
    }

    case ROUTE_NAMES.FLIGHTSEARCH:
    case ROUTE_NAMES.FLIGHTSEARCH_COUNTRY:
    case ROUTE_NAMES.FLIGHTSEARCH_COUNTRY_WITH_SLUG: {
      return GTE_CACHE_CONFIGS.FLIGHT.SEARCH_PAGE;
    }

    // TOURS
    case ROUTE_NAMES.GTE_TOUR:
      return GTE_CACHE_CONFIGS.TOURS.PRODUCT_PAGE;

    default:
      return defaultCacheOptions;
  }
};
