import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import Close from "@travelshift/ui/icons/close.svg";

import { gutters, separatorColor, whiteColor } from "styles/variables";

const CloseIconWrapper = styled.div<{
  backgroundColor: string;
}>(
  ({ backgroundColor }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: ${gutters.large / 4}px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background-color: ${backgroundColor};
    cursor: pointer;
  `
);

const CloseIcon = styled(Close)<{
  fillColor: string;
}>(
  ({ fillColor }) => css`
    width: 8px;
    height: 8px;
    fill: ${fillColor};
  `
);

const CloseButton = ({
  id,
  backgroundColor = separatorColor,
  iconColor = whiteColor,
  onClick,
}: {
  id: string;
  backgroundColor?: string;
  iconColor?: string;
  onClick?: () => void;
}) => {
  return (
    <CloseIconWrapper backgroundColor={backgroundColor} onClick={onClick} data-testid={id}>
      <CloseIcon fillColor={iconColor} />
    </CloseIconWrapper>
  );
};

export default CloseButton;
