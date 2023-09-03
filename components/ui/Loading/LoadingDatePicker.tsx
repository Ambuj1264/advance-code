import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { mqMin, skeletonPulse } from "styles/base";
import { gutters } from "styles/variables";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 272px;
`;

const Header = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    margin-bottom: ${gutters.small / 2}px;
    width: 150px;
    height: 18px;
  `,
]);

const Calendar = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 2}px;
    width: 100%;
    height: 240px;
  `,
]);

const LoadingDatePicker = () => (
  <Wrapper>
    <Header />
    <Calendar />
  </Wrapper>
);

const LoadingWrapperDatePickerMulti = styled.div`
  ${mqMin.large} {
    display: flex;
    > div + div {
      margin-left: ${gutters.large}px;
    }
  }
`;

export const LoadingDatePickerMulti = () => (
  <LoadingWrapperDatePickerMulti>
    <LoadingDatePicker />
    <LoadingDatePicker />
  </LoadingWrapperDatePickerMulti>
);

export default LoadingDatePicker;
