import React, { ReactElement } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { PaginationContainer, PaginationContent } from "./PaginatedContentShared";

import { skeletonPulse } from "styles/base";

const PagesLinePulse = styled.div([
  skeletonPulse,
  css`
    display: block;
    margin: 0 auto;
    width: 250px;
    height: 48px;

    &:after {
      content: ".";
      visibility: hidden;
    }
  `,
]);

const PaginatedContentSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactElement;
}) => {
  return (
    <div className={className}>
      <PaginationContent>{children}</PaginationContent>
      <PaginationContainer>
        <PagesLinePulse />
      </PaginationContainer>
    </div>
  );
};

export default PaginatedContentSkeleton;
