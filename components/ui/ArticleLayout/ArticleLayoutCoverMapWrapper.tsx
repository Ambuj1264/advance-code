import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { containerPaddingsBackward, mqMax, mediaQuery } from "styles/base";
import { gutters } from "styles/variables";

const ArticleLayoutCoverMapWrapper = styled.div([
  mediaQuery({
    marginTop: [`${gutters.small / 4}px`, `${gutters.small / 2}px`],
  }),
  css`
    ${mqMax.large} {
      overflow: hidden;
      ${containerPaddingsBackward}
    }
  `,
]);

export default ArticleLayoutCoverMapWrapper;
