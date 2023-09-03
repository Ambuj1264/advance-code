import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

import ImageGalleryMobile from "./ImageGalleryMobile/ImageGalleryMobile";
import ImageGalleryNew from "./ImageGalleryNew";

import { breakpointsMax } from "styles/variables";

type Props = {
  onClose: () => void;
  photoIndex: number;
  images: Image[];
};

const ImageGalleryWrapper = ({ images, photoIndex, onClose }: Props) => {
  const [statePhotoIndex, setPhotoIndex] = useState(photoIndex);
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });

  if (isMobile) {
    return (
      <ImageGalleryMobile
        images={images}
        onClose={onClose}
        currentPhotoIndex={statePhotoIndex ?? 0}
      />
    );
  }
  return (
    <ImageGalleryNew
      images={images}
      onClose={onClose}
      setPhotoIndex={setPhotoIndex}
      currentPhotoIndex={statePhotoIndex ?? 0}
    />
  );
};

export default ImageGalleryWrapper;
