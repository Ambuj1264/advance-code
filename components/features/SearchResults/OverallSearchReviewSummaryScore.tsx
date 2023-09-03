import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { Wrapper } from "components/ui/ReviewSummary/ReviewSummary";
import ReviewSummaryCount, {
  ReviewTotalCountText,
} from "components/ui/ReviewSummary/ReviewSummaryCount";
import { Wrapper as ReviewSummaryScoreWrapper } from "components/ui/ReviewSummary/ReviewSummaryScore";
import { greyColor, gutters, fontSizeCaptionSmall, fontWeightRegular } from "styles/variables";

const StyledWrapper = styled(Wrapper)`
  filter: none;
`;

const greyColorWithOpacity = rgba(greyColor, 0.7);

const StyledReviewSummaryScoreWrapper = styled(ReviewSummaryScoreWrapper)`
  margin: 0;
  color: ${greyColor};
`;

const StyledReviewSummaryCount = styled(ReviewSummaryCount)`
  margin-left: ${gutters.small / 4}px;
  height: 30px;
  line-height: 10px;
  span {
    line-height: ${gutters.small / 2}px;
  }

  ${ReviewTotalCountText} {
    color: ${greyColorWithOpacity};
    font-size: ${fontSizeCaptionSmall};
    font-weight: ${fontWeightRegular};
  }
`;

const OverallReviewSummaryScore = ({
  reviewTotalScore,
  reviewTotalCount,
}: {
  reviewTotalScore: number;
  reviewTotalCount: number;
}) => {
  return (
    <StyledWrapper>
      <StyledReviewSummaryScoreWrapper>
        {reviewTotalScore?.toFixed(1)}
      </StyledReviewSummaryScoreWrapper>
      <StyledReviewSummaryCount
        reviewTotalScore={reviewTotalScore}
        reviewTotalCount={reviewTotalCount}
        isLink={false}
      />
    </StyledWrapper>
  );
};

export default OverallReviewSummaryScore;
