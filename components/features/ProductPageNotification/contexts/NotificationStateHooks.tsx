import { useCallback } from "react";

import { pushNotificationQueue, shiftNotificationQueue } from "../NotificationUtils";

import { ProductNotificationType, useNotificationStateContext } from "./NotificationStateContext";

export const useAddNotification = () => {
  const { setAllContextState } = useNotificationStateContext();
  return useCallback(
    (newNotification: ProductNotificationType) => {
      setAllContextState(prevState => ({
        ...prevState,
        notifications: pushNotificationQueue(prevState.notifications, newNotification),
      }));
    },
    [setAllContextState]
  );
};

export const useCloseNotification = () => {
  const { notifications, currentNotification, setContextState } = useNotificationStateContext();
  return useCallback(() => {
    if (currentNotification !== undefined) {
      setContextState({
        notifications: shiftNotificationQueue(notifications),
        currentNotification: undefined,
        timeOutRunning: false,
      });
    }
  }, [currentNotification, notifications, setContextState]);
};
