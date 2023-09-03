import React, { ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { DefaultMarginTop } from "styles/base";

const ItemsWrapper = styled.div(
  css`
    & + & {
      ${DefaultMarginTop};
    }
  `
);

const SearchProductListLoading = ({
  products = 12,
  ListCardSkeletonElement,
}: {
  products?: number;
  ListCardSkeletonElement: ElementType;
}) => (
  <>
    {range(1, products).map(i => (
      <ItemsWrapper key={i}>
        <ListCardSkeletonElement />
      </ItemsWrapper>
    ))}
  </>
);

export default SearchProductListLoading;
