import React from "react";
import styled from "@emotion/styled";

import { mqMin, skeletonPulse } from "styles/base";
import { borderRadiusSmall, ghostWhiteColor, gutters, separatorColor } from "styles/variables";

const LoadingHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -${gutters.small}px;
  margin-left: -${gutters.small}px;
  height: 32px;
  background-color: ${ghostWhiteColor};
  ${mqMin.large} {
    margin-right: -${gutters.large}px;
    margin-left: -${gutters.large}px;
  }
`;

const LoadingHeader = styled.div`
  ${skeletonPulse};
  display: block;
  width: 50%;
  height: 24px;
`;

const LoadingImage = styled.div`
  ${skeletonPulse};
  margin-right: ${gutters.large}px;
  border-radius: ${borderRadiusSmall};
  width: 72px;
  height: 56px;
`;

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: ${gutters.small / 2}px;
  height: 106px;
  padding: ${gutters.small}px ${gutters.large}px;
  &:not(:last-child):after {
    content: "";
    position: absolute;
    bottom: -${gutters.small / 2}px;
    left: 0;
    width: 100%;
    height: ${gutters.small / 2}px;
    background-color: ${separatorColor};
  }
`;

const LoadingTitle = styled.div`
  ${skeletonPulse};
  display: block;
  width: 50%;
  height: ${gutters.large / 2}px;
`;

const LoadingDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
`;

const VPStaysEditModalRoomLoading = () => {
  return (
    <StyledWrapper>
      <LoadingImage />
      <LoadingDetailsWrapper>
        <LoadingTitle />
        <LoadingTitle />
        <LoadingTitle />
      </LoadingDetailsWrapper>
    </StyledWrapper>
  );
};

const VPStaysEditModalLoading = () => {
  return (
    <>
      <LoadingHeaderWrapper>
        <LoadingHeader />
      </LoadingHeaderWrapper>
      <VPStaysEditModalRoomLoading />
      <VPStaysEditModalRoomLoading />
      <VPStaysEditModalRoomLoading />
      <VPStaysEditModalRoomLoading />
    </>
  );
};

export default VPStaysEditModalLoading;
