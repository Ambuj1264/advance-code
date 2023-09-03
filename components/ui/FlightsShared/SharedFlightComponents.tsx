import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { gutters, greyColor } from "styles/variables";

export const TimelineConnection = styled.div`
  position: absolute;
  top: 15px;
  left: 5px;
  width: 1px;
  height: 21px;
  background: rgb(232, 237, 241);
`;

export const Separator = styled.div`
  margin-left: -${gutters.small}px;
  width: 100vw;
  height: 2px;
  background-color: ${rgba(greyColor, 0.05)};
`;

export const Line = styled.div<{
  isDetailedView?: boolean;
  isDotted?: boolean;
}>(
  ({ theme, isDetailedView, isDotted }) => css`
    margin-left: 5px;
    border-left: 1px ${isDotted ? "dashed" : "solid"} ${rgba(theme.colors.primary, 0.3)};
    height: ${isDetailedView ? 18 : 12}px;
  `
);
