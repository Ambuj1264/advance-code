import { css, SerializedStyles } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import facepaint from "facepaint";

import {
  gutters,
  containerMaxWidth,
  breakpointsMin,
  breakpointsMax,
  lightGreyColor,
  redColor,
  fontWeightBold,
  loadingBlue,
  skeletonBlueGradient,
  skeletonGreyGradient,
  borderRadiusBig,
  webKitScrollBarHeight,
  greyColor,
} from "./variables";
import { resetAnchor, resetButton } from "./reset";

import { Direction } from "types/enums";
import TopBorder from "components/ui/Section/TopBorder";

export const mqMin = {
  medium: `@media (min-width: ${breakpointsMin.medium}px)`,
  large: `@media (min-width: ${breakpointsMin.large}px)`,
  desktop: `@media (min-width: ${breakpointsMin.desktop}px)`,
  max: `@media (min-width: ${breakpointsMin.max}px)`,
};

export const mqMax = {
  medium: `@media (max-width: ${breakpointsMax.medium}px)`,
  large: `@media (max-width: ${breakpointsMax.large}px)`,
  desktop: `@media (max-width: ${breakpointsMax.desktop}px)`,
};

export const mqPrint = "@media print";

export const mqIE = `@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)`;

export const mediaQuery = facepaint([mqMin.medium, mqMin.large, mqMin.desktop, mqPrint]);

export const mqDesktopOnly = "@media (hover: hover)";

export const container = css`
  flex-grow: 1;
  margin: 0 auto;
  max-width: ${containerMaxWidth};
  padding-right: ${gutters.small}px;
  padding-left: ${gutters.small}px;

  ${TopBorder} {
    margin-right: -${gutters.small}px;
    margin-left: -${gutters.small}px;
  }

  ${mqMin.large} {
    padding-right: ${gutters.large}px;
    padding-left: ${gutters.large}px;

    ${TopBorder} {
      margin-right: -${gutters.large}px;
      margin-left: -${gutters.large}px;
    }
  }
`;

// use to compensate container paddings
// use case: component with full page width on mobile
export const containerPaddingsBackward = css`
  margin-right: -${gutters.small}px;
  margin-left: -${gutters.small}px;
  ${mqMin.large} {
    margin-right: -${gutters.large}px;
    margin-left: -${gutters.large}px;
  }
`;

export const row = css`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-wrap: wrap;

  align-items: stretch;
  justify-content: flex-start;

  margin-right: -${gutters.small / 2}px;
  margin-left: -${gutters.small / 2}px;

  ${mqIE} {
    flex: 0 0 100%;
  }
  ${mqMin.large} {
    margin-right: -${gutters.large / 2}px;
    margin-left: -${gutters.large / 2}px;
  }
`;

export const columnPaddings = css`
  padding: 0 ${gutters.small / 2}px;
  ${mqMin.large} {
    padding: 0 ${gutters.large / 2}px;
  }
`;

export const column = (sizes: SharedTypes.ColumnSizes, skipPaddings = false) => [
  !skipPaddings && columnPaddings,
  mediaQuery({
    width: [
      `${sizes.small * 100}%`,
      sizes.medium && `${sizes.medium * 100}%`,
      sizes.large && `${sizes.large * 100}%`,
      sizes.desktop && `${sizes.desktop * 100}%`,
      sizes.print && `${sizes.print * 100}%`,
    ],
  }),
];

export const cover = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const anchor = css(
  css(resetAnchor, resetButton),
  css`
    position: relative;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      opacity: 0;
      transition: 200ms opacity ease-in-out;
    }
    &:focus,
    &:hover,
    &:active {
      &::after {
        opacity: 1;
      }
    }
  `
);

export const hideScrollbar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const singleLineTruncation = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const capitalizeFirstLetter = css`
  &::first-letter {
    text-transform: uppercase;
  }
`;

export const skeletonPulse = css`
  @keyframes pulse {
    0% {
      transform: translate3d(-100%, 0, 0);
    }
    100% {
      transform: translate3d(100%, 0, 0);
    }
  }
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  background: ${lightGreyColor};
  overflow: hidden;

  &:before {
    content: "";
    width: 200%;
    background: ${skeletonGreyGradient};
    animation: pulse 1.2s ease-in-out infinite;
    ${cover};
  }
`;

export const skeletonPulseBlue = () => [
  skeletonPulse,
  css`
    background: ${loadingBlue};

    &:before {
      background: ${skeletonBlueGradient};
    }
  `,
];

export const errorAsterisk = css`
  &:after {
    content: " *";
    color: ${redColor};
    font-weight: ${fontWeightBold};
  }
`;

export const directionMixin = ({
  leftStyles,
  rightStyles,
  direction,
}: {
  leftStyles: SerializedStyles;
  rightStyles: SerializedStyles;
  direction: Direction;
}) => (direction === Direction.Left ? leftStyles : rightStyles);

export const clampLines = (numberOfLines?: number) => css`
  display: -webkit-box;
  visibility: visible;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${numberOfLines || "unset"};
  ${mqIE} {
    overflow: visible;
  }
`;

export const resetClampLines = css`
  display: unset;
  overflow: unset;
  -webkit-box-orient: unset;
  -webkit-line-clamp: unset;
`;

export const DefaultMarginTop = css`
  margin-top: ${gutters.small}px;

  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

export const DefaultMarginBottom = css`
  margin-bottom: ${gutters.small}px;

  ${mqMin.large} {
    margin-bottom: ${gutters.large}px;
  }
`;

export const clampLinesWithFixedHeight = ({
  numberOfLines,
  lineHeight,
  fixedHeight = false,
}: {
  numberOfLines: number;
  lineHeight: number;
  fixedHeight?: boolean;
}) => {
  const heightLimit = `calc(
    ${lineHeight}px * ${numberOfLines}
  )`;
  return [
    css`
      ${clampLines(numberOfLines)}
      max-height: ${heightLimit};
      ${mqIE} {
        display: block;
        overflow-y: auto;
      }
    `,
    fixedHeight &&
      css`
        height: ${heightLimit};
      `,
  ];
};

export const responsiveTypography = ({
  small,
  medium,
  large,
  desktop,
}: {
  small: SerializedStyles;
  medium?: SerializedStyles;
  large?: SerializedStyles;
  desktop?: SerializedStyles;
}) => [
  small,
  medium &&
    css`
      ${mqMin.medium} {
        ${medium};
      }
    `,
  large &&
    css`
      ${mqMin.large} {
        ${large};
      }
    `,
  desktop &&
    css`
      ${mqMin.desktop} {
        ${desktop};
      }
    `,
];

export const hideDuringPrint = css`
  ${mqPrint} {
    display: none;
  }
`;

export const combineMediaQueries = (firstMediaQuery: string, ...mediaQueries: string[]) =>
  [firstMediaQuery, ...mediaQueries.map(query => query.replace("@media ", ""))].join(", ");

export const fixIOSInputZoom = css`
  @supports (-webkit-touch-callout: none) {
    ${mqMax.large} {
      input {
        z-index: 0;
        width: 115%;
        padding-top: 9px;
        padding-left: ${gutters.small * 3 + 4.57}px;
        font-size: 18px;
        transform: scale(0.8888);
        transform-origin: top left;
      }
    }
  }
`;

export const styledWebkitScrollbar = css`
  &::-webkit-scrollbar {
    width: ${webKitScrollBarHeight}px;
    height: ${webKitScrollBarHeight}px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: ${borderRadiusBig};
    background: ${rgba(greyColor, 0.2)};
  }
`;
