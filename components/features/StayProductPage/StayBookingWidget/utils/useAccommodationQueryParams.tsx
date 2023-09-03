import {
  useQueryParams,
  StringParam,
  NumberParam,
  NumericArrayParam,
  ArrayParam,
} from "use-query-params";

import { AccommodationFilterQueryParam } from "types/enums";

const useAccommodationQueryParams = () =>
  useQueryParams({
    [AccommodationFilterQueryParam.ADULTS]: NumberParam,
    [AccommodationFilterQueryParam.CHILDREN]: NumericArrayParam,
    [AccommodationFilterQueryParam.DATE_FROM]: StringParam,
    [AccommodationFilterQueryParam.DATE_TO]: StringParam,
    [AccommodationFilterQueryParam.ROOMS]: NumberParam,
    [AccommodationFilterQueryParam.MEALS_INCLUDED]: ArrayParam,
  });

export default useAccommodationQueryParams;
