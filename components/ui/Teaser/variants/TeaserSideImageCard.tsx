import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { borderRadiusSmall, greyColor, gutters } from "styles/variables";
import ImageComponent from "components/ui/ImageComponent";
import { PlaceholderImageWrapper } from "components/ui/Image/ImagePlaceholder";

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 67px;
`;

export const CardImageWrapper = styled.div`
  position: relative;
  width: 94px;
  height: 67px;
  img,
  ${PlaceholderImageWrapper} {
    border-radius: ${borderRadiusSmall};
  }
`;

const CardContent = styled.div`
  margin-left: ${gutters.large}px;
  width: calc(100% - 94px);
`;

export const Title = styled.h3(
  ({ theme }) =>
    css`
      color: ${theme.colors.primary};
    `
);

export const Description = styled.div`
  color: ${rgba(greyColor, 0.7)};
`;

const TeaserSideImageCard = ({
  title,
  subtitle,
  imageUrl,
  overlay,
  imageAlt,
  className,
  imageHeight = 67,
  imageWidth = 94,
  shouldUseLazyImage,
}: {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  overlay?: React.ReactNode;
  className?: string;
  imageHeight?: number;
  imageWidth?: number;
  shouldUseLazyImage?: boolean;
}) => {
  return (
    <CardWrapper className={className}>
      <CardImageWrapper>
        {overlay}
        <ImageComponent
          imageUrl={imageUrl}
          height={imageHeight}
          width={imageWidth}
          imageAlt={imageAlt}
          imageStyles={css`
            max-height: 100%;
          `}
          lazy={shouldUseLazyImage}
        />
      </CardImageWrapper>
      <CardContent>
        <Title
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {subtitle && <Description>{subtitle}</Description>}
      </CardContent>
    </CardWrapper>
  );
};

export default TeaserSideImageCard;
