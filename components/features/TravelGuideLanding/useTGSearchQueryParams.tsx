import { ArrayParam, NumberParam, StringParam, useQueryParams } from "use-query-params";

export enum TGSearchQueryParam {
  COUNTRY_IDS = "countryIds",
  CITY_IDS = "cityIds",
  ORDER_BY = "orderBy",
  ORDER_DIRECTION = "orderDirection",
  PAGE = "page",
}

const TGSearchQueryParamScheme = {
  [TGSearchQueryParam.PAGE]: NumberParam,
  [TGSearchQueryParam.COUNTRY_IDS]: ArrayParam,
  [TGSearchQueryParam.CITY_IDS]: ArrayParam,
  [TGSearchQueryParam.ORDER_BY]: StringParam,
  [TGSearchQueryParam.ORDER_DIRECTION]: StringParam,
};

const useTGSearchQueryParams = () => useQueryParams(TGSearchQueryParamScheme);

export default useTGSearchQueryParams;
