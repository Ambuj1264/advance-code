import React, { useCallback, useState } from "react";
import { none, Option, some } from "fp-ts/lib/Option";

import { getImgixImageId } from "utils/imageUtils";

const useShowImageGalleryByClickingOnInContentImage = (
  images: Image[]
): [
  Option<number>,
  (imageIndex: Option<number>) => void,
  (event: React.SyntheticEvent) => void
] => {
  const [galleryIndexToShow, setGalleryImageIndexToShow] = useState<Option<number>>(none);

  const showGalleryForImageByIndex = useCallback(
    (imageElement: HTMLImageElement) => {
      const source = imageElement.getAttribute("data-src") || imageElement.src;
      const imageElementId = getImgixImageId(source);
      const galleryImageIndex = images.findIndex(galleryImage => {
        return galleryImage.id === imageElementId;
      });

      if (galleryImageIndex === -1) {
        return;
      }

      setGalleryImageIndexToShow(some(galleryImageIndex));
    },
    [images]
  );

  const handleContentImageClick = useCallback(
    (event: React.SyntheticEvent) => {
      const target = event.target as HTMLElement;
      const isImageTag = target instanceof HTMLImageElement;

      if (!isImageTag) {
        return;
      }

      showGalleryForImageByIndex(target as HTMLImageElement);
    },
    [showGalleryForImageByIndex]
  );

  return [galleryIndexToShow, setGalleryImageIndexToShow, handleContentImageClick];
};

export default useShowImageGalleryByClickingOnInContentImage;
