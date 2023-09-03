import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { column, mqMin, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import { StyledCard } from "components/ui/Teaser/variants/TeaserSideCardHorizontal";
import ScrollSnapWrapper from "components/ui/ScrollSnapWrapper";

const BaseColumn = styled.div([
  column({ small: 1, medium: 1, large: 1 / 2, desktop: 1 / 4 }),
  css`
    ${mqMin.large} {
      margin-top: ${gutters.small}px;
      padding: 0 ${gutters.small / 2}px;
    }

    ${StyledCard} {
      height: 100%;
    }
  `,
]);

export const GridColumn = styled(BaseColumn)([
  column({ small: 1, medium: 1, large: 1 / 2, desktop: 1 / 4 }),
]);

export const OneLineColumn = styled(BaseColumn)([
  column({ small: 1, medium: 1, large: 1 / 3, desktop: 1 / 6 }),
  css`
    ${mqMax.large} {
      &:last-of-type {
        padding-right: ${gutters.small}px;
      }
    }
  `,
]);

export const StyledScrollSnapWrapper = styled(ScrollSnapWrapper)`
  ${mqMin.large} {
    flex-wrap: wrap;
    margin-top: -${gutters.small}px;
    padding-bottom: 0;
    overflow-x: unset;
  }
`;
