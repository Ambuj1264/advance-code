import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters } from "styles/variables";

const TopBorder = styled.div<{
  includeTopBorder: boolean;
  isFirstSection: boolean;
  isSmallSpacing?: boolean;
  mqMin: any;
}>(({ theme, includeTopBorder, isFirstSection, isSmallSpacing, mqMin }) => [
  includeTopBorder &&
    css`
      border-top: 8px solid ${rgba(theme.colors.primary, 0.05)};
      padding-top: ${isFirstSection ? "0px" : `${gutters.large}px`};
    `,
  css`
    margin-top: ${isSmallSpacing ? gutters.small / 2 : gutters.small}px;
    max-width: 100vw;

    ${mqMin.large} {
      margin: ${gutters.large}px 0 0 0;
      border: none;
    }
  `,
]);

export default TopBorder;
