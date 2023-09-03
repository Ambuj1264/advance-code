import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { GridColumn } from "components/ui/TopTravelAdviceContainer/TopTravelAdviceShared";
import { DefaultMarginTop } from "styles/base";

export const StyledGridColumn = styled(GridColumn)([
  DefaultMarginTop,
  css`
    max-width: 100%;
  `,
]);
