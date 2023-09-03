import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { skeletonPulse } from "styles/base";
import { gutters } from "styles/variables";

const LoadingButtonFilter = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 80%;
    height: ${gutters.large}px;
  `,
]);

const LoadingCheckboxFilter = () => (
  <>
    <LoadingButtonFilter />
    <LoadingButtonFilter />
    <LoadingButtonFilter />
    <LoadingButtonFilter />
  </>
);

export default LoadingCheckboxFilter;
