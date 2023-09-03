import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { mqMin } from "styles/base";
import { gutters, blackColor } from "styles/variables";
import { typographySubtitle1, typographyBody2 } from "styles/typography";

const SectionHeader = styled.div(({ theme }) => [
  typographySubtitle1,
  css`
    margin-top: ${gutters.large}px;
    color: ${theme.colors.primary};
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
      color: ${rgba(blackColor, 0.7)};
      ${typographyBody2};
    }
  `,
]);

export default SectionHeader;
