import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import MapIcon from "components/icons/map-point-2.svg";
import { typographySubtitle1 } from "styles/typography";
import { borderRadius, gutters, whiteColor } from "styles/variables";
import { mqMax } from "styles/base";

const MapIconStyled = styled(MapIcon)(css`
  width: auto;
  height: 24px;
`);

const MapTitleStyled = styled.span();

const mapButtonCompactStyles = css`
  min-width: unset;
  padding: ${gutters.small / 2}px;
  ${MapTitleStyled} {
    display: none;
  }
`;

export const MapButtonStyled = styled.button<{
  isCompact: boolean;
  isCompactOnMobile: boolean;
  isReversed: boolean;
}>(({ isCompact, isCompactOnMobile, isReversed, theme }) => [
  typographySubtitle1,
  css`
    display: flex;
    align-items: center;
    box-shadow: 0px 8px 4px rgba(0, 0, 0, 0.15);
    border: 2px solid ${whiteColor};
    border-radius: ${borderRadius};
    min-width: 88px;
    height: 40px;
    padding: ${gutters.small / 2}px ${gutters.small}px;
    background-color: ${theme.colors.primary};
    color: ${whiteColor};
    outline: none;

    ${MapTitleStyled} {
      margin-left: ${gutters.small / 2}px;
    }

    ${MapIconStyled} {
      path {
        fill: ${whiteColor};
      }
    }
  `,
  isCompact && mapButtonCompactStyles,
  isCompactOnMobile &&
    css`
      ${mqMax.large} {
        ${mapButtonCompactStyles}
      }
    `,
  isReversed &&
    css`
      background-color: ${whiteColor};
      color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};

      ${MapIconStyled} {
        path {
          fill: ${theme.colors.primary};
        }
      }
    `,
]);

const MapButton = ({
  onClick,
  title,
  isCompact = false,
  isReversed = false,
  isCompactOnMobile = false,
}: {
  onClick: () => void;
  title: string;
  isCompact?: boolean;
  isReversed?: boolean;
  isCompactOnMobile?: boolean;
}) => {
  return (
    <MapButtonStyled
      onClick={onClick}
      isReversed={isReversed}
      isCompact={isCompact}
      isCompactOnMobile={isCompactOnMobile}
      {...(isCompact ? { title } : {})}
    >
      <MapIconStyled />
      {!isCompact && <MapTitleStyled>{title}</MapTitleStyled>}
    </MapButtonStyled>
  );
};

export default MapButton;
