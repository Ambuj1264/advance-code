import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { StyledCardTitle } from "components/ui/Teaser/variants/TeaserSideCardHorizontal";
import { column, mqMin, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import ScrollSnapWrapper from "components/ui/ScrollSnapWrapper";

export const Column = styled.div([
  column({ small: 1, medium: 1 / 2, large: 1 / 3, desktop: 1 / 5 }),
  css`
    ${mqMin.medium} {
      margin-top: ${gutters.small}px;
    }
    ${mqMax.medium} {
      &:last-of-type {
        padding-right: ${gutters.small}px;
      }
    }

    ${StyledCardTitle} {
      height: 24px;
      text-align: center;
    }
  `,
]);

export const StyledScrollSnapWrapper = styled(ScrollSnapWrapper)`
  ${mqMin.medium} {
    flex-wrap: wrap;
    margin-top: -${gutters.small}px;
    padding-bottom: 0;
    overflow-x: unset;
  }
`;
