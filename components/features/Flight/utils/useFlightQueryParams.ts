import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { FilterQueryEnum, SharedFilterQueryParams } from "types/enums";

export enum FlightQueryParam {
  BOOKING_TOKEN = "bookingToken",
  INFANTS = "infants",
  CHECKED_BAGS = "checkedBags",
  ORIGIN_ID = "originId",
  DESTINATION_ID = "destinationId",
  ORIGIN = "origin",
  DESTINATION = "destination",
  CABIN_TYPE = "cabinType",
  RETURN_DATE_FROM = "returnDateFrom",
  CART_ITEM_ID = "cartItemId",
}

export const FlightQueryParamScheme = {
  [FlightQueryParam.BOOKING_TOKEN]: StringParam,
  [FilterQueryEnum.ADULTS]: NumberParam,
  [FilterQueryEnum.CHILDREN]: NumberParam,
  [FlightQueryParam.INFANTS]: NumberParam,
  [FlightQueryParam.CHECKED_BAGS]: NumberParam,
  [FlightQueryParam.ORIGIN_ID]: StringParam,
  [FlightQueryParam.DESTINATION_ID]: StringParam,
  [FlightQueryParam.DESTINATION]: StringParam,
  [FlightQueryParam.ORIGIN]: StringParam,
  [SharedFilterQueryParams.DATE_FROM]: StringParam,
  [FlightQueryParam.RETURN_DATE_FROM]: StringParam,
  [FlightQueryParam.CABIN_TYPE]: StringParam,
  [FlightQueryParam.CART_ITEM_ID]: StringParam,
};

export type FlightSearchQueryParamsType = {
  [FlightQueryParam.BOOKING_TOKEN]: string;
  [FilterQueryEnum.ADULTS]: number;
  [FilterQueryEnum.CHILDREN]?: number;
  [FlightQueryParam.INFANTS]?: number;
  [FlightQueryParam.CHECKED_BAGS]?: number;
  [FlightQueryParam.ORIGIN_ID]: string;
  [FlightQueryParam.DESTINATION_ID]: string;
  [FlightQueryParam.DESTINATION]: string;
  [FlightQueryParam.ORIGIN]: string;
  [SharedFilterQueryParams.DATE_FROM]: string;
  [FlightQueryParam.RETURN_DATE_FROM]?: string;
  [FlightQueryParam.CABIN_TYPE]: string;
  [FlightQueryParam.CART_ITEM_ID]?: string;
};

const useFlightQueryParams = () => useQueryParams(FlightQueryParamScheme);

export default useFlightQueryParams;
