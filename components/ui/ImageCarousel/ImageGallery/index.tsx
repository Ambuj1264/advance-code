import React from "react";
import { Option, isSome, toUndefined } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

import CustomNextDynamic from "lib/CustomNextDynamic";

const ImageGalleryWrapper = CustomNextDynamic<any>(() => import("./ImageGalleryWrapper"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  images: Image[];
  onClose: () => void;
  photoIndex: Option<number>;
  isScrollToPhotoIndex?: boolean;
};

const ImageGallery = ({ photoIndex, ...props }: Props) =>
  isSome(photoIndex) ? (
    <ImageGalleryWrapper {...props} photoIndex={pipe(photoIndex, toUndefined)} />
  ) : null;

export default ImageGallery;
