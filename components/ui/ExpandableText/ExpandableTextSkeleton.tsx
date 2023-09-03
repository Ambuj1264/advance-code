import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { skeletonPulse } from "styles/base";

export const ExpandableTextRowSkeleton = styled.div([
  skeletonPulse,
  css`
    height: 22px;
  `,
]);

const ExpandableTextSkeleton = ({ lineLimit = 3 }: { lineLimit?: number }) => (
  <>
    {range(1, lineLimit).map((_, index) => (
      <ExpandableTextRowSkeleton key={`expandableTextRowSkeleton-${index.toString()}`} />
    ))}
  </>
);

export default ExpandableTextSkeleton;
