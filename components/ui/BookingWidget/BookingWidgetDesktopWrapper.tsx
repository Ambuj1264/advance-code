import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import useBWScroll from "./useBWScroll";

import { Provider as BookingWidgetRefContextProvider } from "components/ui/BookingWidget/BookingWidgetRefContext";
import {
  zIndex,
  whiteColor,
  boxShadowStrong,
  borderRadius,
  containerMaxWidth,
  gutters,
} from "styles/variables";

export const HEADER_HEIGHT_WITH_TITLE = 145;

const padding = 80;

export const initialOffset = 145;

export const stickyOffset = 50;

const Wrapper = styled.div<{
  footerAdditionalHeight: number;
  distancetotop: number;
  showOverlay?: boolean;
  ontop?: boolean;
}>(({ footerAdditionalHeight, showOverlay, distancetotop, ontop }) => [
  css`
    position: relative;
    height: calc(
      100vh - ${ontop ? `${stickyOffset}px` : `${Math.abs(initialOffset - distancetotop)}px`}
    );
    padding-bottom: ${padding + footerAdditionalHeight}px;
    overflow-y: scroll;
    overscroll-behavior: contain;
    &::-webkit-scrollbar {
      width: 0;
    }
  `,
  showOverlay !== undefined &&
    css`
      position: relative;
      overflow-y: ${showOverlay ? "hidden" : "auto"};
    `,
]);

const BookingWidgetOverlay = styled.div<{ cssHeight?: number; show?: boolean }>(
  ({ cssHeight, show }) => [
    css`
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: ${zIndex.z2};
      width: 100%;
      height: ${show ? `${cssHeight}px` : "auto"};
      background-color: ${whiteColor};
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `,
    show &&
      css`
        pointer-events: auto;
        opacity: 1;
      `,
  ]
);

const StickyContainer = styled.div(
  css`
    position: sticky;
    top: ${stickyOffset}px;
    box-shadow: ${boxShadowStrong};
    border-radius: ${borderRadius};
    max-width: calc(${containerMaxWidth} / 3 - ${gutters.small * 2}px);
    overflow: hidden;
  `
);
const BookingWidgetDesktopContainer = ({
  children,
  footer,
  className,
  footerAdditionalHeight = 0,
  showOverlay,
}: {
  children: React.ReactNode;
  className?: string;
  footer: React.ReactNode;
  footerAdditionalHeight?: number;
  showOverlay?: boolean;
}) => {
  const { bookingWidgetRef, elDistanceToTop, hasReachedHeader } = useBWScroll();

  const [bookingWidgetScrollHeight, setBookingWidgetScrollHeight] = useState(0);
  useEffect(() => {
    if (showOverlay === undefined) return;

    // eslint-disable-next-line prefer-destructuring
    const scrollHeight = bookingWidgetRef.current?.scrollHeight;
    if (!bookingWidgetScrollHeight) {
      setBookingWidgetScrollHeight(scrollHeight || 2000);
    }
  }, [bookingWidgetScrollHeight, showOverlay, elDistanceToTop, bookingWidgetRef]);

  return (
    <StickyContainer className={className}>
      <Wrapper
        ref={bookingWidgetRef}
        footerAdditionalHeight={footerAdditionalHeight}
        showOverlay={showOverlay}
        distancetotop={elDistanceToTop}
        ontop={hasReachedHeader}
      >
        {showOverlay !== undefined && (
          <BookingWidgetOverlay cssHeight={bookingWidgetScrollHeight} show={showOverlay} />
        )}
        <BookingWidgetRefContextProvider value={bookingWidgetRef}>
          {children}
        </BookingWidgetRefContextProvider>
      </Wrapper>
      {footer}
    </StickyContainer>
  );
};

export default BookingWidgetDesktopContainer;
