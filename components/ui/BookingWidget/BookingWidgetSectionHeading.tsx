import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { redColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";

type Color = "action" | "primary" | "error";

type TriangleProp = {
  isFirst?: boolean;
  color: Color;
};

type Props = {
  children: React.ReactNode;
  className?: string;
  color?: Color;
  withArrows?: boolean;
};

const getColor = (color: Color, theme: Theme) => {
  switch (color) {
    case "primary":
      return theme.colors.primary;
    case "action":
      return theme.colors.action;
    case "error":
      return redColor;
    default:
      return theme.colors.primary;
  }
};

const Wrapper = styled.div<TriangleProp>(({ color, theme }) => [
  typographySubtitle2,
  css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 24px;
    background-color: ${rgba(getColor(color, theme), 0.1)};
    color: ${getColor(color, theme)};
    line-height: 24px;
  `,
]);

const Rectangle = styled.div<TriangleProp>(
  ({ color, theme }) =>
    css`
      position: absolute;
      left: 0px;
      width: 30px;
      height: 24px;
      background-color: ${rgba(getColor(color, theme), 0.2)};
    `
);

const Triangle = styled.div<TriangleProp>(
  ({ isFirst = false, color, theme }) =>
    css`
      position: absolute;
      left: ${isFirst ? 30 : 52}px;
      border-top: 12px solid transparent;
      border-bottom: 12px solid transparent;
      border-left: 12px solid ${rgba(getColor(color, theme), 0.1)};
      padding-right: ${isFirst ? 10 : 0}px;
      background-color: ${isFirst ? rgba(getColor(color, theme), 0.1) : "transparent"};
    `
);

const SectionBanner = ({ color = "action", children, className, withArrows = true }: Props) => (
  <Wrapper color={color} className={className}>
    {withArrows && (
      <>
        <Rectangle color={color} />
        <Triangle isFirst color={color} />
        <Triangle color={color} />
      </>
    )}
    {children}
  </Wrapper>
);

export default SectionBanner;
