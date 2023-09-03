import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulse } from "styles/base";
import { gutters } from "styles/variables";

const DropdownHeader = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.large}px;
    width: 50px;
    height: 16px;
  `,
]);

const Dropdown = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 100%;
    height: 45px;
  `,
]);

const LoadingDropdown = ({
  withHeader = true,
  className,
}: {
  withHeader?: boolean;
  className?: string;
}) => (
  <>
    {withHeader && <DropdownHeader className={className} />} <Dropdown className={className} />
  </>
);

export default LoadingDropdown;
