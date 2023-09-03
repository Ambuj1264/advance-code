import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { column, mqMin, skeletonPulse, skeletonPulseBlue } from "styles/base";
import { gutters } from "styles/variables";
import Row from "components/ui/Grid/Row";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const LoadingCardContainer = styled.div([
  column({ small: 1, medium: 1 / 2 }),
  css`
    display: flex;
    margin-top: ${gutters.small}px;
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
    }
  `,
]);

const LoadingHeaderContainer = styled.div`
  display: flex;
  ${mqMin.large} {
    justify-content: center;
  }
`;

const LoadingHeader = styled.div([
  skeletonPulse,
  css`
    width: 300px;
    height: 24px;
  `,
]);

const LoadingCard = styled.div([
  skeletonPulseBlue,
  css`
    height: 250px;
  `,
]);

const ItineraryMoreInformationLoading = () => (
  <LoadingContainer>
    <LoadingHeaderContainer>
      <LoadingHeader />
    </LoadingHeaderContainer>
    <Row>
      <LoadingCardContainer>
        <LoadingCard />
      </LoadingCardContainer>
      <LoadingCardContainer>
        <LoadingCard />
      </LoadingCardContainer>
    </Row>
  </LoadingContainer>
);

export default ItineraryMoreInformationLoading;
