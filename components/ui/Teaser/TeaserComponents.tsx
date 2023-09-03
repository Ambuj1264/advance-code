import styled from "@emotion/styled";
import { css } from "@emotion/core";
import isPropValid from "@emotion/is-prop-valid";

import Link from "components/ui/Link";
import { mediaQuery, clampLinesWithFixedHeight } from "styles/base";
import {
  borderRadius,
  borderRadiusSmall,
  boxShadowLight,
  fontSizeCaption,
  greyColor,
  gutters,
} from "styles/variables";
import { typographySubtitle1, typographySubtitle2 } from "styles/typography";

const linkStyle = [
  css`
    justify-content: center;
    color: inherit;
    text-decoration: none;
    &:hover {
      color: inherit;
    }
  `,
  mediaQuery({
    display: ["flex", "block"],
  }),
];
export const InternalLink = styled(Link)(linkStyle);

export const ExternalLink = styled.a<{ href: string }>(linkStyle);

export const imageStyles = css`
  border-radius: ${borderRadiusSmall};
  height: 100%;
`;

export const Card = styled.div<{
  responsiveHeight?: string[];
  hasShadow?: boolean;
  hasInnerBottomShadow?: boolean;
  hasInnerTopShadow?: boolean;
}>(({ responsiveHeight, hasShadow, hasInnerBottomShadow, hasInnerTopShadow }) => [
  mediaQuery({
    height: responsiveHeight,
  }),
  css`
    position: relative;
    display: flex;
    border-radius: ${borderRadiusSmall};
    overflow: hidden;
  `,
  hasShadow &&
    css`
      box-shadow: ${boxShadowLight};
    `,
  hasInnerBottomShadow &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: block;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0) 45.44%);
      }
    `,
  hasInnerTopShadow &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: block;
        background: linear-gradient(360deg, rgba(0, 0, 0, 0) 59.02%, rgba(0, 0, 0, 0.5) 100%);
      }
    `,
]);

export const CardImage = styled("div", {
  shouldForwardProp: prop => isPropValid(prop) && prop !== "width",
})<{
  minWidth?: string[];
  maxWidth?: string;
}>(({ minWidth, maxWidth = "100%" }) => [
  mediaQuery({
    minWidth,
  }),
  css`
    max-width: ${maxWidth};
    height: 100%;
  `,
]);

export const CardContent = styled.div([
  css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin-left: ${gutters.small}px;
    overflow: hidden;
  `,
]);

export const CardTitle = styled.h3<{ isSmall?: boolean; noWrap?: boolean }>(
  ({ isSmall, noWrap, theme }) => [
    isSmall ? typographySubtitle2 : typographySubtitle1,
    clampLinesWithFixedHeight({
      numberOfLines: 2,
      lineHeight: isSmall ? 20 : 24,
    }),
    noWrap &&
      css`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `,
    css`
      color: ${theme.colors.primary};
    `,
  ]
);

export const Description = styled.div([
  css`
    margin-top: ${gutters.small / 2}px;
    color: ${greyColor};
    font-size: ${fontSizeCaption};
    line-height: 18px;
  `,
]);

export const IMAGE_TEASER_HEIGHT = 168;

export const TeaserImageCard = styled(Card)`
  border-radius: ${borderRadius};
  width: 100%;
`;

export const teaserImageStyles = css`
  border-radius: ${borderRadius};
  height: 100%;
  object-fit: cover;
`;
