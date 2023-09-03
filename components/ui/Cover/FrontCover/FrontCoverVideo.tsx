import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useIframePlayer, registerYTGlobalHooks } from "./utils/frontYTPlayerUtils";

import { mqMin } from "styles/base";
import { borderRadius } from "styles/variables";
import useEffectOnce from "hooks/useEffectOnce";

const IframeWrapper = styled.div<{ isReady: boolean }>(({ isReady = true }) => [
  css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    border-radius: ${borderRadius};
    opacity: 0;
    overflow: hidden;
    transition: opacity 1s ease-out;
  `,
  isReady &&
    css`
      opacity: 1;
    `,
]);

const IframePlaceholder = styled.iframe`
  display: none;
  pointer-events: none;
  ${mqMin.large} {
    display: block;
    width: 100%;
    height: 810px;
    transform: translateY(-25%);
  }
`;
const imageId = "coverCarouselfrontCover";

const FrontCoverVideo = ({
  videoId = "",
  videoStartingTime,
  videoEndTime,
  delayedVideoPlayback = false,
}: {
  videoId?: string;
  videoStartingTime?: number;
  videoEndTime?: number;
  delayedVideoPlayback?: boolean;
}) => {
  const [canInitializePlayback, setCanInitializePlayback] = useState(false);
  const [playbackStarted, setPlaybackStarted] = useState(!delayedVideoPlayback);

  const forcePlaybackInMs = delayedVideoPlayback ? 1000 : 0;

  const onVideoPlaybackStarted = useCallback(() => {
    setPlaybackStarted(true);
  }, []);

  const playVideoOnMouseEnter = useCallback(() => {
    if (delayedVideoPlayback) {
      setCanInitializePlayback(true);
    }
  }, [delayedVideoPlayback]);

  useEffectOnce(() => {
    let handle: number;
    const timer = setTimeout(() => {
      if (window.requestIdleCallback) {
        handle = window.requestIdleCallback(() => setCanInitializePlayback(true));
      }
      setCanInitializePlayback(true);
    }, forcePlaybackInMs);

    return () => {
      clearTimeout(timer);
      window.cancelIdleCallback?.(handle);
    };
  });

  const playerWrapperId = useIframePlayer(videoId, imageId, canInitializePlayback);

  useEffect(() => {
    if (videoId)
      registerYTGlobalHooks({
        videoId,
        imageId,
        isStartLoading: canInitializePlayback,
        onVideoPlaybackStarted,
      });
  });

  if (!videoId) {
    return null;
  }

  return (
    <IframeWrapper onMouseEnter={playVideoOnMouseEnter} isReady={playbackStarted}>
      {canInitializePlayback && (
        <IframePlaceholder
          id={playerWrapperId}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&autohide=1&wmode=transparent&modestbranding=1&showinfo=0&rel=0&enablejsapi=1&allowfullscreen=false&iv_load_policy=3&html5=1&loop=1&mute=1${
            videoStartingTime ? `&start=${videoStartingTime}` : ""
          }${videoEndTime ? `&end=${videoEndTime}` : ""}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </IframeWrapper>
  );
};

export default FrontCoverVideo;
