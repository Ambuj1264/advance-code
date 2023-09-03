import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { borderRadius, boxShadowTileRegular, greyColor, gutters } from "styles/variables";
import { column, mqMin } from "styles/base";

export const Column = styled.div([
  css`
    margin-top: ${gutters.small}px;
    ${mqMin.large} {
      margin-top: 0;
      &:nth-of-type(n + 3) {
        margin-top: ${gutters.large}px;
      }
    }
  `,
  column({ small: 1, large: 1 / 2 }),
]);

export const ProductCardContainer = styled.div<{
  hasTitle?: boolean;
  themeBorderColor?: boolean;
}>(({ hasTitle = true, themeBorderColor = false, theme }) => [
  css`
    position: relative;
    box-shadow: ${boxShadowTileRegular};
    border: 1px solid ${themeBorderColor ? theme.colors.primary : rgba(greyColor, 0.2)};
    border-radius: ${borderRadius};
    width: 100%;
    padding: ${gutters.large / 2}px;
    padding-top: ${hasTitle ? 32 : 0}px;
    overflow: hidden;

    ${mqMin.large} {
      padding-top: ${gutters.large}px;
    }
  `,
]);
