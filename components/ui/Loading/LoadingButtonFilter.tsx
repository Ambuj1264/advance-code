import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulse } from "styles/base";
import { gutters } from "styles/variables";

export default styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 80%;
    height: ${gutters.large * 3}px;
  `,
]);
