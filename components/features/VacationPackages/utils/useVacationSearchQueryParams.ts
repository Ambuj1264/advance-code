import {
  encodeQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  BooleanParam,
  NumericArrayParam,
  ArrayParam,
  stringify,
} from "use-query-params";

import { FilterQueryParam } from "types/enums";

export enum VacationPackageSearchQueryParam {
  ORIGIN_ID = "originId",
  DESTINATION_ID = "destinationId",
  ORIGIN_NAME = "originName",
  ORIGIN_COUNTRY_ID = "originCountryId",
  DESTINATION_NAME = "destinationName",
  DATE_FROM = "dateFrom",
  DATE_TO = "dateTo",
  OCCUPANCIES = "occupancies",
  INCLUDE_FLIGHTS = "includeFlights",
  // sorting
  ORDER_BY = "orderBy",
  ORDER_DIRECTION = "orderDirection",
  // filters
  NUMBER_OF_DAYS = "numberOfDays",
  DESTINATION_IDS = "destinationIds",
  ACTIVITY_IDS = "activityIds",
  ATTRACTION_IDS = "attractionIds",
  COUNTRY_IDS = "countryIds",
  TYPES = "types",
  PRICE = "price",
  // pagination
  PAGE = "page",
  NUMBER_OF_ITEMS = "numberOfItems",
  // request
  REQUEST_ID = "requestId",
  USE_PREFETCH = "usePrefetch",
}

export const VacationPackageSearchQueryParamScheme = {
  [VacationPackageSearchQueryParam.DATE_FROM]: StringParam,
  [VacationPackageSearchQueryParam.DATE_TO]: StringParam,
  [VacationPackageSearchQueryParam.ORIGIN_ID]: StringParam,
  [VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID]: StringParam,
  [VacationPackageSearchQueryParam.DESTINATION_ID]: StringParam,
  [VacationPackageSearchQueryParam.DESTINATION_NAME]: StringParam,
  [VacationPackageSearchQueryParam.ORIGIN_NAME]: StringParam,
  [VacationPackageSearchQueryParam.OCCUPANCIES]: ArrayParam,
  [VacationPackageSearchQueryParam.NUMBER_OF_DAYS]: NumericArrayParam,
  [VacationPackageSearchQueryParam.ACTIVITY_IDS]: ArrayParam,
  [VacationPackageSearchQueryParam.COUNTRY_IDS]: ArrayParam,
  [VacationPackageSearchQueryParam.TYPES]: ArrayParam,
  [VacationPackageSearchQueryParam.DESTINATION_IDS]: NumericArrayParam,
  [VacationPackageSearchQueryParam.PRICE]: NumericArrayParam,
  [VacationPackageSearchQueryParam.INCLUDE_FLIGHTS]: BooleanParam,
  [FilterQueryParam.ORDER_BY]: StringParam,
  [FilterQueryParam.ORDER_DIRECTION]: StringParam,
  [FilterQueryParam.ORDER_BY]: StringParam,
  [FilterQueryParam.PAGE]: NumberParam,
  [VacationPackageSearchQueryParam.REQUEST_ID]: StringParam,
  [VacationPackageSearchQueryParam.USE_PREFETCH]: BooleanParam,
};

export type VacationSearchQueryParamsType = {
  [VacationPackageSearchQueryParam.DATE_FROM]?: string;
  [VacationPackageSearchQueryParam.DATE_TO]?: string;
  [VacationPackageSearchQueryParam.ORIGIN_ID]?: string;
  [VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID]?: string;
  [VacationPackageSearchQueryParam.DESTINATION_ID]?: string;
  [VacationPackageSearchQueryParam.DESTINATION_NAME]?: string;
  [VacationPackageSearchQueryParam.ORIGIN_NAME]?: string;
  [VacationPackageSearchQueryParam.OCCUPANCIES]?: string[];
  [VacationPackageSearchQueryParam.INCLUDE_FLIGHTS]?: boolean;
  [VacationPackageSearchQueryParam.USE_PREFETCH]?: boolean;
  // filters
  [VacationPackageSearchQueryParam.NUMBER_OF_DAYS]?: number[];
  [VacationPackageSearchQueryParam.ACTIVITY_IDS]?: string[];
  [VacationPackageSearchQueryParam.DESTINATION_IDS]?: number[];
  [VacationPackageSearchQueryParam.COUNTRY_IDS]?: string[];
  [VacationPackageSearchQueryParam.TYPES]?: string[];
  [VacationPackageSearchQueryParam.PRICE]?: number[];
  // sorting
  [FilterQueryParam.ORDER_BY]?: string;
  [FilterQueryParam.ORDER_DIRECTION]?: string;
  // pagination
  [FilterQueryParam.PAGE]?: number;
  // used by VP Similar road trips
  [VacationPackageSearchQueryParam.NUMBER_OF_ITEMS]?: number;
  // request
  [VacationPackageSearchQueryParam.REQUEST_ID]?: string;
};

const useVacationSearchQueryParams = () => useQueryParams(VacationPackageSearchQueryParamScheme);

export const encodeVPSearchQueryParams = (queryParams: VacationSearchQueryParamsType): string => {
  const {
    dateFrom,
    dateTo,
    originId,
    originName,
    originCountryId,
    destinationId,
    destinationName,
    occupancies,
    includeFlights,
    requestId,
    types,
    usePrefetch,
  } = queryParams;

  return stringify(
    encodeQueryParams(
      {
        [VacationPackageSearchQueryParam.DATE_FROM]: StringParam,
        [VacationPackageSearchQueryParam.DATE_TO]: StringParam,
        [VacationPackageSearchQueryParam.DESTINATION_ID]: StringParam,
        [VacationPackageSearchQueryParam.ORIGIN_ID]: StringParam,
        [VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID]: StringParam,
        [VacationPackageSearchQueryParam.ORIGIN_NAME]: StringParam,
        [VacationPackageSearchQueryParam.DESTINATION_NAME]: StringParam,
        [VacationPackageSearchQueryParam.OCCUPANCIES]: ArrayParam,
        [VacationPackageSearchQueryParam.INCLUDE_FLIGHTS]: BooleanParam,
        [VacationPackageSearchQueryParam.REQUEST_ID]: StringParam,
        [VacationPackageSearchQueryParam.TYPES]: ArrayParam,
        [VacationPackageSearchQueryParam.USE_PREFETCH]: BooleanParam,
      },
      {
        [VacationPackageSearchQueryParam.DATE_FROM]: dateFrom,
        [VacationPackageSearchQueryParam.DATE_TO]: dateTo,
        [VacationPackageSearchQueryParam.ORIGIN_ID]: originId,
        [VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID]: originCountryId,
        [VacationPackageSearchQueryParam.ORIGIN_NAME]: originName,
        [VacationPackageSearchQueryParam.DESTINATION_ID]: destinationId,
        [VacationPackageSearchQueryParam.DESTINATION_NAME]: destinationName,
        [VacationPackageSearchQueryParam.OCCUPANCIES]: occupancies,
        [VacationPackageSearchQueryParam.INCLUDE_FLIGHTS]: includeFlights,
        [VacationPackageSearchQueryParam.REQUEST_ID]: requestId,
        [VacationPackageSearchQueryParam.USE_PREFETCH]: usePrefetch,
        [VacationPackageSearchQueryParam.TYPES]: types,
      }
    )
  );
};

export default useVacationSearchQueryParams;
