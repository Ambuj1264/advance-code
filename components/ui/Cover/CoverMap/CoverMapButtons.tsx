import styled from "@emotion/styled";
import { css } from "@emotion/core";

import RightArrowIcon from "components/icons/diagram-arrow-corner-point-right-square.svg";
import { boxShadow, gutters, whiteColor } from "styles/variables";
import { mqMin } from "styles/base";
import { typographyCaptionSmall, typographySubtitle2 } from "styles/typography";

export const controlButtonsStyles = (isSmall: boolean) => [
  css`
    position: relative;
    display: flex;
    align-items: center;
    box-shadow: ${boxShadow};
    border-radius: ${gutters.large}px;
    padding: ${gutters.small / 2}px ${gutters.large}px ${gutters.small / 2}px
      ${(gutters.small / 2) * 5}px;
    background-color: ${whiteColor};

    ${typographyCaptionSmall}
    text-align: center;
  `,
  !isSmall &&
    css`
      ${mqMin.medium} {
        ${typographySubtitle2}
        padding: ${gutters.small}px ${gutters.large}px ${gutters.small}px
      ${gutters.large * 2}px;
      }
    `,
];
export const DirectionIcon = styled(RightArrowIcon)<{ isSmall: boolean }>(({ theme, isSmall }) => [
  css`
    position: absolute;
    left: 10px;
    margin-right: ${gutters.large / 2}px;
    width: 20px;
    height: 20px;
    fill: ${theme.colors.action};
  `,
  !isSmall &&
    css`
      ${mqMin.medium} {
        width: 28px;
        height: 28px;
      }
    `,
]);
export const DirectionsButton = styled.a<{ isSmall: boolean }>([
  ({ theme }) => css`
    color: ${theme.colors.primary};
  `,
  ({ isSmall }) => controlButtonsStyles(isSmall),
]);
