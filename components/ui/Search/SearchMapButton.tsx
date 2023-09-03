import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";
import { useTheme } from "emotion-theming";

import { Trans } from "i18n";
import MapIcon from "components/icons/map.svg";
import { typographyBody2 } from "styles/typography";
import { gutters, borderRadiusSmall, greyColor, whiteColor } from "styles/variables";
import { mqMin } from "styles/base";

export const MapButton = styled.button<{ isMapOpen: boolean }>(({ theme, isMapOpen }) => [
  typographyBody2,
  css`
    position: relative;
    display: flex;
    align-items: center;
    margin-right: ${gutters.small}px;
    border: 1px solid ${theme.colors.primary};
    border-radius: ${borderRadiusSmall};
    height: 30px;
    padding: 0 ${gutters.large / 2}px;
    background-color: ${isMapOpen ? theme.colors.primary : whiteColor};
    color: ${isMapOpen ? whiteColor : greyColor};
    ${mqMin.medium} {
      height: 40px;
    }
  `,
]);

const StyledMapIcon = styled(MapIcon, { shouldForwardProp: () => false })<{
  isMapOpen: boolean;
}>(
  ({ isMapOpen, theme }) =>
    css`
      margin-right: ${gutters.small / 2}px;
      width: 14px;
      height: 14px;
      fill: ${isMapOpen ? whiteColor : theme.colors.primary};
      ${mqMin.large} {
        width: 20px;
        height: 20px;
      }
    `
);

const StyledIvisibleText = styled.span(
  () => css`
    visibility: hidden;
  `
);

const StyledBubblesOverlay = styled.div(
  () => css`
    position: absolute;
    left: 40%;
    width: 50%;
    height: 100%;
  `
);

const SearchMapButton = ({
  isMapOpen,
  isLoading = false,
  toggleIsMapOpen,
}: {
  isMapOpen: boolean;
  isLoading: boolean;
  toggleIsMapOpen: () => void;
}) => {
  const theme: Theme = useTheme();
  if (isLoading)
    return (
      <MapButton isMapOpen={isMapOpen}>
        <StyledMapIcon isMapOpen={isMapOpen} />
        <StyledIvisibleText>
          <Trans>Map</Trans>
        </StyledIvisibleText>
        <StyledBubblesOverlay>
          <Bubbles color={isMapOpen ? undefined : "primary"} theme={theme} />
        </StyledBubblesOverlay>
      </MapButton>
    );
  return (
    <MapButton onClick={toggleIsMapOpen} isMapOpen={isMapOpen}>
      <StyledMapIcon isMapOpen={isMapOpen} />
      <Trans>Map</Trans>
    </MapButton>
  );
};

export default SearchMapButton;
