import { NumberParam, StringParam, useQueryParams } from "use-query-params";

import { POSTBOOKING_QUERY_PARAMS } from "../../types/postBookingEnums";

export const PostBookingQueryParamsScheme = {
  [POSTBOOKING_QUERY_PARAMS.nav]: StringParam,
  [POSTBOOKING_QUERY_PARAMS.tripId]: NumberParam,
  [POSTBOOKING_QUERY_PARAMS.day]: NumberParam,
};

export const usePostBookingQueryParams = () => {
  return useQueryParams(PostBookingQueryParamsScheme);
};
