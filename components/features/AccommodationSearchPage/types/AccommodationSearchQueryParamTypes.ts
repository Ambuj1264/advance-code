import { StringParam, NumberParam, NumericArrayParam, ArrayParam } from "use-query-params";

import { AccommodationFilterQueryParam, CursorPaginationQueryParams } from "types/enums";

export const AccommodationSearchQueryParamScheme = {
  [AccommodationFilterQueryParam.ORDER_BY]: StringParam,
  [AccommodationFilterQueryParam.ORDER_DIRECTION]: StringParam,
  [AccommodationFilterQueryParam.ID]: StringParam,
  [AccommodationFilterQueryParam.ADDRESS]: StringParam,
  [AccommodationFilterQueryParam.TYPE]: StringParam,
  [AccommodationFilterQueryParam.ADULTS]: NumberParam,
  [AccommodationFilterQueryParam.CHILDREN]: NumericArrayParam,
  [AccommodationFilterQueryParam.DATE_FROM]: StringParam,
  [AccommodationFilterQueryParam.DATE_TO]: StringParam,
  [AccommodationFilterQueryParam.ROOMS]: NumberParam,
  [AccommodationFilterQueryParam.STARS]: NumericArrayParam,
  [AccommodationFilterQueryParam.CATEGORIES]: NumericArrayParam,
  [AccommodationFilterQueryParam.AMENITIES]: NumericArrayParam,
  [AccommodationFilterQueryParam.EXTRAS]: NumericArrayParam,
  [AccommodationFilterQueryParam.PAGE]: NumberParam,
  [AccommodationFilterQueryParam.REVIEW_SCORE]: ArrayParam,
  [AccommodationFilterQueryParam.STAY_CATEGORIES]: ArrayParam,
  [AccommodationFilterQueryParam.STAR_RATINGS]: ArrayParam,
  [AccommodationFilterQueryParam.MEALS_INCLUDED]: ArrayParam,
  [AccommodationFilterQueryParam.ROOM_PREFERENCES]: ArrayParam,
  [AccommodationFilterQueryParam.STAY_AMENITIES]: ArrayParam,
  [AccommodationFilterQueryParam.PRICE]: ArrayParam,
  [AccommodationFilterQueryParam.SEARCH_ID]: StringParam,
  // serialized as {adults}_{kidAge}-{kidAge}-... e.g. 3 adults and 1yo kid + 8yo kid turns into 3_1-8
  [AccommodationFilterQueryParam.OCCUPANCIES]: ArrayParam,
  [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
  [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
};

export type AccommodationFilterQueryParamsType = {
  [AccommodationFilterQueryParam.ORDER_BY]?: string;
  [AccommodationFilterQueryParam.ORDER_DIRECTION]?: string;
  [AccommodationFilterQueryParam.ID]?: string;
  [AccommodationFilterQueryParam.ADDRESS]?: string;
  [AccommodationFilterQueryParam.TYPE]?: string;
  [AccommodationFilterQueryParam.ADULTS]?: number;
  [AccommodationFilterQueryParam.CHILDREN]?: number[];
  [AccommodationFilterQueryParam.DATE_FROM]?: string;
  [AccommodationFilterQueryParam.DATE_TO]?: string;
  [AccommodationFilterQueryParam.ROOMS]?: number;
  [AccommodationFilterQueryParam.STARS]?: number[];
  [AccommodationFilterQueryParam.CATEGORIES]?: number[];
  [AccommodationFilterQueryParam.AMENITIES]?: number[];
  [AccommodationFilterQueryParam.EXTRAS]?: number[];
  [AccommodationFilterQueryParam.PAGE]?: number;
  [AccommodationFilterQueryParam.REVIEW_SCORE]?: string[];
  [AccommodationFilterQueryParam.STAY_CATEGORIES]?: string[];
  [AccommodationFilterQueryParam.STAR_RATINGS]?: string[];
  [AccommodationFilterQueryParam.MEALS_INCLUDED]?: string[];
  [AccommodationFilterQueryParam.ROOM_PREFERENCES]?: string[];
  [AccommodationFilterQueryParam.STAY_AMENITIES]?: string[];
  [AccommodationFilterQueryParam.PRICE]?: string[];
  [AccommodationFilterQueryParam.SEARCH_ID]?: string;
};
