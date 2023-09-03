import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { gutters } from "styles/variables";

export const ProductCardFooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-grow: 1;
    margin: 0 -${gutters.large / 2}px -${gutters.large / 2}px -${gutters.large / 2}px;
    height: 46px;
    padding: 0 ${gutters.large / 2}px;
    background-color: ${rgba(theme.colors.action, 0.05)};
  `
);
