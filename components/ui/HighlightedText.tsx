import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { gutters } from "styles/variables";
import { typographySubtitle3 } from "styles/typography";
import { singleLineTruncation } from "styles/base";

const HighlightedText = styled.div(({ theme }) => [
  typographySubtitle3,
  singleLineTruncation,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    border-radius: 20px;
    height: 20px;
    padding: ${gutters.small / 2}px;
    background-color: ${rgba(theme.colors.primary, 0.05)};
    color: ${theme.colors.primary};
    line-height: 15px;
    text-transform: unset;
  `,
]);

export default HighlightedText;
