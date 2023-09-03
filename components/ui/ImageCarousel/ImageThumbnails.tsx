import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ImageThumbnail from "./ImageThumbnail";

import { gutters } from "styles/variables";
import { CoverVariant } from "types/enums";
import { mqMin } from "styles/base";

const ImageThumbnailList = styled.ul<{ variant?: CoverVariant }>(
  ({ variant }) => css`
    position: absolute;
    bottom: ${variant === CoverVariant.HERO ? gutters.large : gutters.small}px;
    display: flex;
    justify-content: center;
    margin: 0;
    width: 100%;
    padding-right: ${gutters.small}px;
    text-align: right;
    list-style: none;
  `
);

const ImageThumbnailListItem = styled.li<{
  responsiveThumbnails?: SharedTypes.ResponsiveThumbnails;
}>(({ responsiveThumbnails }) => [
  responsiveThumbnails
    ? css`
        display: none;
        ${mqMin.medium} {
          display: none;
          &:nth-of-type(-n + ${responsiveThumbnails.medium}) {
            display: flex;
          }
        }
        ${mqMin.large} {
          display: none;
          &:nth-of-type(-n + ${responsiveThumbnails.large}) {
            display: flex;
          }
        }
        ${mqMin.desktop} {
          display: none;
          &:nth-of-type(-n + ${responsiveThumbnails.desktop}) {
            display: flex;
          }
        }
      `
    : css`
        display: flex;
      `,
  css`
    align-items: center;
    justify-content: center;
  `,
]);

const ImageThumbnails = ({
  imageUrls,
  onClick,
  variant,
  responsiveThumbnails,
}: {
  imageUrls: Image[];
  onClick: (thumbnailIndex: number) => void;
  variant?: CoverVariant;
  responsiveThumbnails?: SharedTypes.ResponsiveThumbnails;
}) => (
  <ImageThumbnailList variant={variant} id="imageThumbnailList">
    {imageUrls.map((image, index) => {
      return (
        <ImageThumbnailListItem responsiveThumbnails={responsiveThumbnails} key={image.id}>
          <ImageThumbnail
            imageUrl={image}
            onClick={onClick}
            isActive={false}
            index={index}
            width={79}
            height={64}
          />
        </ImageThumbnailListItem>
      );
    })}
  </ImageThumbnailList>
);

export default ImageThumbnails;
