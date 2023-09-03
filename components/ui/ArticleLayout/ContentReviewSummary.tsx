import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import ReviewSummaryScore, { Leaf } from "components/ui/ReviewSummary/ReviewSummaryScore";
import ReviewSummaryCount, {
  ReviewTotalCountLink,
  ReviewTotalCountText,
} from "components/ui/ReviewSummary/ReviewSummaryCount";
import { fontWeightSemibold, greyColor, blackColor, gutters } from "styles/variables";
import { Stars, Star } from "components/ui/ReviewStars";
import { typographyCaptionSmall, typographyH5 } from "styles/typography";

const Wrapper = styled.div`
  display: flex;
`;

export const ReviewSummaryScoreStyled = styled(ReviewSummaryScore)([
  typographyH5,
  ({ theme }) => css`
    margin-left: -5px;
    color: ${greyColor};
    font-size: 18px;
    line-height: 25px;
    ${Leaf} {
      position: relative;
      height: 32px;
      fill: ${rgba(theme.colors.action, 0.7)};
    }

    ${Leaf}:first-of-type {
      left: 5px;
    }

    ${Leaf}:last-of-type {
      right: 5px;
    }
  `,
]);

const ReviewSummaryCountStyled = styled(ReviewSummaryCount)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  text-align: left;

  ${ReviewTotalCountLink}, ${ReviewTotalCountText} {
    ${typographyCaptionSmall};
    display: block;
    margin-top: ${gutters.small / 4}px;
    color: ${rgba(blackColor, 0.7)};
    font-weight: ${fontWeightSemibold};
    line-height: 12px;
  }
  ${Stars} {
    display: inline-flex;
  }

  ${Star} {
    width: 11px;
    height: 11px;
  }
`;

const ContentReviewSummary = ({
  reviewTotalScore,
  reviewTotalCount,
  reviewsCountText,
  className,
}: {
  reviewTotalScore: number;
  reviewTotalCount: number;
  reviewsCountText: string;
  className?: string;
}) => (
  <Wrapper className={className}>
    <ReviewSummaryScoreStyled reviewTotalScore={reviewTotalScore.toFixed(1)} />
    <ReviewSummaryCountStyled
      reviewTotalScore={reviewTotalScore}
      reviewTotalCount={reviewTotalCount}
      reviewsCountText={reviewsCountText}
      isLink={false}
    />
  </Wrapper>
);

export default ContentReviewSummary;
