import React, { useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { CSSTransition } from "react-transition-group";
import CloseIcon from "@travelshift/ui/icons/close.svg";

import { getIconByType, shiftNotificationQueue } from "./NotificationUtils";
import { useNotificationStateContext } from "./contexts/NotificationStateContext";
import { useCloseNotification } from "./contexts/NotificationStateHooks";

import {
  bittersweetRedColor,
  borderRadiusLarger,
  gutters,
  whiteColor,
  zIndex,
} from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { CloseButtonWrapper } from "components/features/Header/Header/NavigationBar/Cart/CartComponents";
import { Product } from "types/enums";
import { mqMax, mqMin } from "styles/base";

const DURATION = 200;

const TRANSITION_NAME = "global-notification-transition";

const BLOCK_HEIGHT = 50;

const StyledCloseIcon = styled(CloseIcon)`
  max-width: 10px;
  max-height: 10px;
  fill: ${whiteColor};
`;

const RibbonContainer = styled.div<{
  notificationColor?: Color;
}>(({ notificationColor, theme }) => [
  css`
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${zIndex.max + 1};
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-right-radius: ${borderRadiusLarger};
    height: 0;
    padding: 0;
    background-color: ${notificationColor ? theme.colors[notificationColor] : bittersweetRedColor};
    opacity: 0;
    transition: opacity ${DURATION}ms ease-in-out, height ${DURATION}ms ease-in-out,
      padding ${DURATION}ms ease-in-out;
    will-change: height, opacity, background-color;

    ${mqMin.large} {
      z-index: ${zIndex.max};
    }
    ${mqMax.large} {
      bottom: 65px;
      border-radius: 0;
      min-width: 100%;
    }

    &.${TRANSITION_NAME}-exit {
      height: auto;
      padding: 2px;
      opacity: 0.1;
    }
    &.${TRANSITION_NAME}-exit-done {
      height: 0;
      min-height: 0;
      padding: 0;
      opacity: 0;
    }
    &.${TRANSITION_NAME}-enter {
      height: 0;
      padding: 0;
      opacity: 0.1;
    }
    &.${TRANSITION_NAME}-enter-done {
      height: auto;
      min-height: ${BLOCK_HEIGHT}px;
      padding: ${gutters.small / 4}px;
      opacity: 1;
    }
  `,
]);

const TextWrapper = styled.p<{ displayText?: boolean }>(({ displayText = false }) => [
  typographySubtitle2,
  css`
    height: ${displayText ? "auto" : "0"};
    color: ${whiteColor};
  `,
]);

const StyledCloseButtonWrapper = styled(CloseButtonWrapper)`
  align-self: center;
  margin: 0 ${gutters.large / 2}px;
  margin-top: 2px;
  background-color: transparent;
`;

const RibbonLeftWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin: auto ${gutters.large / 2}px auto ${gutters.small}px;
  width: 24px;
  height: 24px;

  svg {
    width: auto;
    max-width: 24px;
    height: 24px;
    fill: ${whiteColor};
  }
`;

const ProductNotification = ({
  id = "product-ribbon",
  className,
}: {
  id: string;
  className?: string;
}) => {
  const { notifications, currentNotification, timeOutRunning, setContextState } =
    useNotificationStateContext();

  const closeNotification = useCloseNotification();

  const notificationsRef = useRef(notifications);
  const timeoutRef = useRef(0);

  useEffect(() => {
    if (!currentNotification && notifications.length > 0) {
      window.setTimeout(() => {
        setContextState({ currentNotification: notifications[0] });
      }, 0);
    }
  }, [currentNotification, notifications, setContextState]);

  useEffect(() => {
    notificationsRef.current = notifications;
    if (currentNotification && !timeOutRunning) {
      setContextState({ timeOutRunning: true });
      timeoutRef.current = window.setTimeout(() => {
        setContextState({
          notifications: shiftNotificationQueue(notificationsRef.current),
          currentNotification: undefined,
          timeOutRunning: false,
        });
        window.clearTimeout(timeoutRef.current);
      }, 8000);
    }
  }, [closeNotification, currentNotification, notifications, setContextState, timeOutRunning]);

  const onCloseHandler = useCallback(() => {
    clearTimeout(timeoutRef.current);
    closeNotification();
  }, [closeNotification]);

  const Icon: React.ElementType =
    currentNotification?.customIcon ??
    getIconByType(currentNotification?.productType || Product.CUSTOM);

  return (
    <CSSTransition
      in={currentNotification !== undefined}
      timeout={DURATION}
      classNames={TRANSITION_NAME}
    >
      <RibbonContainer
        id={id}
        className={className}
        notificationColor={currentNotification?.notificationColor}
      >
        <RibbonLeftWrapper>
          {currentNotification && Icon ? (
            <IconWrapper>
              <Icon />
            </IconWrapper>
          ) : null}
          <TextWrapper displayText={currentNotification !== undefined}>
            {currentNotification?.ribbonText || ""}
          </TextWrapper>
        </RibbonLeftWrapper>
        {currentNotification && (
          <StyledCloseButtonWrapper onClick={onCloseHandler}>
            <StyledCloseIcon />
          </StyledCloseButtonWrapper>
        )}
      </RibbonContainer>
    </CSSTransition>
  );
};

export default ProductNotification;
