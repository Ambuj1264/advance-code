import { useQueryParams, StringParam, NumberParam, ArrayParam } from "use-query-params";

import { SharedFilterQueryParams, FilterQueryEnum } from "../../../../types/enums";

export enum FlightSearchQueryParam {
  RETURN_DATE_FROM = "returnDateFrom",
  RETURN_DATE_TO = "returnDateTo",
  ORIGIN_ID = "originId",
  DESTINATION_ID = "destinationId",
  ORIGIN_NAME = "originName",
  DESTINATION_NAME = "destinationName",
  INFANTS = "infants",
  CABIN_TYPE = "cabinType",
  FLIGHT_TYPE = "flightType",
  PRICE = "price",
  DURATION = "duration",
  STOPOVER = "stopover",
  ORDER_BY = "orderBy",
  SEARCH_ID = "searchId",
  PAGE = "page",
  MAX_STOPS = "maxStops",
  CART_ITEM_ID = "cartItemId",
}

export enum FlightOrderBy {
  BEST = "BEST",
  PRICEFROM = "PRICE_FROM",
  PRICETO = "PRICE_TO",
  DURATIONSHORTEST = "DURATION_SHORTEST",
}

export const FlightSearchQueryParamScheme = {
  [SharedFilterQueryParams.DATE_FROM]: StringParam,
  [SharedFilterQueryParams.DATE_TO]: StringParam,
  [FlightSearchQueryParam.RETURN_DATE_FROM]: StringParam,
  [FlightSearchQueryParam.RETURN_DATE_TO]: StringParam,
  [FlightSearchQueryParam.ORIGIN_ID]: StringParam,
  [FlightSearchQueryParam.DESTINATION_ID]: StringParam,
  [FlightSearchQueryParam.DESTINATION_NAME]: StringParam,
  [FlightSearchQueryParam.ORIGIN_NAME]: StringParam,
  [FilterQueryEnum.ADULTS]: NumberParam,
  [FilterQueryEnum.CHILDREN]: NumberParam,
  [FlightSearchQueryParam.INFANTS]: NumberParam,
  [FlightSearchQueryParam.CABIN_TYPE]: StringParam,
  [FlightSearchQueryParam.FLIGHT_TYPE]: StringParam,
  [FlightSearchQueryParam.PRICE]: ArrayParam,
  [FlightSearchQueryParam.DURATION]: ArrayParam,
  [FlightSearchQueryParam.STOPOVER]: ArrayParam,
  [SharedFilterQueryParams.ORDER_BY]: StringParam,
  [FlightSearchQueryParam.SEARCH_ID]: StringParam,
  [SharedFilterQueryParams.PAGE]: NumberParam,
  [FlightSearchQueryParam.MAX_STOPS]: StringParam,
  [FlightSearchQueryParam.CART_ITEM_ID]: StringParam,
};

export type FlightSearchQueryParamsType = {
  [SharedFilterQueryParams.DATE_FROM]?: string;
  [SharedFilterQueryParams.DATE_TO]?: string;
  [FlightSearchQueryParam.RETURN_DATE_FROM]?: string;
  [FlightSearchQueryParam.RETURN_DATE_TO]?: string;
  [FlightSearchQueryParam.ORIGIN_ID]?: string;
  [FlightSearchQueryParam.DESTINATION_ID]?: string;
  [FlightSearchQueryParam.DESTINATION_NAME]?: string;
  [FlightSearchQueryParam.ORIGIN_NAME]?: string;
  [FilterQueryEnum.ADULTS]?: number;
  [FilterQueryEnum.CHILDREN]?: number;
  [FlightSearchQueryParam.INFANTS]?: number;
  [FlightSearchQueryParam.CABIN_TYPE]?: string;
  [FlightSearchQueryParam.FLIGHT_TYPE]?: string;
  [FlightSearchQueryParam.PRICE]?: string[];
  [FlightSearchQueryParam.STOPOVER]?: string[];
  [FlightSearchQueryParam.DURATION]?: string[];
  [SharedFilterQueryParams.ORDER_BY]?: FlightOrderBy;
  [FlightSearchQueryParam.SEARCH_ID]?: string;
  [SharedFilterQueryParams.PAGE]?: number;
  [FlightSearchQueryParam.MAX_STOPS]?: string;
  [FlightSearchQueryParam.CART_ITEM_ID]?: string;
};

const useFlightSearchQueryParams = () => useQueryParams(FlightSearchQueryParamScheme);

export default useFlightSearchQueryParams;
