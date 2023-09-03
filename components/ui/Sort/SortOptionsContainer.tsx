import React from "react";
import { useQueryParams, StringParam, NumberParam } from "use-query-params";

import { sortParameters } from "./sortUtils";
import SortOptionsDropdown from "./SortOptionsDropdown";
import SortOptionsMobileButton from "./SortOptionsMobileButton";
import SortOptionsModal from "./SortOptionsModal";

import useToggle from "hooks/useToggle";
import MediaQuery from "components/ui/MediaQuery";
import { CursorPaginationQueryParams, DisplayType, FilterQueryParam } from "types/enums";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { useIsSmallDevice } from "hooks/useMediaQueryCustom";

const SortOptionsContainer = ({
  sortOptions,
  defaultSelectedIndex = 0,
  resetPageOnFilterSelection,
  customSortParams,
}: {
  sortOptions: React.ReactElement[];
  defaultSelectedIndex?: number;
  resetPageOnFilterSelection?: boolean;
  customSortParams?: SearchPageTypes.SortParameter[];
}) => {
  const isSmallDevice = useIsSmallDevice();
  const [isModalOpen, toggleIsModalOpen] = useToggle(false);
  const [{ orderBy, orderDirection, page }, setQueryParams] = useQueryParams({
    [FilterQueryParam.ORDER_BY]: StringParam,
    [FilterQueryParam.ORDER_DIRECTION]: StringParam,
    [FilterQueryParam.PAGE]: NumberParam,
  });

  const resetPageValue = resetPageOnFilterSelection ? 1 : page;

  const hasSortParams = Boolean(orderBy && orderDirection);
  const matchSortIndex = (parameters: { orderBy: string; orderDirection?: string }) =>
    parameters.orderBy?.toLowerCase() === orderBy?.toLowerCase() &&
    parameters?.orderDirection?.toLowerCase() === orderDirection?.toLowerCase();
  const sortParams = customSortParams || sortParameters;
  const selectedIndex = hasSortParams ? sortParams.findIndex(matchSortIndex) : defaultSelectedIndex;
  const onChange = (state: {
    orderBy: SharedTypes.OrderBy;
    orderDirection: SharedTypes.OrderDirection;
  }) =>
    setQueryParams(
      {
        ...state,
        page: resetPageValue,
        ...(resetPageOnFilterSelection
          ? {
              [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
              [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
            }
          : {}),
      },
      QueryParamTypes.PUSH_IN
    );
  return (
    <>
      <div data-nosnippet>
        {!isSmallDevice && (
          <SortOptionsDropdown
            onChange={onChange}
            selectedIndex={selectedIndex}
            options={sortOptions}
            customSortParams={customSortParams}
          />
        )}
      </div>
      <MediaQuery toDisplay={DisplayType.Medium} data-nosnippet>
        <SortOptionsMobileButton toggleModal={toggleIsModalOpen}>
          {sortOptions[selectedIndex]}
        </SortOptionsMobileButton>
      </MediaQuery>
      {isModalOpen && (
        <SortOptionsModal
          onChange={onChange}
          options={sortOptions}
          onClose={toggleIsModalOpen}
          customSortParams={customSortParams}
        />
      )}
    </>
  );
};

export default SortOptionsContainer;
