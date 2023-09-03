import React from "react";
import { Option, none } from "fp-ts/lib/Option";
import styled from "@emotion/styled";

import ImageGallery from "components/ui/ImageCarousel/ImageGallery";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;

const ContentGallery = ({
  imageUrls,
  showGalleryImage,
  galleryImageIndexToShow,
}: {
  imageUrls: Image[];
  showGalleryImage: (imageIndex: Option<number>) => void;
  galleryImageIndexToShow: Option<number>;
}) => {
  if (!imageUrls.length) {
    return null;
  }

  return (
    <Wrapper suppressHydrationWarning>
      <ImageGallery
        images={imageUrls}
        onClose={() => showGalleryImage(none)}
        photoIndex={galleryImageIndexToShow}
        isScrollToPhotoIndex
      />
    </Wrapper>
  );
};
export default ContentGallery;
