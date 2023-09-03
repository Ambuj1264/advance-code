import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

type ContainerProps = {
  height?: number;
};

const IframeContainer = styled.div<ContainerProps>(
  ({ height }) =>
    css`
      position: relative;
      display: block;
      margin: 0 auto;
      height: ${height || 0}px;
      padding-bottom: ${height ? 0 : 56.25}%;
      overflow: hidden;
    `
);

const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Player = ({ videoUrl, height }: { videoUrl: string; height?: number }) => (
  <IframeContainer height={height}>
    <Iframe
      className="lazyload"
      height="310"
      title="Tour video"
      data-src={videoUrl}
      allowFullScreen
    />
  </IframeContainer>
);

export default Player;
