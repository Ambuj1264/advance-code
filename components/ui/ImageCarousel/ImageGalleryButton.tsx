import React from "react";
import styled from "@emotion/styled";

import CoverButton from "../Cover/CoverButton";

import { whiteColor, gutters } from "styles/variables";
import GalleryIcon from "components/icons/gallery.svg";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const Gallery = styled(GalleryIcon)`
  width: 12px;
  min-width: 12px;
  height: auto;
  fill: ${whiteColor};
`;

const ButtonText = styled.span`
  margin-left: ${gutters.small / 2}px;
`;

const ImageGalleryButton = ({
  id,
  onClick,
  responsiveThumbnails,
}: {
  id: string;
  onClick?: () => void;
  responsiveThumbnails?: SharedTypes.ResponsiveThumbnails;
}) => (
  <CoverButton
    id={`${id}openGallery`}
    onClick={() => onClick && onClick()}
    isButton={onClick !== undefined}
    responsiveThumbnails={responsiveThumbnails}
  >
    <Gallery />
    <ButtonText>
      <Trans ns={Namespaces.commonNs}>Open Gallery</Trans>
    </ButtonText>
  </CoverButton>
);

export default ImageGalleryButton;
