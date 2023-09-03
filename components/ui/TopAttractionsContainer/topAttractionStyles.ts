import { css } from "@emotion/core";

import { column, mqMin } from "styles/base";
import { gutters } from "styles/variables";

export default [
  column({ small: 1 / 2, medium: 1 / 2, large: 1 / 4 }),
  css`
    margin-top: ${gutters.small}px;
    &:nth-child(-n + 2) {
      margin-top: 0;
    }
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
      &:nth-child(-n + 4) {
        margin-top: 0;
      }
    }
  `,
];
