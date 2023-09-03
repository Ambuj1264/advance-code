import React from "react";
import styled from "@emotion/styled";

import ReviewSummaryScore from "./ReviewSummaryScore";
import BaseReviewSummaryCount from "./ReviewSummaryCount";

import { gutters } from "styles/variables";

export const ReviewSummaryCount = styled(BaseReviewSummaryCount)`
  margin-left: ${gutters.small / 2}px;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  filter: drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.5)) drop-shadow(-1px -1px 0px rgba(0, 0, 0, 0.1));
`;

const ReviewSummary = ({
  reviewTotalScore,
  reviewTotalCount,
  className,
  isLink,
}: {
  reviewTotalScore: number;
  reviewTotalCount: number;
  className?: string;
  isLink: boolean;
}) => (
  <Wrapper className={className}>
    <ReviewSummaryScore reviewTotalScore={reviewTotalScore?.toFixed(1)} />
    <ReviewSummaryCount
      reviewTotalScore={reviewTotalScore}
      reviewTotalCount={reviewTotalCount}
      isLink={isLink}
    />
  </Wrapper>
);

export default ReviewSummary;
