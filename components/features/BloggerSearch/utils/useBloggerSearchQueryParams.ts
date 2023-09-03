import { useQueryParams, NumberParam, StringParam, ArrayParam } from "use-query-params";

import { SharedFilterQueryParams, PageType } from "../../../../types/enums";

export enum BloggerSearchQueryParam {
  TEXT = "text",
  CATEGORYIDS = "categoryIds",
  BLOGGERTYPE = "bloggerType",
}
export const BloggerSearchQueryParamScheme = {
  [SharedFilterQueryParams.PAGE]: NumberParam,
  [SharedFilterQueryParams.ORDER_BY]: StringParam,
  [BloggerSearchQueryParam.TEXT]: StringParam,
  [BloggerSearchQueryParam.CATEGORYIDS]: ArrayParam,
  [BloggerSearchQueryParam.BLOGGERTYPE]: ArrayParam,
};

export type BloggerSearchQueryParamsType = {
  [SharedFilterQueryParams.PAGE]?: number;
  [SharedFilterQueryParams.ORDER_BY]?: string;
  [BloggerSearchQueryParam.TEXT]?: string;
  [BloggerSearchQueryParam.CATEGORYIDS]?: number[];
  [BloggerSearchQueryParam.BLOGGERTYPE]: (PageType.LOCALCOMMUNITY | PageType.TRAVELCOMMUNITY)[];
};

const useBloggerSearchQueryParams = () => useQueryParams(BloggerSearchQueryParamScheme);

export default useBloggerSearchQueryParams;
