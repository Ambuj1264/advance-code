import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { typographyBody1, typographyBody2 } from "styles/typography";
import { gutters, greyColor } from "styles/variables";
import { mqMin } from "styles/base";

const SectionSubHeading = styled.p<{ onClick?: () => void }>(({ onClick }) => [
  typographyBody2,
  css`
    margin-top: ${gutters.small / 2}px;
    color: ${greyColor};
    line-height: 20px;
    text-align: center;

    ${mqMin.large} {
      ${typographyBody1};
      line-height: 24px;
    }

    ${!!onClick && "cursor: pointer;"}
  `,
]);

export default SectionSubHeading;
