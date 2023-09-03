import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import { MaxWidthWrapper } from "../MaxWidthWrapper";
import { StyledContainer } from "../PBSharedComponents";
import { StyledIconWrapper } from "../PBTimelineItem";

import { ModalHeader, ModalLoading } from "./PBReservationsLoading";

import { mqMin, skeletonPulse } from "styles/base";
import { borderRadius, borderRadiusCircle, gutters } from "styles/variables";
import { HeadingSkeleton } from "components/features/User/UserLoadingSkeleton";

const GenericWrapper = styled.div`
  position: relative;
  margin-top: ${gutters.small * 2}px;
`;

const Titlewrapper = styled.div`
  display: none;
  ${mqMin.large} {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${gutters.small / 2}px;
    height: 72px;
  }
`;

const TextWrapper = styled.div(
  ({ theme }) => css`
    border-left: 1px solid ${theme.colors.primary};
    padding: 0 0 0 ${gutters.small}px;
    ${mqMin.large} {
      padding: ${gutters.small}px 0 0 ${gutters.large + gutters.large / 2}px;
    }
  `
);

const StyledHeadingSkeleton = styled(HeadingSkeleton)`
  margin: 0 0 0 ${gutters.small}px;
  ${mqMin.large} {
    margin: 0 0 0 ${gutters.large + gutters.large / 2}px;
  }
`;

const StyledIconLoading = styled.div([
  skeletonPulse,
  css`
    border-radius: ${borderRadiusCircle};
    width: 16px;
    height: 16px;
    ${mqMin.large} {
      width: 24px;
      height: 24px;
    }
  `,
]);

const PageTitleSkeleton = styled.div([
  skeletonPulse,
  css`
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    width: 500px;
    height: 32px;
  `,
]);

const MobileTopNavLoading = styled.div([
  skeletonPulse,
  css`
    display: block;
    margin-top: -6px;
    height: 48px;
    ${mqMin.large} {
      display: none;
    }
  `,
]);

export const MapLoadingSkeleton = styled.div([
  skeletonPulse,
  css`
    display: none;
    ${mqMin.large} {
      display: block;
      margin-bottom: ${gutters.small * 2}px;
      border-radius: ${borderRadius};
      height: 358px;
    }
  `,
]);

const TextLoadingSkeleton = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small}px;
    height: 119px;
  `,
]);

const PBItineraryLoading = () => {
  return (
    <ModalLoading>
      <ModalHeader />
      <MobileTopNavLoading />
      <StyledContainer>
        <MaxWidthWrapper>
          <Titlewrapper>
            <PageTitleSkeleton />
          </Titlewrapper>
          <MapLoadingSkeleton />
          {[...Array(3)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`itinerary-loading${i}`}>
              <GenericWrapper>
                <StyledHeadingSkeleton width={300} />
                <StyledIconWrapper>
                  <StyledIconLoading />
                </StyledIconWrapper>
              </GenericWrapper>
              <TextWrapper>
                <TextLoadingSkeleton />
              </TextWrapper>
            </React.Fragment>
          ))}
        </MaxWidthWrapper>
      </StyledContainer>
    </ModalLoading>
  );
};

export default PBItineraryLoading;
