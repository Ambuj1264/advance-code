import {
  useQueryParams,
  StringParam,
  ArrayParam,
  NumberParam,
  NumericArrayParam,
} from "use-query-params";

import { FilterQueryParam, CursorPaginationQueryParams } from "types/enums";

export const TourSearchQueryParamsScheme = {
  [FilterQueryParam.ORDER_BY]: StringParam,
  [FilterQueryParam.ORDER_DIRECTION]: StringParam,
  [FilterQueryParam.DURATION_IDS]: ArrayParam,
  [FilterQueryParam.ACTIVITY_IDS]: ArrayParam,
  [FilterQueryParam.ATTRACTION_IDS]: ArrayParam,
  [FilterQueryParam.STARTING_LOCATION_ID]: StringParam,
  [FilterQueryParam.STARTING_LOCATION_NAME]: StringParam,
  [FilterQueryParam.ADULTS]: NumberParam,
  [FilterQueryParam.CHILDREN]: NumberParam,
  [FilterQueryParam.TEENAGERS]: NumberParam,
  [FilterQueryParam.CHILDREN_AGES]: NumericArrayParam,
  [FilterQueryParam.DATE_FROM]: StringParam,
  [FilterQueryParam.DATE_TO]: StringParam,
  [FilterQueryParam.PAGE]: NumberParam,
  [FilterQueryParam.PRICE]: ArrayParam,
  [FilterQueryParam.TIME]: ArrayParam,
  [FilterQueryParam.REVIEW_SCORE]: ArrayParam,
  [FilterQueryParam.REQUEST_ID]: StringParam,
  [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
  [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
};

export type TourSearchQueryParamsType = {
  [FilterQueryParam.ORDER_BY]?: string;
  [FilterQueryParam.ORDER_DIRECTION]?: string;
  [FilterQueryParam.DURATION_IDS]?: string[];
  [FilterQueryParam.ACTIVITY_IDS]?: string[];
  [FilterQueryParam.ATTRACTION_IDS]?: string[];
  [FilterQueryParam.STARTING_LOCATION_ID]?: string;
  [FilterQueryParam.STARTING_LOCATION_NAME]?: string;
  [FilterQueryParam.ADULTS]?: number;
  [FilterQueryParam.CHILDREN]?: number;
  [FilterQueryParam.CHILDREN_AGES]?: number[];
  [FilterQueryParam.DATE_FROM]?: string;
  [FilterQueryParam.DATE_TO]?: string;
  [FilterQueryParam.PAGE]?: number;
  [FilterQueryParam.PRICE]?: string[];
  [FilterQueryParam.TIME]?: string[];
  [FilterQueryParam.REVIEW_SCORE]?: string[];
  [FilterQueryParam.REQUEST_ID]?: string;
  [CursorPaginationQueryParams.NEXT_PAGE_ID]?: string;
  [CursorPaginationQueryParams.PREV_PAGE_ID]?: string;
};

const useTourSearchQueryParams = () => {
  const [
    {
      orderBy,
      orderDirection,
      durationIds,
      activityIds,
      attractionIds,
      startingLocationId,
      startingLocationName,
      adults,
      children,
      teenagers,
      childrenAges,
      dateFrom,
      dateTo,
      page = 1,
      price,
      time,
      reviewScore,
      requestId,
      nextPageId,
      prevPageId,
    },
    setQueryParams,
  ] = useQueryParams(TourSearchQueryParamsScheme);

  return [
    {
      orderBy,
      orderDirection,
      activityIds,
      durationIds,
      attractionIds,
      startingLocationId,
      startingLocationName,
      adults,
      teenagers,
      children,
      childrenAges,
      dateFrom,
      dateTo,
      page,
      price,
      time,
      reviewScore,
      requestId,
      nextPageId,
      prevPageId,
    },
    setQueryParams,
  ] as const;
};

export default useTourSearchQueryParams;
