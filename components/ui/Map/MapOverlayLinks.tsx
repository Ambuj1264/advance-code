import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ClientLink from "../ClientLink";
import { Container } from "../StickyFooter/MobileStickyFooter";

import { typographyBody2 } from "styles/typography";
import {
  blackColor,
  blueColor,
  fontWeightSemibold,
  gutters,
  whiteColor,
  zIndex,
} from "styles/variables";
import { mqMin } from "styles/base";

export const MapOverlayWrapper = styled(Container)<{
  alwaysDisplay?: boolean;
}>(({ alwaysDisplay }) => [
  css`
    position: absolute;
    top: 0;
    bottom: auto;
    left: 0;
    z-index: ${zIndex.z1};
    background-color: ${rgba(blackColor, 0.4)};
  `,
  !alwaysDisplay &&
    css`
      display: none;
    `,
]);

export const iconStyles = (isActive?: boolean) => css`
  margin-right: 5px;
  width: 16px;
  height: 16px;
  vertical-align: text-top;
  fill: ${isActive ? whiteColor : blueColor};
`;

export const MapOverlayLink = styled(ClientLink)<{ isActive?: boolean }>([
  typographyBody2,
  ({ isActive, theme }) => css`
    display: inline-block;
    margin-right: ${gutters.small / 2}px;
    margin-bottom: ${gutters.small / 2}px;
    box-shadow: 0 0 4px ${rgba(blackColor, 0.15)};
    border: 1px solid ${isActive ? whiteColor : "transparent"};
    border-radius: 16px;
    height: 32px;
    padding: 0 ${gutters.large / 2}px;
    background-color: ${isActive ? theme.colors.primary : whiteColor};
    color: ${isActive ? whiteColor : theme.colors.primary};
    font-weight: ${fontWeightSemibold};
    line-height: 30px;
    scroll-snap-align: start;
  `,
]);

export const Wrapper = styled.div<{}>`
  margin-left: ${gutters.small}px;
  width: 100%;
  min-height: 48px;
  padding: ${gutters.small / 2}px 0 0 ${gutters.small}px;
  cursor: default;
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  ${mqMin.large} {
    margin-left: 0;
    white-space: normal;
  }

  ${MapOverlayLink}:last-child {
    margin-right: ${gutters.small}px;
  }
`;
