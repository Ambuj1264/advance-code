import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulse, mqMin } from "styles/base";
import { borderRadiusSmall } from "styles/variables";

export default styled.div([
  skeletonPulse,
  css`
    display: block;
    border-radius: ${borderRadiusSmall};
    height: 138px;
    ${mqMin.large} {
      height: 150px;
    }
  `,
]);
