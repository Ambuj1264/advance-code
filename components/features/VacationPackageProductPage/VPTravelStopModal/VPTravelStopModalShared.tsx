import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { mqMax, mqMin, skeletonPulseBlue } from "styles/base";
import { borderRadius, gutters } from "styles/variables";
import Row from "components/ui/Grid/Row";

export const ContentWrapper = styled.div`
  width: 100%;
  height: auto;
  min-height: 100%;
  padding: 0 ${gutters.small}px ${gutters.large}px;

  ${mqMin.large} {
    padding: ${gutters.large}px 0;
  }
`;
export const StyledRow = styled(Row)`
  justify-content: space-between;
  margin: 0 0 ${gutters.large}px;
`;
export const ImageWrapper = styled.div`
  border-radius: ${borderRadius};
  width: calc(100% + ${gutters.small * 2}px);
  height: 270px;
  overflow: hidden;

  img {
    min-height: unset;
  }

  ${mqMin.large} {
    margin: 0 ${gutters.large / 2}px;
    width: 100%;
    height: 350px;

    img {
      min-height: 350px;
    }
  }
`;
export const ImagePulseSkeleton = styled.div([
  skeletonPulseBlue,
  css`
    width: 100%;
    height: 100%;
  `,
]);
export const Holster = styled.div`
  ${mqMax.large} {
    margin: 0 ${gutters.small}px;
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: scroll;
    scroll-snap-align: center;
  }
`;
