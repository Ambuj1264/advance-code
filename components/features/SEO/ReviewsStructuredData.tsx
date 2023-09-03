import React from "react";

import { constructAggregateRating, constructStructuredReviews } from "./utils/SEOUtils";

const ReviewsStructuredData = ({
  reviews,
  productName,
}: {
  reviews: QueryReview[];
  productName: string;
}) => {
  const aggregationRatingValue =
    reviews.reduce((ratingSum, review) => ratingSum + review.reviewScore, 0) / reviews.length;

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: productName,
          aggregateRating: constructAggregateRating(aggregationRatingValue, reviews.length),
          review: constructStructuredReviews(reviews),
        }),
      }}
    />
  );
};

export default ReviewsStructuredData;
