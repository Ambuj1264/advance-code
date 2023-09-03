import React, { ReactNode, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { whiteColor, borderRadius, gutters, zIndex, greyColor } from "styles/variables";
import { typographyCaption } from "styles/typography";

export const TooltipWrapper = styled.div<{
  elementWidth?: number;
  elementDirection?: TooltipTypes.Direction;
  bottom?: boolean;
}>(({ elementWidth, elementDirection = "center", bottom = false, theme }) => [
  typographyCaption,
  css`
    position: absolute;
    z-index: ${zIndex.max};
    ${bottom ? "top: 24px;" : "bottom: 105%;"}
    ${elementDirection === "right" && "left: 0;"}
    ${elementDirection === "left" && "right: 0;"}
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 0px 4px rgba(0, 0, 0, 0.25);
    border: 1px solid ${theme.colors.primary};
    border-radius: ${borderRadius};
    width: ${elementWidth ? `${elementWidth}px` : "auto"};
    max-height: 400px;
    padding: ${gutters.large / 2}px;
    background-color: ${whiteColor};
    color: ${greyColor};
    line-height: 20px;
    overflow-y: auto;
  `,
]);

export const Wrapper = styled.div<{
  fullWidth: boolean;
  isCustomTooltipWrapperAvailable: boolean;
}>(
  ({ fullWidth, isCustomTooltipWrapperAvailable }) =>
    css`
      position: ${isCustomTooltipWrapperAvailable ? "static" : "relative"};
      display: flex;
      justify-content: center;
      width: ${fullWidth ? "100%" : "auto"};
    `
);

const Tooltip = ({
  children,
  title,
  tooltipWidth,
  fullWidth = false,
  direction = "center",
  alwaysTop = false,
  isVisible = true,
  className,
  testid,
  topThreshold = 200,
  isCustomTooltipWrapperAvailable = false,
}: {
  children: ReactNode;
  title: string | ReactNode;
  tooltipWidth?: number;
  fullWidth?: boolean;
  direction?: TooltipTypes.Direction;
  alwaysTop?: boolean;
  isVisible?: boolean;
  className?: string;
  testid?: string;
  isCustomTooltipWrapperAvailable?: boolean;
  topThreshold?: number;
}) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = wrapperRef;
    if (current) {
      const showCallback = () => setShow(true);
      const hideCallback = () => setShow(false);
      current.addEventListener("mouseenter", showCallback);
      current.addEventListener("mouseleave", hideCallback);
      return () => {
        current.removeEventListener("mouseenter", showCallback);
        current.removeEventListener("mouseleave", hideCallback);
      };
    }
    return () => {};
  }, []);

  const top = wrapperRef.current?.getBoundingClientRect().top ?? 0;
  const isTooltipCloseToTop = !alwaysTop && top < topThreshold;
  return (
    <Wrapper
      ref={wrapperRef}
      fullWidth={fullWidth}
      className={className}
      isCustomTooltipWrapperAvailable={isCustomTooltipWrapperAvailable}
    >
      {show && isVisible && title && (
        <TooltipWrapper
          elementWidth={tooltipWidth}
          elementDirection={direction}
          bottom={isTooltipCloseToTop}
          data-testid={testid}
        >
          {title}
        </TooltipWrapper>
      )}
      {children}
    </Wrapper>
  );
};

export default Tooltip;
