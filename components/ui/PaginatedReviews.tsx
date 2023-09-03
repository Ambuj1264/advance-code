import React, { useState, useCallback } from "react";

import ReviewsSection from "./ReviewsSection";

import { getTotalPages } from "utils/helperUtils";

const PaginatedReviews = ({
  reviewsOnPage = 4,
  reviews,
}: {
  reviewsOnPage?: number;
  reviews: ReadonlyArray<Review>;
}) => {
  const [reviewPage, setReviewPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageChangeHandler = useCallback((current: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setReviewPage(current);
      setIsLoading(false);
    }, 250);
  }, []);

  const totalPages = getTotalPages(reviews.length, reviewsOnPage);
  const slicedReviews = reviews.slice((reviewPage - 1) * reviewsOnPage, reviewPage * reviewsOnPage);

  return (
    <ReviewsSection
      onPageChange={pageChangeHandler}
      reviews={slicedReviews}
      reviewPage={reviewPage}
      totalPages={totalPages}
      isLoading={isLoading}
    />
  );
};

export default PaginatedReviews;
