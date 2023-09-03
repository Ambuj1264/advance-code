import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import ReviewSummaryScore, { Leaf } from "./ReviewSummaryScore";
import ReviewSummaryCount, {
  ReviewTotalCountLink,
  ReviewTotalCountText,
} from "./ReviewSummaryCount";

import { fontWeightSemibold, greyColor, gutters } from "styles/variables";
import { Stars } from "components/ui/ReviewStars";
import { typographyCaptionSmall, typographyH5 } from "styles/typography";

const Wrapper = styled.div`
  display: flex;
`;

export const ReviewSummaryCountStyled = styled(ReviewSummaryCount)`
  flex-grow: 1;
  margin-right: ${gutters.small / 2}px;
  text-align: right;

  ${ReviewTotalCountLink}, ${ReviewTotalCountText} {
    ${typographyCaptionSmall};
    display: block;
    color: ${greyColor};
    font-weight: ${fontWeightSemibold};
    line-height: 12px;
  }
  ${Stars} {
    display: inline-flex;
  }
`;

export const ReviewSummaryScoreStyled = styled(ReviewSummaryScore)([
  typographyH5,
  ({ theme }) => css`
    color: ${greyColor};
    ${Leaf} {
      height: 41px;
      path {
        fill: ${rgba(theme.colors.action, 0.7)};
      }
    }
  `,
]);

const ReviewSummary = ({
  reviewTotalScore,
  reviewTotalCount,
  className,
  isLink,
  reviewsCountText,
}: {
  reviewTotalScore: number;
  reviewTotalCount: number;
  className?: string;
  isLink: boolean;
  reviewsCountText?: string;
}) => (
  <Wrapper className={className}>
    <ReviewSummaryCountStyled
      reviewTotalScore={reviewTotalScore}
      reviewTotalCount={reviewTotalCount}
      reviewsCountText={reviewsCountText}
      isLink={isLink}
    />
    <ReviewSummaryScoreStyled reviewTotalScore={reviewTotalScore.toFixed(1)} />
  </Wrapper>
);

export default ReviewSummary;
