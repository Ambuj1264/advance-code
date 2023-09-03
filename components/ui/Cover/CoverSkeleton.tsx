import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulseBlue, mqMin } from "styles/base";

const CoverWrapper = styled.div<{
  coverHeight: number;
}>(
  ({ coverHeight }) => css`
    min-height: ${coverHeight}px;

    ${mqMin.large} {
      overflow: hidden;
    }
  `
);

export const CoverPulse = styled.div(skeletonPulseBlue);

const CoverSkeleton = ({ className, coverHeight }: { className?: string; coverHeight: number }) => {
  return (
    <CoverWrapper className={className} coverHeight={coverHeight}>
      <CoverPulse className={className} />
    </CoverWrapper>
  );
};

export default CoverSkeleton;
