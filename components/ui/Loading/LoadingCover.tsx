import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulseBlue, mqMin } from "styles/base";
import { guttersPx } from "styles/variables";
import { DEFAULT_HEIGHT, TABLET_HEIGHT, DESKTOP_HEIGHT } from "components/ui/Cover/Cover";

const LoadingCoverWrapper = styled.div`
  margin: 0 -${guttersPx.small};

  ${mqMin.large} {
    margin: 0;
  }
`;
// min-height variable: Default height + some paddings for mobile
const LoadingCoverContent = styled.div([
  skeletonPulseBlue,
  css`
    display: block;
    min-height: ${DEFAULT_HEIGHT + 20}px;

    ${mqMin.large} {
      min-height: ${TABLET_HEIGHT}px;
    }

    ${mqMin.desktop} {
      min-height: ${DESKTOP_HEIGHT}px;
    }
  `,
]);

const LoadingCover = ({ className }: { className?: string }) => {
  return (
    <LoadingCoverWrapper>
      <LoadingCoverContent className={className} />
    </LoadingCoverWrapper>
  );
};

export default LoadingCover;
