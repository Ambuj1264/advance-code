import { useQueryParams, StringParam, BooleanParam, ArrayParam } from "use-query-params";

import { VacationPackageSearchQueryParam } from "../utils/useVacationSearchQueryParams";

export const VPQueryParamScheme = {
  [VacationPackageSearchQueryParam.DATE_FROM]: StringParam,
  [VacationPackageSearchQueryParam.DATE_TO]: StringParam,
  [VacationPackageSearchQueryParam.ORIGIN_ID]: StringParam,
  [VacationPackageSearchQueryParam.ORIGIN_NAME]: StringParam,
  [VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID]: StringParam,
  [VacationPackageSearchQueryParam.DESTINATION_ID]: StringParam,
  [VacationPackageSearchQueryParam.DESTINATION_NAME]: StringParam,
  [VacationPackageSearchQueryParam.OCCUPANCIES]: ArrayParam,
  [VacationPackageSearchQueryParam.INCLUDE_FLIGHTS]: BooleanParam,
  [VacationPackageSearchQueryParam.USE_PREFETCH]: BooleanParam,
};

export type VPQueryParamsType = {
  [VacationPackageSearchQueryParam.DATE_FROM]?: string;
  [VacationPackageSearchQueryParam.DATE_TO]?: string;
  [VacationPackageSearchQueryParam.ORIGIN_ID]?: string;
  [VacationPackageSearchQueryParam.ORIGIN_NAME]?: string;
  [VacationPackageSearchQueryParam.ORIGIN_COUNTRY_ID]: string;
  [VacationPackageSearchQueryParam.DESTINATION_ID]?: string;
  [VacationPackageSearchQueryParam.DESTINATION_NAME]?: string;
  [VacationPackageSearchQueryParam.OCCUPANCIES]?: string[];
  [VacationPackageSearchQueryParam.INCLUDE_FLIGHTS]?: boolean;
  [VacationPackageSearchQueryParam.USE_PREFETCH]?: boolean;
};

const useVPQueryParams = () => useQueryParams(VPQueryParamScheme);

export default useVPQueryParams;
