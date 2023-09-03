import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulse, mqMax } from "styles/base";
import { gutters } from "styles/variables";

export const HeaderWrapper = styled.div`
  margin: 0 -${gutters.large}px;
`;

const LoadingHeader = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small}px;
    width: 100%;
    height: 24px;
    ${mqMax.large} {
      margin-top: 0;
      height: 40px;
    }
  `,
]);

export default LoadingHeader;
