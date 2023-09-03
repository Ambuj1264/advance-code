import React, { forwardRef, ReactNode, Ref } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import Tooltip from "../Tooltip/Tooltip";

import BookingWidgetSectionHeading from "./BookingWidgetSectionHeading";

import { mqMax, mqMin, singleLineTruncation } from "styles/base";
import {
  borderRadiusSmall,
  fontSizeBody1,
  fontSizeBody2,
  fontSizeMiddleCaption,
  fontWeightBold,
  gutters,
  guttersPx,
  whiteColor,
  zIndex,
} from "styles/variables";

export const StickyHeaderContainer = styled.div(
  ({
    top,
    resetNegativeLeftRightMargins = true,
  }: {
    top?: number;
    resetNegativeLeftRightMargins?: boolean;
  }) => [
    css`
      position: sticky;
      top: ${top ?? 0}px;
      z-index: ${zIndex.z9};
      background: ${whiteColor};

      ${mqMin.large} {
        position: static;
      }
    `,
    resetNegativeLeftRightMargins &&
      css`
        ${mqMax.large} {
          margin-right: -${gutters.small}px;
          margin-left: -${gutters.small}px;
          > div {
            margin-right: 0;
            margin-left: 0;
          }
        }
      `,
  ]
);

export const StyledBookingWidgetSectionHeading = styled(BookingWidgetSectionHeading)([
  singleLineTruncation,
  css`
    position: relative;
    margin-top: ${guttersPx.large};
    overflow: visible;
  `,
]);

export const SectionHeaderDateContent = styled.div(
  ({ theme }) => css`
    border-radius: ${borderRadiusSmall};
    width: 40px;
    height: 40px;
    background-color: ${rgba(theme.colors.primary, 0.9)};
    color: ${whiteColor};
    font-size: ${fontSizeBody1};
    font-weight: bold;
    line-height: ${fontSizeBody2};
    text-align: center;
    white-space: pre-line;

    &::first-line {
      font-size: ${fontSizeMiddleCaption};
      font-weight: normal;
      line-height: 20px;
    }
  `
);

const SectionHeaderDateWrapper = styled.div(
  () => css`
    position: absolute;
    left: ${guttersPx.small};
    border-radius: ${borderRadiusSmall};
    background: ${whiteColor};

    ${mqMin.large} {
      left: ${guttersPx.large};
    }
  `
);

export const SectionHeaderDate = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <SectionHeaderDateWrapper className={className}>
    <SectionHeaderDateContent>{children}</SectionHeaderDateContent>
  </SectionHeaderDateWrapper>
);

const SectionHeaderTitle = styled.span([
  singleLineTruncation,
  css`
    max-width: 70%;
    font-weight: ${fontWeightBold};
  `,
]);

const VPBookingWidgetSectionHeader = (
  {
    children,
    date,
    className,
    withTooltip = false,
  }: {
    children: ReactNode;
    date?: string;
    className?: string;
    withTooltip?: boolean;
  },
  ref: Ref<HTMLSelectElement>
) => (
  <StyledBookingWidgetSectionHeading color="primary" className={className} withArrows={false}>
    {date && <SectionHeaderDate>{date}</SectionHeaderDate>}

    {withTooltip ? (
      <Tooltip title={children} fullWidth>
        <SectionHeaderTitle ref={ref}>{children}</SectionHeaderTitle>
      </Tooltip>
    ) : (
      <SectionHeaderTitle ref={ref}>{children}</SectionHeaderTitle>
    )}
  </StyledBookingWidgetSectionHeading>
);

export default forwardRef(VPBookingWidgetSectionHeader);
