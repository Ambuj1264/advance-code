import React, { useCallback, useRef, useState, useEffect, RefObject } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import useOnDragScroll from "hooks/useOnDragScroll";
import { RowWrapper } from "components/ui/SimilarProducts/SimilarProductsWrapper";
import Row from "components/ui/Grid/Row";
import { columnPaddings, mqMin } from "styles/base";
import { whiteColor } from "styles/variables";
import { useOnWindowResize } from "hooks/useOnResize";

const StyledRowWrapper = styled(RowWrapper)`
  position: relative;
  ${mqMin.large} {
    margin-right: 0;

    ${Row} {
      padding-bottom: 0;
    }
  }
`;

export const StyledSimilarProductsColumn = styled.div<{
  productsCount: number;
}>([
  columnPaddings,
  css`
    flex-shrink: 0;
    width: 288px;
    scroll-snap-align: start;
  `,
  ({ productsCount }) => css`
    ${mqMin.desktop} {
      min-width: ${productsCount > 3 ? 288 : 314}px;
      max-width: ${100 / 3}%;
    }
  `,
]);

const StyledScrollOverlay = styled.div<{ isVisible: boolean }>(
  ({ isVisible }) => css`
    position: absolute;
    top: 0;
    right: -20px;
    width: ${isVisible ? 90 : 0}px;
    height: 100%;
    background: linear-gradient(270deg, ${whiteColor} 37.75%, rgba(255, 255, 255, 0) 100%);
    opacity: ${isVisible ? 1 : 0};
    transition: opacity 250ms ease-in;
  `
);

const ScrollOverlay = ({ scrollableRef }: { scrollableRef: RefObject<HTMLElement> }) => {
  const visibilityCondition = useCallback(
    () =>
      Boolean(
        scrollableRef.current &&
          scrollableRef.current.scrollWidth - scrollableRef.current.scrollLeft >
            scrollableRef.current.clientWidth + 40
      ),
    [scrollableRef]
  );

  const [isVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    setOverlayVisible(visibilityCondition());
  }, [visibilityCondition]);

  const onScroll = useCallback(() => {
    setOverlayVisible(visibilityCondition());
  }, [visibilityCondition]);

  useOnWindowResize(() => setOverlayVisible(visibilityCondition()));

  useEffect(() => {
    const scrollableContainer = scrollableRef.current;
    scrollableContainer?.addEventListener("scroll", onScroll);

    return () => scrollableContainer?.removeEventListener("scroll", onScroll);
  }, [scrollableRef, onScroll]);

  return <StyledScrollOverlay isVisible={isVisible} />;
};

const ProductCardRow = ({
  children,
  className,
  withScrollOverlay = true,
}: {
  children: React.ReactNode;
  className?: string;
  withScrollOverlay?: boolean;
}) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  useOnDragScroll({ ref });

  return (
    <StyledRowWrapper className={className}>
      <Row
        ref={isMobile ? undefined : ref}
        css={
          !isMobile &&
          css`
            user-select: none;
          `
        }
      >
        {children}
      </Row>
      {!isMobile && withScrollOverlay && <ScrollOverlay scrollableRef={ref} />}
    </StyledRowWrapper>
  );
};

export default ProductCardRow;
