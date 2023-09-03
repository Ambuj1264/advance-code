import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Button from "@travelshift/ui/components/Inputs/Button";

import {
  gutters,
  whiteColor,
  borderRadius,
  redCinnabarColor,
  fontSizeBody2,
} from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { clampLines } from "styles/base";
import IconLoading from "components/ui/utils/IconLoading";
import CustomNextDynamic from "lib/CustomNextDynamic";

const Close = CustomNextDynamic(() => import("@travelshift/ui/icons/close.svg"), {
  loading: IconLoading,
});

export const ItemWrapper = styled.div<{ isAvailable?: boolean }>(
  ({ theme, isAvailable = true }) => [
    typographySubtitle2,
    css`
      position: relative;
      display: flex;
      margin-top: ${gutters.small}px;
      border: 1px solid ${rgba(isAvailable ? theme.colors.primary : redCinnabarColor, 0.01)};
      border-radius: ${borderRadius};
      width: 100%;
      min-height: 48px;
      background-color: ${rgba(isAvailable ? theme.colors.primary : redCinnabarColor, 0.1)};
      overflow: hidden;
    `,
  ]
);

export const ItemContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  padding: ${gutters.small / 2}px;
`;

export const Text = styled.div(clampLines(2));

export const iconStyles = css`
  width: 18px;
  height: 18px;
  fill: ${whiteColor};
`;

export const CloseButtonWrapper = styled.div<{ isAvailable?: boolean }>(
  ({ theme, isAvailable = true }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 16px;
    min-width: 16px;
    height: 16px;
    background-color: ${isAvailable ? rgba(theme.colors.primary, 0.2) : redCinnabarColor};
    cursor: pointer;
  `
);

export const CloseIcon = styled(Close)`
  width: 8px;
  height: 8px;
  fill: ${whiteColor};
`;

export const StyledCartButton = styled(Button, { shouldForwardProp: () => true })`
  margin-top: ${gutters.small}px;
  font-size: ${fontSizeBody2};
`;
