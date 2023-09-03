import React, { useState, useCallback, useEffect } from "react";

import ReviewsSection from "components/ui/ReviewsSection";

const CarReviewsPaginated = ({
  reviews,
  totalPages,
  loading = false,
  onPageChange,
}: {
  onPageChange: (current: number) => void;
  totalPages: number;
  loading?: boolean;
  reviews: ReadonlyArray<Review>;
}) => {
  const [reviewPage, setReviewPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageChangeHandler = useCallback(
    (current: number) => {
      onPageChange(current);
      if (!loading) {
        setReviewPage(current);
      }
    },
    [onPageChange]
  );

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <ReviewsSection
      isLoading={isLoading}
      onPageChange={pageChangeHandler}
      reviews={reviews}
      reviewPage={reviewPage}
      totalPages={totalPages}
    />
  );
};

export default CarReviewsPaginated;
