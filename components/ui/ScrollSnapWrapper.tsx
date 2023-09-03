import React, { Ref } from "react";
import { css, jsx, SerializedStyles } from "@emotion/core";
import styled from "@emotion/styled";

import Row from "components/ui/Grid/Row";
import { mqMin, mqMax } from "styles/base";
import { gutters } from "styles/variables";

export const StyledRow = styled(Row)`
  flex-wrap: nowrap;
  margin-right: 0px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  ${mqMax.large} {
    margin: 0 -${gutters.small}px -${gutters.small}px -${gutters.small}px;
    padding: 0 ${gutters.small / 2}px ${gutters.small}px ${gutters.small / 2}px;
  }
`;

export const columnStyles = (minWidth: number, needResetMinWidth: boolean) => css`
  display: flex;
  min-width: ${minWidth}px;
  scroll-snap-align: start;

  ${needResetMinWidth &&
  `
      ${mqMin.large} {
        min-width: unset; 
      }
  `}
`;

const cloneElementWithStyles = (
  element: React.ReactElement,
  props: { css: SerializedStyles; key: string }
) =>
  jsx(element.type, {
    ...element.props,
    ...props,
  });

const ScrollSnapWrapper = ({
  children,
  className,
  minWidth = 250,
  needResetMinWidth = true,
  forwardRef,
}: {
  children: React.ReactElement[];
  className?: string;
  minWidth?: number;
  needResetMinWidth?: boolean;
  forwardRef?: Ref<HTMLDivElement>;
}) => (
  <StyledRow className={className} ref={forwardRef}>
    {children.map((child, index) =>
      cloneElementWithStyles(child, {
        css: columnStyles(minWidth, needResetMinWidth),
        key: index.toString(),
      })
    )}
  </StyledRow>
);

export default ScrollSnapWrapper;
