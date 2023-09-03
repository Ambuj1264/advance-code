import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { FlightExtraIconType } from "../FlightSearchPage/types/flightEnums";

import PersonalItemIcon from "components/icons/shopping-bag-heart.svg";
import BagIcon from "components/icons/bag-handle.svg";
import WeightIcon from "components/icons/baggage-weight-2.svg";
import { greyColor, gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import CabinBag from "components/icons/cabin-bag.svg";
import CheckMarkIcon from "components/icons/check-1.svg";
import { mqMin } from "styles/base";

const StyledBagIcon = styled(BagIcon)(
  ({ theme }) => css`
    margin-top: -4px;
    margin-right: ${gutters.small / 2}px;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

const ExtraInfo = styled.div([
  css`
    display: flex;
    flex-direction: column;
    width: 100%;
    ${mqMin.large} {
      flex-direction: row;
      align-items: center;
    }
  `,
]);

const HighlightWrapper = styled.div([
  css`
    display: flex;
    margin-right: ${gutters.small}px;
    margin-bottom: 4px;
    ${mqMin.large} {
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;
    }
  `,
]);

const HighlightTitle = styled.div([
  typographyBody2,
  css`
    color: ${greyColor};
  `,
]);

const StyledCabinIcon = styled(CabinBag)(
  ({ theme }) => css`
    margin-top: -4px;
    margin-right: ${gutters.large / 2}px;
    width: 12px;
    height: 20px;
    fill: ${theme.colors.primary};
  `
);

const StyledPersonalItemIcon = styled(PersonalItemIcon)(
  ({ theme }) => css`
    margin-top: -4px;
    margin-right: ${gutters.large / 2}px;
    width: 12px;
    height: 20px;
    fill: ${theme.colors.primary};
  `
);

const StyledWeightIcon = styled(WeightIcon)(
  ({ theme }) => css`
    margin-right: ${gutters.small / 2}px;
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primary};
  `
);

const StyledCheckMarkIcon = styled(CheckMarkIcon)(
  ({ theme }) => css`
    margin-right: ${gutters.large / 2}px;
    width: 12px;
    height: 10px;
    fill: ${theme.colors.action};
  `
);

const HighlightIcon = ({ iconId }: { iconId: FlightExtraIconType }) => {
  switch (iconId) {
    case FlightExtraIconType.CABINBAG:
      return <StyledCabinIcon />;
    case FlightExtraIconType.CARRYON:
      return <StyledBagIcon />;
    case FlightExtraIconType.PERSONAL_ITEM:
      return <StyledPersonalItemIcon />;
    case FlightExtraIconType.BAG_WEIGHT:
      return <StyledWeightIcon />;
    case FlightExtraIconType.SELECTED:
      return <StyledCheckMarkIcon />;
    default:
      return <StyledCabinIcon />;
  }
};

const Highlight = ({ highlight }: { highlight: FlightTypes.FlightExtra }) => (
  <HighlightWrapper>
    <HighlightIcon iconId={highlight.iconId} />
    <HighlightTitle>{highlight.title}</HighlightTitle>
  </HighlightWrapper>
);

const FlightExtraHighlight = ({ highlights }: { highlights: FlightTypes.FlightExtra[] }) => {
  return (
    <ExtraInfo>
      {highlights.map(highlight => (
        <Highlight key={`${highlight.iconId}Highlight`} highlight={highlight} />
      ))}
    </ExtraInfo>
  );
};

export default FlightExtraHighlight;
