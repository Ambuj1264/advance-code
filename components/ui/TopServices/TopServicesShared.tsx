import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ScrollSnapWrapper from "components/ui/ScrollSnapWrapper";
import { column, mqMin, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import { TitleHolder } from "components/ui/Teaser/variants/TeaserImageTitleOnly";

export const topServiceStyles = [
  column({ small: 1 / 2, large: 1 / 4, desktop: 1 / 8 }),
  css`
    ${mqMax.large} {
      &:last-of-type {
        padding-right: ${gutters.small}px;
      }
    }
    ${mqMin.medium} {
      min-width: 280px;
    }
    ${mqMin.large} {
      &:nth-of-type(-n + 4) {
        margin-bottom: ${gutters.small}px;
      }
    }
    ${mqMin.desktop} {
      &:nth-of-type(-n + 4) {
        margin-bottom: 0;
      }
    }
    ${TitleHolder} {
      padding-right: ${gutters.small / 3}px;
      padding-left: ${gutters.small / 3}px;
    }
  `,
];

export const StyledScrollSnapWrapper = styled(ScrollSnapWrapper)`
  ${mqMin.large} {
    flex-wrap: wrap;
  }
`;
