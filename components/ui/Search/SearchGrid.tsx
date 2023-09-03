import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { container, column, mqIE } from "styles/base";
import { headerHeight } from "styles/variables";

const Container = styled.div([
  container,
  css`
    ${mqIE} {
      margin-top: ${headerHeight};
    }
  `,
]);

export const LeftContent = styled.div([column({ small: 1, large: 2.5 / 8, desktop: 1 / 4 })]);

export const RightContent = styled.div(column({ small: 1, large: 5.5 / 8, desktop: 3 / 4 }));

export default Container;
