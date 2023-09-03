import React from "react";

const CarSearchReviewsStructuredData = ({ reviews }: { reviews: ReadonlyArray<Review> }) => {
  return (
    <>
      {reviews.map(review => (
        <script
          key={`${review.id}`}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Review",
              itemReviewed: {
                "@type": "AutoRental",
                name: review.itemName,
                id: review.itemUrl,
                image: review.itemImageUrl,
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.reviewScore,
              },
              reviewBody: review.text,
              author: {
                "@type": "Person",
                name: review.userName,
              },
            }),
          }}
        />
      ))}
    </>
  );
};

export default CarSearchReviewsStructuredData;
