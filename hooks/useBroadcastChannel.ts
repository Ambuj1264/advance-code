import { useCallback, useEffect, useRef } from "react";

import lazyCaptureException from "lib/lazyCaptureException";
import { emptyFunction, isBrowser } from "utils/helperUtils";

const useBroadcastChannel = ({
  channelName,
  handleMessage,
  isDisabled,
}: {
  channelName: string;
  handleMessage?: (event: MessageEvent) => void;
  isDisabled?: boolean;
}) => {
  const broadcastChannelRef = useRef<BroadcastChannel | null>(
    isBrowser && "BroadcastChannel" in window && !isDisabled
      ? new BroadcastChannel(channelName)
      : null
  );

  const handleMessageError = useCallback(
    (errorEvent: MessageEvent) => {
      lazyCaptureException(new Error(`Error using useBroadcastChannel - messageerror`), {
        errorInfo: {
          channelName,
          ...(errorEvent.data?.actionName ? { actionName: errorEvent.data.actionName } : {}),
          messageErrorEvent: errorEvent,
        },
      });
    },
    [channelName]
  );

  useEffect(() => {
    const { current } = broadcastChannelRef;
    if (current && handleMessage) {
      current.addEventListener("message", handleMessage);
      current.addEventListener("messageerror", handleMessageError);

      return () => {
        current.removeEventListener("message", handleMessage);
        current.removeEventListener("messageerror", handleMessageError);
      };
    }
    return emptyFunction;
  }, [broadcastChannelRef, handleMessage, handleMessageError]);

  return {
    postMessageHandler: useCallback(
      (data: SharedTypes.BroadcastChannelMessageData) => {
        broadcastChannelRef?.current?.postMessage(data);
      },
      [broadcastChannelRef]
    ),
    closeBroadcastChannel: useCallback(() => {
      broadcastChannelRef?.current?.close();
    }, []),
  };
};

export default useBroadcastChannel;
