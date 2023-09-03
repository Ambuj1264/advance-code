import React, { useCallback, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useRouter } from "next/router";
import { head } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined } from "fp-ts/lib/Option";
import { parseUrl } from "use-query-params";

import Modal, { ModalHeader, CloseButton, ModalContentWrapper } from "components/ui/Modal/Modal";
import LazyImage from "components/ui/Lazy/LazyImage";
import { breakpointsMin, gutters } from "styles/variables";
import { asPathWithoutQueryParams } from "utils/routerUtils";

const IMAGE_GALLERY_MODAL_ID = "imageGalleryMobileModal";

const ImageWrapper = styled.div<{ proportion?: number }>(({ proportion }) => [
  proportion &&
    css`
      position: relative;
      padding-bottom: ${proportion * 100}%;
      overflow: hidden;

      > img {
        position: absolute;
        top: 0;
        left: 0;
      }
    `,
  css`
    margin-top: ${gutters.small}px;
    &:last-of-type {
      margin-bottom: ${gutters.small}px;
    }
  `,
]);

const ImageGalleryMobile = ({
  images,
  onClose,
  currentPhotoIndex,
  isScrollToPhotoIndex = true,
}: {
  images: ImageWithSizes[];
  onClose: () => void;
  currentPhotoIndex: number;
  isScrollToPhotoIndex?: boolean;
}) => {
  const router = useRouter();
  // we can't rely on router.query as upon modal close, the re-render happens and by some reason,
  // the router.query is {} although the queryParams are available in the asPath
  const asPath = pipe(head(router.asPath.split("#")), toUndefined);
  const queryParams = parseUrl(asPath ?? "").query;
  const imageThumbnailRefs = useRef(images.map(() => React.createRef<HTMLDivElement>()));

  const handleClose = useCallback(() => {
    router.push(
      router.pathname,
      {
        pathname: asPathWithoutQueryParams(asPath ?? ""),
        query: queryParams,
      },
      {
        shallow: true,
      }
    );

    onClose();
  }, [asPath, onClose, queryParams, router]);

  useEffect(() => {
    router.push(
      router.pathname,
      {
        pathname: asPathWithoutQueryParams(asPath ?? ""),
        query: queryParams,
        hash: "#imageGalleryOpen=true",
      },
      { shallow: true }
    );

    window.addEventListener("popstate", onClose);

    return () => {
      window.removeEventListener("popstate", onClose);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isScrollToPhotoIndex) {
      const { current: currentThumbnail } = imageThumbnailRefs.current[currentPhotoIndex];
      if (currentThumbnail) {
        setTimeout(() => {
          currentThumbnail.scrollIntoView({
            block: "start",
          });
        }, 300);
      }
    }
  }, [currentPhotoIndex, images, isScrollToPhotoIndex]);

  return (
    <Modal id={IMAGE_GALLERY_MODAL_ID} onClose={handleClose}>
      <ModalHeader rightButton={<CloseButton onClick={handleClose} />} />
      <ModalContentWrapper>
        {images.map((image, index) => {
          const { width, height } = image;
          const hasImageDimensions = height && width && height > 0 && width > 0;
          const imageProportion = hasImageDimensions ? height! / width! : undefined;

          return (
            <ImageWrapper
              key={image.id}
              proportion={imageProportion}
              ref={imageThumbnailRefs.current[index]}
            >
              <LazyImage
                role="presentation"
                src={image.url}
                sizes={`(min-width: ${breakpointsMin.max}px) ${breakpointsMin.max / 6}px, 100vw`}
                alt={image.name}
                width={image.width}
                height={image.height}
              />
            </ImageWrapper>
          );
        })}
      </ModalContentWrapper>
    </Modal>
  );
};

export default ImageGalleryMobile;
