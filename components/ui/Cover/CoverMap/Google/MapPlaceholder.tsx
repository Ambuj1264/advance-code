import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { skeletonPulse } from "styles/base";

const MapPlaceholder = styled.div([
  skeletonPulse,
  css`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 100%;
  `,
]);

export default MapPlaceholder;
