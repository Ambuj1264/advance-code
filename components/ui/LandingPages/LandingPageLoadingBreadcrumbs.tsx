import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import BreadcrumbsWrapper from "../Breadcrumbs/BreadcrumbsWrapper";

import { skeletonPulse, mqMin } from "styles/base";
import { ArrowContainer, StyledArrow } from "components/ui/Breadcrumbs/Breadcrumbs";
import { gutters } from "styles/variables";

const LoadingBreadcrumbsWrapper = styled(BreadcrumbsWrapper)`
  ${ArrowContainer} {
    display: flex;
    align-items: center;
  }
`;

const LoadingBreadcrumb = styled.div<{ crumbWidth: number }>(({ crumbWidth }) => [
  skeletonPulse,
  css`
    display: flex;
    width: ${crumbWidth}px;
    height: ${gutters.small}px;

    ${mqMin.large} {
      height: 14px;
    }
  `,
]);

const LoadingBreadcrumbs = () => (
  <LoadingBreadcrumbsWrapper>
    <LoadingBreadcrumb crumbWidth={81} />
    <ArrowContainer>
      <StyledArrow />
    </ArrowContainer>
    <LoadingBreadcrumb crumbWidth={108} />
    <ArrowContainer>
      <StyledArrow />
    </ArrowContainer>
    <LoadingBreadcrumb crumbWidth={137} />
  </LoadingBreadcrumbsWrapper>
);

export default LoadingBreadcrumbs;
