import React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { css } from "@emotion/core";
import isPropValid from "@emotion/is-prop-valid";

import TeaserTitle from "../TeaserTitle";

import { TeaserImageCard, teaserImageStyles } from "components/ui/Teaser/TeaserComponents";
import { gutters, whiteColor, fontWeightBold } from "styles/variables";
import { typographyBody1, typographyH4, typographySubtitle1 } from "styles/typography";
import ImageComponent from "components/ui/ImageComponent";
import LandingPageCardOverlayCity from "components/ui/LandingPages/LandingPageCardOverlayCity";

export const TitleHolder = styled.div<{ hasSubtitle: boolean }>(({ hasSubtitle }) => [
  css`
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    margin: 0 ${gutters.small / 2}px;
    color: ${whiteColor};
    text-align: center;
  `,
  hasSubtitle
    ? css`
        padding: ${gutters.small / 2}px ${gutters.small}px;
      `
    : css`
        padding: ${gutters.small}px 0 ${gutters.small / 2}px 0;
      `,
]);

export const TEASER_HEGHT = 200;

export const Title = styled(TeaserTitle)<{ smallTitle: boolean }>(
  ({ smallTitle }) => [
    smallTitle
      ? [
          typographySubtitle1,
          css`
            font-weight: ${fontWeightBold};
            line-height: 20px;
          `,
        ]
      : [
          typographyH4,
          css`
            font-size: 18px;
            line-height: 28px;
          `,
        ],
  ],
  css`
    &::first-letter {
      text-transform: capitalize;
    }
  `
);

const Subtitle = styled.div(typographyBody1);

const StyledTeaserImageCard = styled(TeaserImageCard, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "height",
})<{
  height: number;
}>(
  ({ height }) => css`
    height: ${height}px;
  `
);

const TeaserImageTitleOnly = ({
  url,
  image,
  LinkComponent,
  title,
  city,
  subtitle,
  height = TEASER_HEGHT,
  smallTitle = false,
  overlay,
  className,
  imgixParams,
  width,
  shouldUseLazyImage,
  tagType = "h3",
}: TeaserTypes.Teaser & {
  LinkComponent?: StyledComponent<{ href: string }, { href: string }, Theme>;
  height?: number;
  city?: string;
  smallTitle?: boolean;
  overlay?: React.ReactNode;
  className?: string;
  imgixParams?: SharedTypes.ImgixParams;
  width?: number;
  shouldUseLazyImage?: boolean;
  tagType?: React.ElementType;
}) => {
  if (!image) {
    return null;
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const WrapperComponent = ({ children }: { children: React.ReactElement }) =>
    LinkComponent ? <LinkComponent href={url}>{children}</LinkComponent> : children;

  return (
    <WrapperComponent>
      <StyledTeaserImageCard height={height} hasShadow hasInnerBottomShadow className={className}>
        {city && <LandingPageCardOverlayCity city={city} />}
        {overlay}
        <ImageComponent
          imageUrl={image?.url}
          height={height}
          width={width}
          imgixParams={{
            fit: "crop",
            crop: "focalpoint",
            "fp-z": 1.14,
            ...imgixParams,
          }}
          imageAlt={image?.name}
          imageStyles={teaserImageStyles}
          lazy={shouldUseLazyImage}
        />
        <TitleHolder hasSubtitle={!!subtitle}>
          <Title as={tagType} smallTitle={smallTitle}>
            {title}
          </Title>
          {subtitle && !smallTitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleHolder>
      </StyledTeaserImageCard>
    </WrapperComponent>
  );
};

export default TeaserImageTitleOnly;
