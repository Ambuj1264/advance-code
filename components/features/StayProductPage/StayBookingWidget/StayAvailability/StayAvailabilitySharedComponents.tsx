import { css } from "@emotion/core";
import styled from "@emotion/styled";

import InformationIcon from "components/icons/information-circle.svg";
import { gutters } from "styles/variables";

export const StyledInformationIconWrapper = styled.span(
  () => css`
    display: inline-block;
    margin-right: ${gutters.small / 2}px;
    cursor: pointer;
  `
);

export const StyledInformationIcon = styled(InformationIcon)<{ isSelected?: boolean }>(
  ({ theme, isSelected = false }) => css`
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    fill: ${isSelected ? theme.colors.action : theme.colors.primary};
  `
);
