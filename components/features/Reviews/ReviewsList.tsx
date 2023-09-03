import React from "react";
import styled from "@emotion/styled";

import Review from "./Review";

type Props = {
  reviews: ReadonlyArray<Review>;
  className?: string;
};

const ReviewListWrapper = styled.div`
  word-break: break-word;
`;

const ReviewsList = ({ reviews, className }: Props) => (
  <ReviewListWrapper className={className}>
    {reviews.map((review: Review) => (
      <Review
        key={review.id}
        id={review.id}
        text={review.text}
        userName={review.userName}
        userAvatarImage={review.userAvatarImage}
        reviewScore={review.reviewScore}
        reviewScoreText={review.reviewScoreText}
        createdDate={review.createdDate}
        isVerified={review.isVerified}
        helpfulVotes={review.helpfulVotes}
        ownerResponse={review.ownerResponse}
      />
    ))}
  </ReviewListWrapper>
);

export default ReviewsList;
