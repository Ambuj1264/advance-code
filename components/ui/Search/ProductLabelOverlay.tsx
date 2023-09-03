import React from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { withTheme } from "emotion-theming";
import { css } from "@emotion/core";

import { fontSizeCaption, fontWeightSemibold, gutters, whiteColor } from "styles/variables";
import { typographyCaptionSemibold } from "styles/typography";

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: 122px;
  height: 70px;
  overflow: hidden;
`;

export const ProductLabelValue = styled.span(
  ({ theme }) => css`
    position: absolute;
    right: 0;
    bottom: 0;
    height: 17px;
    padding: 0 ${gutters.small / 2}px;
    background-color: ${rgba(theme.colors.action, 0.9)};
    color: ${whiteColor};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
    line-height: 17px;
  `
);

export const Label = styled.span<{ backgroundColor: string }>(
  ({ backgroundColor }) => css`
    display: block;
    margin-top: ${gutters.large}px;
    margin-left: ${gutters.small / 2}px;
    width: 120%;
    height: 19px;
    background-color: ${rgba(backgroundColor, 0.8)};
    color: ${whiteColor};
    ${typographyCaptionSemibold};
    line-height: 17px;
    text-align: center;
    transform: rotate(33deg);
    transform-origin: center;
  `
);

const ProductLabelOverlay = ({
  className,
  theme,
  children,
}: {
  className?: string;
  children: React.ReactNode;
  theme: Theme;
}) => (
  <Wrapper className={className}>
    <Label backgroundColor={theme.colors.action}>{children}</Label>
  </Wrapper>
);

export default withTheme(ProductLabelOverlay);
