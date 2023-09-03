import React from "react";
import styled from "@emotion/styled";

import { skeletonPulse, mqMin } from "styles/base";

const LoadingTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0 12px 0;
  width: 100%;
  ${mqMin.large} {
    margin: 16px 0 24px 0;
  }
`;
const LoadingTitle = styled.div`
  ${skeletonPulse};
  width: 300px;
  height: 28px;
  ${mqMin.large} {
    width: 500px;
    height: 32px;
  }
`;

const ProductPageHeaderLoading = () => (
  <LoadingTitleWrapper>
    <LoadingTitle />
  </LoadingTitleWrapper>
);

export default ProductPageHeaderLoading;
