import React from "react";
import styled, { StyledComponent } from "@emotion/styled";

import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  Description,
  imageStyles,
} from "../TeaserComponents";

import LazyImage from "components/ui/Lazy/LazyImage";

// those values are being used by mediaQuery
// so we can provide sizes for different responsive breakpoints
const DEFAULT_IMAGE_WIDTH = 102;
const IMAGE_WIDTH_LIST = [`${DEFAULT_IMAGE_WIDTH}px`];
const IMAGE_HEIGHT_LIST = ["86px"];

const StyledCard = styled(Card)`
  align-items: flex-start;
`;

const StyledDescriptions = styled(Description)`
  height: 56px;
  overflow: hidden;
`;

const TeaserSideCard = ({
  url,
  title,
  image,
  description,
  LinkComponent,
}: TeaserTypes.Teaser & {
  LinkComponent: StyledComponent<{ href: string }, { href: string }, Theme>;
}) => {
  return (
    <LinkComponent href={url}>
      <StyledCard responsiveHeight={IMAGE_HEIGHT_LIST}>
        {image && (
          <CardImage
            minWidth={IMAGE_WIDTH_LIST}
            maxWidth={`${DEFAULT_IMAGE_WIDTH}px`}
            title={title}
          >
            <LazyImage
              src={image.url}
              styles={imageStyles}
              alt={image.name}
              width={DEFAULT_IMAGE_WIDTH * 2}
            />
          </CardImage>
        )}

        <CardContent>
          <CardTitle isSmall>
            <span title={title}>{title}</span>
          </CardTitle>
          <StyledDescriptions>{description}</StyledDescriptions>
        </CardContent>
      </StyledCard>
    </LinkComponent>
  );
};

export default TeaserSideCard;
