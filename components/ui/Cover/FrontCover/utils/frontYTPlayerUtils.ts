/* eslint-disable functional/immutable-data */
import useDynamicScript from "@travelshift/ui/hooks/useDynamicScript";
import { useEffect } from "react";

let YTPlayerInstance: {
  destroy: () => void;
  pauseVideo(): any;
  playVideo(): any;
} | null;

const showCoverImageInsteadVideo = (playerWrapperId: string, imageId: string) => {
  const playerWrapper = document.getElementById(playerWrapperId);
  const imageWrapper = document.getElementById(imageId);

  // eslint-disable-next-line functional/immutable-data
  if (playerWrapper) playerWrapper.style.display = "none";
  if (imageWrapper) {
    // eslint-disable-next-line functional/immutable-data
    imageWrapper.style.visibility = "visible";
  }
};

const onPlayerReady = (playerWrapperId: string, imageId: string) => (e: { target: any }) => {
  e.target.setPlaybackQuality?.("hd720");
  e.target.mute?.();
  e.target.playVideo?.();
  if (e.target.playerInfo?.duration === 0) {
    showCoverImageInsteadVideo(playerWrapperId, imageId);
  }
};

const onPlayerStateChange =
  (playerWrapperId: string, imageId: string, onVideoPlaybackStarted?: () => void) =>
  (e: { data: number }) => {
    if (e.data === 0) {
      showCoverImageInsteadVideo(playerWrapperId, imageId);
    }
    const { YT } = window;
    if (e.data === YT.PlayerState.PLAYING) {
      // @ts-ignore
      e.target?.setPlaybackQuality?.("hd720");
      onVideoPlaybackStarted?.();
    }
  };

const onPlayerError = (playerWrapperId: string, imageId: string) => () => {
  showCoverImageInsteadVideo(playerWrapperId, imageId);
};

const getPlayerWrapperId = (videoId: string) => `playerWrapper-${videoId}`;

const handlePageVisibilityChange = () => {
  if (document.hidden) {
    YTPlayerInstance?.pauseVideo?.();
  } else {
    YTPlayerInstance?.playVideo?.();
  }
};

const registerIframePlayer = (
  videoId: string,
  imageId: string,
  onVideoPlaybackStarted?: () => void
) => {
  const playerWrapperId = getPlayerWrapperId(videoId);
  const { YT } = window;
  if (!YT) return;

  function createYTInstance() {
    try {
      YTPlayerInstance = new YT.Player(playerWrapperId, {
        videoId,
        events: {
          onReady: onPlayerReady(playerWrapperId, imageId),
          onStateChange: onPlayerStateChange(playerWrapperId, imageId, onVideoPlaybackStarted),
          onError: onPlayerError(playerWrapperId, imageId),
        },
      });

      document.addEventListener("visibilitychange", handlePageVisibilityChange);

      return YTPlayerInstance;
    } catch (e) {
      return null;
    }
  }

  if (!createYTInstance()) {
    // retrying to create YT instance
    setTimeout(createYTInstance, 500);
  }
};

export const registerYTGlobalHooks = ({
  videoId,
  imageId,
  isStartLoading,
  onVideoPlaybackStarted,
}: {
  videoId: string;
  imageId: string;
  isStartLoading: boolean;
  onVideoPlaybackStarted?: () => void;
}) => {
  if (YTPlayerInstance || !isStartLoading) return;

  window.onYouTubeIframeAPIReady = () =>
    registerIframePlayer(videoId, imageId, onVideoPlaybackStarted);
};

const destroyIframePlayer = () => {
  YTPlayerInstance?.destroy();
  YTPlayerInstance = null;
  document.removeEventListener("visibilitychange", handlePageVisibilityChange);
  delete window.onYouTubeIframeAPIReady;
};

export const useIframePlayer = (videoId: string, imageId: string, isStartLoading: boolean) => {
  const playerWrapperId = getPlayerWrapperId(videoId);

  useDynamicScript({
    scriptID: videoId,
    src: "https://www.youtube.com/iframe_api",
    isStartLoading,
  });
  useEffect(() => {
    if (!YTPlayerInstance && isStartLoading) {
      registerIframePlayer(videoId, imageId);
    }
    return destroyIframePlayer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStartLoading]);

  return playerWrapperId;
};
