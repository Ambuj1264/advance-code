import React from "react";

import ImageGalleryCarousel from "components/ui/ImageCarousel/ImageGalleryCarousel";
import ReviewSummary from "components/ui/ReviewSummary/ReviewSummary";
import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import { useSettings } from "contexts/SettingsContext";

const AccommodationCover = ({
  cover,
  url,
  reviewTotalCount,
  reviewTotalScore,
  showReviews,
}: {
  cover: AccommodationTypes.Cover;
  url: string;
  reviewTotalCount: number;
  reviewTotalScore: number;
  showReviews: boolean;
}) => {
  const { absoluteUrl } = useSettings();
  const accomodationUrl = url.startsWith("/") ? `${absoluteUrl}${url}` : url;

  return (
    <ImageGalleryCarousel
      images={cover.images}
      leftTopContent={
        reviewTotalCount !== 0 && (
          <ReviewSummary
            reviewTotalScore={reviewTotalScore}
            reviewTotalCount={reviewTotalCount}
            isLink={showReviews}
          />
        )
      }
      leftBottomContent={<SellOutLabel isStatic />}
      affiliateURl={accomodationUrl}
      crop="center"
    />
  );
};

export default AccommodationCover;
