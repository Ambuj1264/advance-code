import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { ValuePropsWrapper } from "./FrontValuePropositionsShared";

import { skeletonPulse, mqMin } from "styles/base";
import { guttersPx } from "styles/variables";

const StyledValuePropsWrapper = styled(ValuePropsWrapper)`
  margin: ${guttersPx.smallHalf} -${guttersPx.small} 0 -${guttersPx.small};
  height: 48px;

  ${mqMin.large} {
    height: 32px;
  }
`;

const ProductPropositionsPulse = styled.div([
  skeletonPulse,
  css`
    ${mqMin.large} {
      border-radius: 6px;
    }
  `,
]);

const FrontValuePropositionsSkeleton = () => {
  return (
    <StyledValuePropsWrapper>
      <ProductPropositionsPulse />
    </StyledValuePropsWrapper>
  );
};

export default FrontValuePropositionsSkeleton;
