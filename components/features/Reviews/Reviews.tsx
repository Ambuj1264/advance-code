import React from "react";
import styled from "@emotion/styled";

import ReviewsHeader from "./ReviewsHeader";
import BaseReviewsList from "./ReviewsList";
import ReviewsLoading from "./ReviewsLoading";

import { gutters } from "styles/variables";
import { SupportedLanguages } from "types/enums";

type Props = {
  reviews: ReadonlyArray<Review>;
  reviewTotalScore: number;
  reviewTotalCount: number;
  localeFilter: string;
  scoreFilter: string;
  loading: boolean;
  changeReviewsLocaleFilter: (reviewsLocaleFilter: string) => void;
  changeReviewsScoreFilter: (reviewsScoreFilter: string) => void;
  localeOptions: SupportedLanguages[];
  reviewsLogo?: Image;
  disableRatingFilter?: boolean;
  hideTotalRatings?: boolean;
};

const ReviewsList = styled(BaseReviewsList)`
  margin-top: ${gutters.large}px;
`;

const Reviews = ({
  reviews,
  reviewTotalScore,
  reviewTotalCount,
  changeReviewsLocaleFilter,
  changeReviewsScoreFilter,
  localeFilter,
  scoreFilter,
  loading = false,
  localeOptions,
  reviewsLogo,
  disableRatingFilter,
  hideTotalRatings,
}: Props) => (
  <>
    <ReviewsHeader
      reviewTotalScore={reviewTotalScore}
      reviewTotalCount={reviewTotalCount}
      changeReviewsLocaleFilter={changeReviewsLocaleFilter}
      changeReviewsScoreFilter={changeReviewsScoreFilter}
      localeFilter={localeFilter}
      scoreFilter={scoreFilter}
      localeOptions={localeOptions}
      reviewsLogo={reviewsLogo}
      disableRatingFilter={disableRatingFilter}
      hideTotalRatings={hideTotalRatings}
    />
    {loading ? <ReviewsLoading hideFilters /> : <ReviewsList reviews={reviews} />}
  </>
);

export default Reviews;
