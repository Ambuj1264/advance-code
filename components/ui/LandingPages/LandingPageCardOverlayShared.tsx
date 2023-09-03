import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographyCaption } from "styles/typography";
import { singleLineTruncation } from "styles/base";
import { borderRadiusTiny, gutters, whiteColor } from "styles/variables";

export const CountryTitle = styled.div([
  typographyCaption,
  singleLineTruncation,
  css`
    padding: 0 ${gutters.small / 4}px;
    color: ${whiteColor};
    &::first-letter {
      text-transform: capitalize;
    }
  `,
]);

export const Country = styled("div")<{
  displayOnRightSide: boolean;
  displayOnBottom: boolean;
}>(
  ({ displayOnRightSide, displayOnBottom }) =>
    css`
      position: absolute;
      top: ${displayOnBottom ? "auto" : `${gutters.small / 2}px`};
      right: ${displayOnRightSide ? `${gutters.small / 2}px` : "auto"};
      left: ${displayOnRightSide ? "auto" : `${gutters.small / 2}px`};
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${borderRadiusTiny};
      height: 16px;
      &::first-letter {
        text-transform: uppercase;
      }
    `
);
