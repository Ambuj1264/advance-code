import React, { memo } from "react";
import styled from "@emotion/styled";

import ReviewSummary from "../ReviewSummary/ReviewSummary";
import MapButton from "../Map/MapButton";

import ImageGalleryCarousel from "./ImageGalleryCarousel";

import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import { useTranslation } from "i18n";
import CoverMapWrapper from "components/ui/Cover/CoverMap/CoverMapWrapper";
import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import { mqMin } from "styles/base";
import { gutters, borderRadius } from "styles/variables";
import useToggle from "hooks/useToggle";

const MapWrapper = styled.div`
  ${CoverMapWrapper} {
    position: relative;
    margin: 0 ${gutters.small}px;
    border-radius: ${borderRadius};
    height: 210px;
    overflow: hidden;
    ${mqMin.large} {
      margin: 0;
      height: 359px;
    }
  }
  ${mqMin.large} {
    margin-top: 0;
  }
`;

const ProductCover = ({
  images = [],
  reviewScore,
  reviewCount,
  mapData,
  crop,
  showReviews,
  shouldShowModalGallery = true,
  isLikelyToSellOut = false,
  useAlternateStaticImageOnly,
  className,
  id,
}: {
  images?: ImageWithSizes[];
  id?: string | number;
  reviewScore: number;
  reviewCount: number;
  mapData?: SharedTypes.Map;
  crop?: string;
  showReviews: boolean;
  shouldShowModalGallery?: boolean;
  isLikelyToSellOut?: boolean;
  useAlternateStaticImageOnly?: boolean;
  className?: string;
}) => {
  const [showMap, toggleMap] = useToggle(false);
  const { t } = useTranslation();
  if (showMap && mapData) {
    return (
      <MapWrapper>
        <CoverMap
          mapId={`product-cover-map-${id}`}
          map={mapData}
          rightBottomContent={<MapButton title={t("Map")} onClick={toggleMap} isReversed />}
          isDirectionsEnabled={false}
          isStreetViewEnabled={false}
          useAlternateStaticImageOnly={useAlternateStaticImageOnly}
        />
      </MapWrapper>
    );
  }
  return (
    <ImageGalleryCarousel
      className={className}
      shouldShowModalGallery={shouldShowModalGallery}
      images={images}
      leftTopContent={
        Boolean(reviewCount) && (
          <ReviewSummary
            reviewTotalScore={reviewScore}
            reviewTotalCount={reviewCount}
            isLink={showReviews}
          />
        )
      }
      leftBottomContent={isLikelyToSellOut && <SellOutLabel isStatic />}
      rightBottomContent={mapData ? <MapButton title={t("Map")} onClick={toggleMap} /> : undefined}
      crop={crop}
    />
  );
};

export default memo(ProductCover);
