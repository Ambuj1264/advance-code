import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import ProductInfoLoading from "./ProductInfoLoading";
import ProductOverviewLoading from "./ProductOverviewLoading";

import { skeletonPulse, mqMin } from "styles/base";
import { gutters } from "styles/variables";
import ReviewsLoading from "components/features/Reviews/ReviewsLoading";

const ContentLoading = styled.div(
  skeletonPulse,
  css`
    margin-top: ${gutters.large * 2}px;
    height: 210px;

    ${mqMin.large} {
      height: 300px;
    }
  `
);

const ProductContentLoading = ({ showReviews = true }: { showReviews?: boolean }) => (
  <>
    <ProductInfoLoading />
    <ProductOverviewLoading />
    <ContentLoading />
    <ContentLoading />
    {showReviews && <ReviewsLoading />}
  </>
);

export default ProductContentLoading;
