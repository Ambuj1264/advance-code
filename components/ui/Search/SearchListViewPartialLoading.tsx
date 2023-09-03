import React, { ElementType } from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters } from "styles/variables";

const ProductCardWrapper = styled.div(
  css`
    margin-top: ${gutters.small}px;
  `
);

const Wrapper = styled.div`
  width: 100%;
  &:first-child {
    margin-top: -${gutters.small}px;
  }
`;

const SearchListViewPartialLoading = ({
  ListCardSkeletonElement,
  allProvidersLoading,
  someProviderLoading,
}: {
  ListCardSkeletonElement: ElementType;
  allProvidersLoading: boolean;
  someProviderLoading: boolean;
}) => {
  return someProviderLoading || allProvidersLoading ? (
    <Wrapper>
      {range(1, 12).map(i => (
        <ProductCardWrapper key={`ListCardSkeletonElement-${i}`}>
          <ListCardSkeletonElement />
        </ProductCardWrapper>
      ))}
    </Wrapper>
  ) : null;
};

export default SearchListViewPartialLoading;
