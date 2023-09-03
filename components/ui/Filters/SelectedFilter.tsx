import React, { useCallback } from "react";
import { ArrayParam, NumberParam, StringParam, useQueryParams } from "use-query-params";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Close from "@travelshift/ui/icons/close.svg";

import { FilterType, CursorPaginationQueryParams } from "types/enums";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { gutters, greyColor, borderRadiusSmall, whiteColor } from "styles/variables";
import { typographySubtitle3 } from "styles/typography";

const ButtonWrapper = styled.div(
  ({ theme }) =>
    css`
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: ${gutters.large / 4}px ${gutters.small / 4}px;
      border-radius: ${borderRadiusSmall};
      padding: ${gutters.small / 4}px ${gutters.small / 2}px;
      background-color: ${rgba(theme.colors.primary, 0.1)};
    `
);

const FilterName = styled.div([
  typographySubtitle3,
  css`
    color: ${greyColor};
  `,
]);

const CloseButtonWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: ${gutters.small / 4}px;
    border-radius: 50%;
    width: 16px;
    min-width: 16px;
    height: 16px;
    background-color: ${rgba(theme.colors.primary, 0.4)};
    cursor: pointer;
  `
);

const CloseIcon = styled(Close)`
  width: 8px;
  height: 8px;
  fill: ${whiteColor};
`;

const SelectedFilter = ({
  sectionId,
  name,
  value,
  queryParamList,
  filterType,
}: {
  name: string;
  queryParamList: string[];
  sectionId: string;
  value: string[];
  filterType: FilterType;
}) => {
  const [, setOptions] = useQueryParams({
    [sectionId]: ArrayParam,
    page: NumberParam,
    [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
    [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
  });
  const onRemoveFilter = useCallback(() => {
    if (filterType === FilterType.RANGE) {
      setOptions(
        {
          [sectionId]: undefined,
          page: 1,
          [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
          [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
        },
        QueryParamTypes.PUSH_IN
      );
    } else {
      setOptions(
        {
          [sectionId]: queryParamList.filter(param => !value.includes(param)),
          page: 1,
          [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
          [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
        },
        QueryParamTypes.PUSH_IN
      );
    }
  }, [filterType, sectionId, value, queryParamList, setOptions]);
  return (
    <ButtonWrapper>
      <FilterName>{name}</FilterName>
      <CloseButtonWrapper onClick={onRemoveFilter}>
        <CloseIcon />
      </CloseButtonWrapper>
    </ButtonWrapper>
  );
};

export default SelectedFilter;
