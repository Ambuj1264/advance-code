import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { typographyBody1 } from "styles/typography";
import { greyColor } from "styles/variables";

const SectionParagraph = styled.p(
  css(
    typographyBody1,
    css`
      color: ${greyColor};
      text-align: justify;
      white-space: pre-wrap;
    `
  )
);

export default SectionParagraph;
