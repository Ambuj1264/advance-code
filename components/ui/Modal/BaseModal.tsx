import React, { useRef, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { useMediaQuery } from "react-responsive";
import { css, keyframes } from "@emotion/core";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";

import useOnModalOutsideClick from "./useOnModalOutsideClick";

import useHTMLScrollLock from "hooks/useHTMLScrollLock";
import Portal from "components/ui/Portal";
import { blackOverlay, zIndex, breakpointsMax, borderRadius, greyColor } from "styles/variables";
import { mqMin, mqIE } from "styles/base";
import { useModalHistoryContext } from "contexts/ModalHistoryContext";

export const MODAL_ANIMATION_TIME = 300;
const fadeInPortal = keyframes`
  100% {
    opacity: 1;
  }
`;

const StyledPortal = styled(Portal)<{
  isScrollable: boolean;
  isDisplayed?: boolean;
  withAnimation?: boolean;
  topMost?: boolean;
  customZIndex?: number;
}>(({ isScrollable, isDisplayed = true, withAnimation = true, topMost = false, customZIndex }) => [
  css`
    position: ${isScrollable ? "absolute" : "fixed"};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${topMost ? zIndex.max + 1 : zIndex.max};
    display: ${isDisplayed ? "flex" : "none"};
    align-items: center;
    justify-content: center;
  `,
  customZIndex !== undefined &&
    css`
      z-index: ${customZIndex};
    `,
  withAnimation &&
    css`
      ${mqMin.large} {
        opacity: 0;
        animation: ${fadeInPortal} ${MODAL_ANIMATION_TIME}ms ease-out forwards;
      }
    `,
]);

const slideInModal = keyframes`
  100% {
    transform: translateY(0);
  }
`;

const ModalContainer = styled.div<{
  position: "center" | "top";
  isScrollable: boolean;
  isAnimationEnabled: boolean;
}>(({ position, isScrollable, isAnimationEnabled }) => [
  css`
    top: ${position === "top" ? "80px" : "auto"};
    width: 100%;
    height: 100%;
    color: ${greyColor};
    ${mqMin.large} {
      position: ${isScrollable ? "absolute" : "fixed"};
      border-radius: ${borderRadius};
      width: auto;
      height: auto;
      overflow: hidden;
    }

    ${mqIE} {
      position: static;
    }
  `,
  isAnimationEnabled &&
    css`
      ${mqMin.large} {
        transform: translateY(-50px);
        animation: ${slideInModal} 0.3s ease-out forwards;
      }
    `,
]);

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${blackOverlay};
`;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction = () => {};

const BaseModal = ({
  children,
  id,
  beforeElementId,
  onClose = emptyFunction,
  position = "center",
  isScrollable = false,
  bottomContent,
  topContent,
  isAnimationEnabled = true,
  className,
  disableCloseOnOutsideClick = false,
  topMost,
  customZIndex,
}: {
  children: React.ReactElement;
  id: string;
  onClose?: () => void;
  beforeElementId?: string;
  position?: "center" | "top";
  isScrollable?: boolean;
  bottomContent?: React.ReactElement;
  topContent?: React.ReactElement;
  isAnimationEnabled?: boolean;
  topMost?: boolean;
  className?: string;
  disableCloseOnOutsideClick?: boolean;
  customZIndex?: number;
}) => {
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const modalRef = useRef<HTMLDivElement>(null);
  const { pushModal, resetState, currentId, modals } = useModalHistoryContext();

  useHTMLScrollLock(isScrollable);

  const closeAllModals = useCallback(() => {
    if (isMobile) return;
    resetState();
  }, [isMobile, resetState]);

  useOnModalOutsideClick({
    ref: modalRef,
    handler: disableCloseOnOutsideClick ? emptyFunction : closeAllModals,
    modalId: id,
  });

  useEffect(() => {
    if (id) {
      pushModal({ id, onClose });
    }
  }, [id, pushModal, onClose]);

  const prevOpenedModalsCount = usePreviousState(modals.length);
  const allOpenedModalsClosed = prevOpenedModalsCount === 0;

  return (
    <StyledPortal
      id={id}
      isDisplayed={id === currentId}
      beforeElementId={beforeElementId}
      isScrollable={isScrollable}
      withAnimation={allOpenedModalsClosed}
      topMost={topMost}
      customZIndex={customZIndex}
    >
      {topContent}
      <ModalContainer
        position={position}
        role="dialog"
        isScrollable={isScrollable}
        className={className}
        isAnimationEnabled={isAnimationEnabled && allOpenedModalsClosed}
      >
        {React.cloneElement(children, {
          ref: modalRef,
        })}
      </ModalContainer>
      {bottomContent}
      <Overlay role="presentation" aria-hidden />
    </StyledPortal>
  );
};

export default BaseModal;
