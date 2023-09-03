import React from "react";
import styled from "@emotion/styled";

import ReviewStars from "../ReviewStars";

import { gutters, whiteColor } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import { typographyCaption, typographyH5 } from "styles/typography";

const Wrapper = styled.div`
  height: 29px;
  color: ${whiteColor};
  line-height: 25px;
  text-align: center;
`;

const TotalScore = styled.div`
  ${typographyH5};
  display: inline-block;
  margin-right: ${gutters.small / 2}px;
  vertical-align: top;
`;

const AvgRatingText = styled.span`
  ${typographyCaption};
  display: inline-block;
  text-transform: lowercase;
  vertical-align: middle;
`;

const ReviewStarsWrapper = styled.div`
  display: inline-block;
  margin: 0 ${gutters.large / 2}px;
  vertical-align: middle;
`;

const ReviewsCount = styled.span`
  ${typographyCaption};
  display: inline-block;
  text-transform: lowercase;
  vertical-align: middle;
`;

const ReviewSummaryHorizontal = ({
  reviewTotalScore,
  reviewTotalCount,
  className,
}: {
  reviewTotalScore: number;
  reviewTotalCount: number;
  className?: string;
}) => {
  return (
    <Wrapper className={className}>
      <TotalScore>{reviewTotalScore.toFixed(1)}</TotalScore>
      <AvgRatingText>
        <Trans ns={Namespaces.commonNs}>Average rating</Trans>
      </AvgRatingText>
      <ReviewStarsWrapper>
        <ReviewStars reviewScore={reviewTotalScore} />
      </ReviewStarsWrapper>
      <ReviewsCount>
        {reviewTotalCount} <Trans ns={Namespaces.commonNs}>Reviews</Trans>
      </ReviewsCount>
    </Wrapper>
  );
};

export default ReviewSummaryHorizontal;
