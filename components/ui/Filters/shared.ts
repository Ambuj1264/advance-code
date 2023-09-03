import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";

export const FilterContainer = styled.div<{
  includeBottomBorder?: boolean;
}>(({ includeBottomBorder = true, theme }) => [
  includeBottomBorder
    ? css`
        &::after {
          content: "";
          display: flex;
          margin: ${gutters.small}px -${gutters.small}px;
          width: calc(100% + 32px);
          height: 2px;
          background-color: ${rgba(theme.colors.primary, 0.3)};
        }

        ${mqMin.large} {
          &::after {
            margin: ${gutters.large}px 0;
            width: 100%;
          }
        }
      `
    : css`
        margin-top: ${gutters.small}px;
      `,
  css`
    width: 100%;
  `,
]);
