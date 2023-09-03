import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { gutters, boxShadow, borderRadiusSmall } from "styles/variables";
import { skeletonPulse, column, mqMin, skeletonPulseBlue } from "styles/base";
import { useIsDesktop } from "hooks/useMediaQueryCustom";

const CarRentalWrapper = styled.div([
  column({ small: 1 / 2, medium: 1 / 3, large: 1 / 3 }),
  css`
    margin-bottom: ${gutters.small}px;
    ${mqMin.large} {
      margin-bottom: ${gutters.large}px;
    }
  `,
]);

const CarRentalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: ${boxShadow};
  border-radius: ${borderRadiusSmall};
  height: 204px;
  padding: ${gutters.small / 2}px;
`;

const ReviewSummaryPulseContainer = styled.div`
  display: flex;
  align-items: center;
  height: 33px;
`;

const ScorePulse = styled.div([
  skeletonPulse,
  css`
    width: 45.5px;
  `,
]);

const SummaryLinePulse = styled.div([
  skeletonPulse,
  css`
    height: 14px;
  `,
]);

const SummaryCountPulseContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gutters.small / 2}px;
  width: 133px;

  > ${SummaryLinePulse} + ${SummaryLinePulse} {
    margin-top: 5px;
  }
`;

const LogoPulse = styled.div([
  skeletonPulseBlue,
  css`
    display: flex;
    margin-top: ${gutters.large}px;
    height: 80px;
  `,
]);

const SeeMorePulse = styled.div([
  skeletonPulse,
  css`
    display: flex;
    align-self: flex-end;
    margin-top: ${gutters.large}px;
    width: 91.5px;
    height: 20px;
  `,
]);

const CarRentalSkeleton = () => {
  const isDesktop = useIsDesktop();
  return (
    <CarRentalWrapper>
      <CarRentalContainer>
        <ReviewSummaryPulseContainer>
          <ScorePulse />
          <SummaryCountPulseContainer>
            {isDesktop ? (
              <>
                <SummaryLinePulse />
                <SummaryLinePulse />
              </>
            ) : (
              <SummaryLinePulse />
            )}
          </SummaryCountPulseContainer>
        </ReviewSummaryPulseContainer>
        <LogoPulse />
        <SeeMorePulse />
      </CarRentalContainer>
    </CarRentalWrapper>
  );
};

export default CarRentalSkeleton;
