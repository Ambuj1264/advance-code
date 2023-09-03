import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { redCinnabarColor, borderRadiusSmall, whiteColor } from "styles/variables";

export const OverlayIconContainer = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadiusSmall} 0px;
  width: 32px;
  height: 32px;
  background-color: ${redCinnabarColor};
`;

export const overlayIconStyles = css`
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;
