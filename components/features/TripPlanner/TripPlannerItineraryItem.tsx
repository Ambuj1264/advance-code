import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";

import { TripPlannerActivity } from "./types/tripPlannerTypes";

import { fontSizeBody2, greyColor, gutters } from "styles/variables";

const ItemTitle = styled.p(({ theme }) => [
  css`
    margin-right: ${gutters.small / 2}px;
    color: ${theme.colors.primary};
    font-size: ${fontSizeBody2};
  `,
]);

const iconStyles = css`
  width: auto;
  height: 16px;
  min-height: 16px;
  fill: ${rgba(greyColor, 0.6)};
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${gutters.small / 4}px;
  width: 40px;
  min-width: 40px;
  height: 32px;
`;

export const Wrapper = styled.div(({ hasMarginBottom }: { hasMarginBottom?: boolean }) => [
  css`
    display: flex;
    align-items: center;
  `,

  hasMarginBottom
    ? css`
        margin-bottom: ${gutters.small / 2}px;
      `
    : "",
]);

const TripPlannerItineraryItem = ({ activity }: { activity: TripPlannerActivity }) => {
  const theme: Theme = useTheme();
  const { name, Icon } = activity;

  return (
    <Wrapper>
      <IconWrapper>{Icon && <Icon css={iconStyles} />}</IconWrapper>
      <ItemTitle theme={theme}>{name}</ItemTitle>
    </Wrapper>
  );
};

export default TripPlannerItineraryItem;
