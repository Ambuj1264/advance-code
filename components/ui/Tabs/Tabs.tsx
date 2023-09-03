import React from "react";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { typographySubtitle2 } from "styles/typography";

export const TabsWrapper = styled.div<{ hasUnderlineStyle: boolean }>(
  ({ hasUnderlineStyle, theme }) => css`
    display: flex;
    border-width: 0;
    border-bottom-width: ${hasUnderlineStyle ? "1px" : 0};
    border-color: ${rgba(theme.colors.primary, 0.1)};
    border-style: solid;
  `
);

export const Tab = styled.button<{
  active?: boolean;
  hasUnderlineStyle: boolean;
}>(({ active, hasUnderlineStyle, theme }) => [
  typographySubtitle2,
  css`
    flex: 1;
    box-sizing: content-box;
    height: 40px;
    background-color: ${active && !hasUnderlineStyle
      ? rgba(theme.colors.primary, 0.05)
      : "transparent"};
    color: ${theme.colors.primary};
    text-align: center;
    border-bottom-width: ${active && hasUnderlineStyle ? "2px" : 0};
    border-color: ${theme.colors.primary};
    border-style: solid;
  `,
]);

const Tabs = ({
  labels,
  currentIndex,
  onChange,
  hasUnderlineStyle = false,
}: {
  labels: string[];
  currentIndex: number;
  onChange: (index: number) => void;
  hasUnderlineStyle?: boolean;
}) => (
  <TabsWrapper hasUnderlineStyle={hasUnderlineStyle}>
    {labels.map((label, index) => (
      <Tab
        hasUnderlineStyle={hasUnderlineStyle}
        key={label}
        active={currentIndex === index}
        onClick={() => onChange(index)}
      >
        {label}
      </Tab>
    ))}
  </TabsWrapper>
);

export default Tabs;
