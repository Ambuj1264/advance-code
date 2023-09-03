import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Review from "./Review";
import { LongReviewsLoading } from "./ReviewsLoading";

import { column, mqMin } from "styles/base";
import { gutters } from "styles/variables";
import SeeMoreContent from "components/ui/SeeMoreContent";

const ReviewItem = styled.div([
  column({ small: 1, medium: 1, large: 1 / 2 }),
  css`
    margin-bottom: ${gutters.small}px;
    ${mqMin.large} {
      margin-bottom: ${gutters.large}px;
      height: 245px;
    }
  `,
]);

const reviewDescriptionLineHeight = 24;

const ReviewStyled = styled(Review, { shouldForwardProp: () => true })<{
  numberOfLinesInText?: number;
}>(({ numberOfLinesInText }) => [
  css`
    ${mqMin.large} {
      height: 100%;
    }
  `,
  !!numberOfLinesInText &&
    // Set min-height for Review Description box based on line-height of text
    css`
      & > div:last-child {
        min-height: ${numberOfLinesInText * reviewDescriptionLineHeight}px;
      }
    `,
]);

const CONTAINER_ID = "ReviewsShowMore";

const ReviewsGrid = ({
  reviews,
  reviewsToShow,
  numberOfLinesInText,
  isLoading,
}: {
  reviews: ReadonlyArray<Review>;
  reviewsToShow?: number;
  numberOfLinesInText?: number;
  isLoading: boolean;
}) => {
  const renderReviewItem = (review: Review) => (
    <ReviewItem key={review.id}>
      {isLoading ? (
        <LongReviewsLoading />
      ) : (
        <ReviewStyled {...review} isCompact numberOfLinesInText={numberOfLinesInText} />
      )}
    </ReviewItem>
  );

  return (
    <SeeMoreContent numberOfItemsToShow={reviewsToShow} containerId={CONTAINER_ID}>
      <>
        {reviews.slice(0, reviewsToShow).map(renderReviewItem)}
        <div id={CONTAINER_ID} hidden>
          {reviews.slice(reviewsToShow).map(renderReviewItem)}
        </div>
      </>
    </SeeMoreContent>
  );
};

export default ReviewsGrid;
