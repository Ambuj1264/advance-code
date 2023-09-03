import React from "react";

import {
  constructAggregateRating,
  constructStructuredReviews,
  constructAggregateOffer,
} from "./utils/SEOUtils";

import { formatImagesForSEOmeta } from "utils/imageUtils";

type Props = {
  name: string;
  description: string;
  images: Image[];
  reviewTotalScore?: number;
  reviewTotalCount?: number;
  reviews?: QueryReview[];
  path: string;
  establishmentName: string;
  localeCurrency: string;
  localePrice: number;
};

const ProductStructuredData = ({
  name,
  description,
  images,
  reviewTotalCount,
  reviewTotalScore,
  reviews,
  path,
  establishmentName,
  localePrice,
  localeCurrency,
}: Props) => {
  const aggregateRating =
    reviewTotalCount && reviewTotalScore && reviewTotalCount > 0
      ? {
          aggregateRating: constructAggregateRating(reviewTotalScore, reviewTotalCount),
        }
      : {};
  const structuredReviews = reviews
    ? {
        review: constructStructuredReviews(reviews),
      }
    : {};

  const metaImages = formatImagesForSEOmeta(images);

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name,
          description,
          brand: establishmentName,
          image: metaImages.map(image => image.url),
          offers: constructAggregateOffer({
            lowPrice: localePrice,
            priceCurrency: localeCurrency,
            url: path,
          }),

          ...aggregateRating,
          ...structuredReviews,
        }),
      }}
    />
  );
};

export default ProductStructuredData;
