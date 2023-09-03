import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { greyColor, gutters } from "styles/variables";
import { typographyH3, typographyBody2, typographyH4 } from "styles/typography";
import { mqMin, mqMax } from "styles/base";
import ReviewStars from "components/ui/ReviewStars";

const Score = styled.div([
  typographyH3,
  css`
    color: ${greyColor};
    ${mqMax.large} {
      ${typographyH4}
    }
  `,
]);

const Count = styled.div([
  typographyBody2,
  css`
    margin-left: ${gutters.small / 2}px;
    color: ${rgba(greyColor, 0.6)};
    ${mqMin.medium} {
      margin-left: 0;
    }
  `,
]);

const SummaryCount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: ${gutters.small / 2}px;
  ${mqMin.medium} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewSummaryNoLeafs = ({
  reviewText,
  reviewTotalScore,
}: {
  reviewText: string;
  reviewTotalScore: number;
}) => (
  <SummaryWrapper>
    <Score>{reviewTotalScore.toFixed(1)}</Score>
    <SummaryCount>
      <ReviewStars reviewScore={reviewTotalScore} />
      <Count>{reviewText}</Count>
    </SummaryCount>
  </SummaryWrapper>
);

export default ReviewSummaryNoLeafs;
