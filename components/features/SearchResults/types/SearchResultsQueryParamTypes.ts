import { StringParam } from "use-query-params";

export enum SearchEnums {
  SEARCH = "search",
  NEXT_PAGE_ID = "nextPageId",
  PREV_PAGE_ID = "prevPageId",
}

export const SearchResultPageQueryParamScheme = {
  [SearchEnums.NEXT_PAGE_ID]: StringParam,
  [SearchEnums.PREV_PAGE_ID]: StringParam,
  [SearchEnums.SEARCH]: StringParam,
};

export type SearchResultPageQueryParamsType = {
  [SearchEnums.SEARCH]?: string;
  [SearchEnums.NEXT_PAGE_ID]?: string;
  [SearchEnums.PREV_PAGE_ID]?: string;
};
