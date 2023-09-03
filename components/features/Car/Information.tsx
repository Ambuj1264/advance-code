import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographyBody1 } from "styles/typography";
import { greyColor } from "styles/variables";

const Content = styled.div([
  typographyBody1,
  css`
    color: ${greyColor};
  `,
]);

export default ({ content }: { content: string }) => {
  return <Content>{content}</Content>;
};
