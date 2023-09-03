import { OperationVariables } from "apollo-client";
import { useCallback, useState } from "react";

import { getGraphCmsPaginationParams } from "../utils/landingPageUtils";

import useOnDidUpdate from "hooks/useOnDidUpdate";

export type LandingSectionPaginationParams = {
  isLastPage: boolean;
  isFirstPage: boolean;
  loadingMoreItems: boolean;
  fetchMore: () => void;
};

const SECTION_PAGINATION_LIMIT = 10;

export const useSectionPagination = ({
  sectionContent,
  itemsPerPage = 4,
  variables,
  fetchMore,
  pageInfo,
  totalPages = 0,
}: {
  sectionContent?: LandingPageTypes.LandingPageNormalizedSectionData[0]["sectionContent"];
  itemsPerPage?: number;
  variables: OperationVariables;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: (variables: OperationVariables) => void;
  pageInfo?: QueryVacationPackagesSearchTypes.VacationPackagePageInfo;
  totalPages?: number;
}): LandingSectionPaginationParams => {
  const [state, setState] = useState({
    page: 1,
    loadingMoreItems: false,
  });
  const { page, loadingMoreItems } = state;
  const hasMoreContent =
    itemsPerPage &&
    sectionContent &&
    (totalPages > 0 ? loadingMoreItems || totalPages > page : pageInfo?.hasNextPage);
  useOnDidUpdate(() => {
    setState(oldState => ({
      ...oldState,
      loadingMoreItems: false,
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionContent]);

  const fetchMoreCb = useCallback(() => {
    if (page >= SECTION_PAGINATION_LIMIT || !hasMoreContent) return;

    const nextVariables = {
      ...variables,
      ...getGraphCmsPaginationParams({
        numberOfItems: itemsPerPage,
        nextPageId: pageInfo?.endCursor,
      }),
      ...(totalPages > 1 ? { page: page + 1 } : {}),
    };

    setState(oldState => ({
      ...oldState,
      loadingMoreItems: true,
      page: page + 1,
    }));

    fetchMore(nextVariables);
  }, [page, hasMoreContent, variables, itemsPerPage, pageInfo?.endCursor, fetchMore, totalPages]);

  return {
    isLastPage: !hasMoreContent || page >= SECTION_PAGINATION_LIMIT,
    isFirstPage: page <= 1,
    fetchMore: fetchMoreCb,
    loadingMoreItems,
  };
};
