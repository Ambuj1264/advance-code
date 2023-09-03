import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { borderRadiusSmall, gutters } from "styles/variables";
import { mqMin } from "styles/base";

const Box = styled.div<{ fullWidth: boolean }>(
  ({ fullWidth }) =>
    css`
      /* stylelint-disable declaration-bang-space-before*/
      margin-top: -${gutters.small / 2}px;
      margin-left: 0;
      border: 0;
      border-radius: 0;
      width: 100%;
      padding: 0 0 0 ${gutters.small}px;
      ${mqMin.large} {
        float: ${!fullWidth && "right"};
        margin-top: 0;
        border-radius: ${borderRadiusSmall};
        width: ${fullWidth ? "100%" : `50%`};
        padding: ${fullWidth
          ? 0
          : `0 0 ${gutters.large / 2}px
          ${gutters.large / 2}px`};
      }
    `
);

export default Box;
