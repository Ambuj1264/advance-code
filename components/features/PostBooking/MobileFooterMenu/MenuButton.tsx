import React, { ElementType } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import { typographyCaption } from "../../../../styles/typography";

import { greyColor, gutters } from "styles/variables";

const iconStyles = (theme: Theme, isActive?: boolean) => css`
  width: 20px;
  height: 20px;
  fill: ${isActive ? theme.colors.primary : greyColor};
`;

const StyledButton = styled("button")(
  ({ isActive, theme }: { isActive?: boolean; theme: Theme }) => [
    typographyCaption,
    css`
      display: flex;
      flex-direction: column;
      align-items: center;
      color: ${isActive ? theme.colors.primary : greyColor};
      outline: none;
      &:not(:last-child) {
        margin-right: ${gutters.small}px;
      }
    `,
  ]
);

const MenuButton = ({
  label,
  isActive,
  onClick,
  Icon,
}: {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  Icon?: ElementType;
}) => {
  const theme: Theme = useTheme();
  return (
    <StyledButton onClick={onClick} type="button" theme={theme} isActive={isActive}>
      {Icon && <Icon css={iconStyles(theme, isActive)} />}
      <span>{label}</span>
    </StyledButton>
  );
};

export default MenuButton;
