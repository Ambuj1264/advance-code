import styled from "@emotion/styled";
import React from "react";
import { css } from "@emotion/core";

import ArrowDown from "components/icons/arrow-down.svg";
import { mqMin } from "styles/base";
import { borderRadius, gutters, guttersPx } from "styles/variables";
import { typographyCaptionSemibold, typographySubtitle2 } from "styles/typography";

const StyledArrowDown = styled(ArrowDown)(
  ({ theme }) => css`
    position: relative;
    top: -4px;
    width: 7px;
    height: 6px;
    fill: ${theme.colors.primary};

    ${mqMin.large} {
      top: -6px;
      width: 9px;
      height: 8px;
    }
  `
);

const StyledNavigationContainer = styled.div(
  () => css`
    display: flex;
    flex-flow: row;
    flex-wrap: no-wrap;
    margin-bottom: ${gutters.large * 2}px;
    height: 30px;
  `
);

const StyledNavigationNavWrapper = styled.div(
  () => css`
    display: flex;
    flex-grow: 1;
    align-items: center;
    margin: 0 ${guttersPx.smallHalf};
    transform: translateY(50%);
  `
);

const StyledNavigationNav = styled.div(
  ({ theme }) => css`
    ${typographyCaptionSemibold};
    color: ${theme.colors.primary};
    ${mqMin.large} {
      ${typographySubtitle2};
    }
  `
);

const StyledNavigationArrowLine = styled.div(
  ({ theme }) => css`
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;

    border: 1px solid ${theme.colors.primary};
    border-top: 0;
    border-right: 0;
    border-bottom-left-radius: ${borderRadius};

    ${StyledArrowDown} {
      position: absolute;
      top: auto;
      right: -2px;
      bottom: 0;
      transform: rotate(-90deg) translateX(-50%);
    }
  `
);

export const PBTimelineNavigationItem = ({
  children,
}: {
  children: React.ReactElement | React.ReactChildren | React.ReactElement[];
}) => (
  <StyledNavigationContainer>
    <StyledNavigationArrowLine>
      <StyledArrowDown />
    </StyledNavigationArrowLine>
    <StyledNavigationNavWrapper>
      <StyledNavigationNav>{children}</StyledNavigationNav>
    </StyledNavigationNavWrapper>
  </StyledNavigationContainer>
);
