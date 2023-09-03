import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  gutters,
  lightBlueColor,
  fontWeightBold,
  fontSizeBody2,
  separatorColor,
} from "styles/variables";
import { mqMin } from "styles/base";
import Button from "components/ui/Inputs/Button";

export const DropdownWrapper = styled.div`
  margin-top: ${gutters.small}px;
  ${mqMin.large} {
    width: 100%;
    max-width: 330px;
  }
`;

export const iconStyles = (isDisabled = false) => [
  css`
    width: 16px;
    height: 16px;
    fill: ${isDisabled === true ? separatorColor : lightBlueColor};
  `,
];

export const ButtonWrapper = styled.div<{
  maxWidth?: string;
}>(({ maxWidth }) => [
  css`
    display: flex;
    justify-content: center;
    margin-top: ${gutters.small}px;
    width: 100%;
    align-content: center;

    ${mqMin.large} {
      margin-right: ${gutters.small}px;
      max-width: ${maxWidth || "200px"};
    }
  `,
]);

export const ButtonStyled = styled(Button, { shouldForwardProp: () => true })`
  width: 100%;
  font-size: ${fontSizeBody2};
  font-weight: ${fontWeightBold};
`;

export const BubblesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
