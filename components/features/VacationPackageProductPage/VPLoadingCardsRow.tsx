import React from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import {
  borderRadius,
  borderRadiusTiny,
  boxShadowTileRegular,
  gutters,
  loadingBlue,
} from "styles/variables";
import { skeletonPulse } from "styles/base";

const StyledSkeletonWrapper = styled.div`
  margin-bottom: 4px;
  box-shadow: ${boxShadowTileRegular};
  border-radius: ${borderRadius};
  overflow: hidden;
`;

const SkeletonImage = styled.div`
  height: 207px;
  background: ${loadingBlue};
`;

const SkeletonHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 ${gutters.small}px;
`;

const HeadlineLoading = styled.div([
  skeletonPulse,
  css`
    height: 20px;
  `,
]);

const SkeletonProductSpecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  height: 148px;
  padding: ${gutters.small}px;
`;

const SkeletonProductSpec = styled.div([
  skeletonPulse,
  css`
    width: 40%;
    height: 20px;
  `,
]);

const SkeletonFooter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${gutters.small / 2}px;
  height: 40px;
  padding: 0 ${gutters.small}px;
`;

const FooterLoading = styled.div([
  skeletonPulse,
  css`
    height: 20px;
  `,
]);

const similarProductsColumnStyles = css`
  border: solid ${borderRadiusTiny} transparent;
`;

export const VPLoadingCard = ({ key }: { key: number }) => {
  return (
    <StyledSimilarProductsColumn key={key} productsCount={3} css={similarProductsColumnStyles}>
      <StyledSkeletonWrapper>
        <SkeletonImage />
        <SkeletonHeadingWrapper>
          <HeadlineLoading />
        </SkeletonHeadingWrapper>
        <SkeletonProductSpecs>
          {range(0, 3).map(spec => (
            <SkeletonProductSpec key={spec} />
          ))}
        </SkeletonProductSpecs>
        <SkeletonFooter>
          <FooterLoading />
        </SkeletonFooter>
      </StyledSkeletonWrapper>
    </StyledSimilarProductsColumn>
  );
};
const VPLoadingCardsRow = () => {
  return (
    <ProductCardRow>
      {range(0, 2).map(key => {
        return <VPLoadingCard key={key} />;
      })}
    </ProductCardRow>
  );
};

export default VPLoadingCardsRow;
