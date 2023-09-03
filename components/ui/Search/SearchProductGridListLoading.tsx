import React, { ElementType } from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";

import Row from "../Grid/Row";

import { GridItemWrapper } from "./SearchList";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

const StyledGridItemWrapper = styled(GridItemWrapper)`
  margin-bottom: ${gutters.small}px;

  ${mqMin.medium} {
    margin-bottom: ${gutters.large}px;
    &:nth-last-of-type(-n + 3) {
      margin-bottom: 0;
    }
  }

  ${mqMin.desktop} {
    &:nth-last-of-type(-n + 4) {
      margin-bottom: 0;
    }
  }
`;

const StyledRow = styled(Row)`
  margin-bottom: ${gutters.small}px;
  ${mqMin.medium} {
    margin-bottom: ${gutters.large}px;
  }
`;

const SearchProductGridListLoading = ({
  products = 12,
  TileCardSkeletonElement,
  hasFilters,
  numberOfLoadingItems,
}: {
  products?: number;
  TileCardSkeletonElement: ElementType;
  hasFilters?: boolean;
  numberOfLoadingItems?: number;
}) => (
  <StyledRow>
    {range(1, numberOfLoadingItems || products).map(i => (
      <StyledGridItemWrapper
        key={`SearchProductGridListLoading-${i}`}
        columnSizes={{
          small: 1,
          medium: 1 / 2,
          desktop: 1 / (hasFilters ? 3 : 4),
        }}
      >
        <TileCardSkeletonElement />
      </StyledGridItemWrapper>
    ))}
  </StyledRow>
);

export default SearchProductGridListLoading;
